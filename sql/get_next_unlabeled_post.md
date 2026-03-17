# `get_next_unlabeled_post` — Deep Dive

This function assigns a labeling task to a user in a single, atomic, race-condition-safe SQL query. No application logic. No second round-trip. No two users ever get the same post.

---

## What it does

Given a user ID, it returns one dataset row for that user to label — either resuming their in-progress item or picking the best available one — and records that assignment in the database.

It also returns the user's progress stats (`labeled_count`, `remaining_count`) so the UI can show a progress bar without a second query.

---

## How it does it — CTE by CTE

### 1. `current_started`
```sql
SELECT uli.dataset_id FROM user_label_interaction uli
WHERE uli.user_id = uid AND uli.status = 'started'
ORDER BY uli.dataset_id LIMIT 1
```
**Resume semantics.** If this user already started something and didn't finish, find it. This CTE acts as a gate for everything below — if it returns a row, no new assignment happens.

---

### 2. `ranked`
```sql
CASE
    WHEN COUNT(*) FILTER (WHERE uli.status IS NOT NULL) = 0 THEN 1  -- fresh
    WHEN completed = 1 AND started = 0                  THEN 2  -- needs a second opinion
    WHEN completed >= 2 AND started = 0                 THEN 3  -- well-labeled
    ELSE                                                     4  -- someone else has it
END AS priority
```
**Smart priority queue.** Posts are ranked so labeling effort is distributed optimally:

| Priority | Meaning | Why first? |
|----------|---------|------------|
| 1 | Never touched | Get coverage ASAP |
| 2 | One label, idle | Needs verification |
| 3 | Two+ labels, idle | Extra signal is fine |
| 4 | Someone else started it | Avoid collision |

The `WHERE NOT EXISTS` clause silently excludes any post the current user already completed, so they never see duplicates.

---

### 3. `picked`
```sql
WHERE NOT EXISTS (SELECT 1 FROM current_started)
ORDER BY r.priority, r.id
FOR UPDATE OF d SKIP LOCKED
LIMIT 1
```
Three things happening here:

- **`WHERE NOT EXISTS (current_started)`** — if the user already has something in progress, skip this entire selection. Nothing is locked or upserted.
- **`ORDER BY priority, r.id`** — deterministic ordering (tiebreak on UUID) so the priority queue is stable.
- **`FOR UPDATE OF d SKIP LOCKED`** — the critical trick. When two users call this function simultaneously, Postgres locks the row being assigned. The second user's query *skips* that locked row and picks the next available one. No blocking. No deadlocks. No double-assignment.

---

### 4. `upsert`
```sql
INSERT INTO user_label_interaction (user_id, dataset_id, status)
SELECT uid, p.id, 'started' FROM picked p
ON CONFLICT (user_id, dataset_id) DO UPDATE SET status = EXCLUDED.status
RETURNING dataset_id
```
**Atomic claim.** Writes the assignment in the same transaction as the lock. If somehow the user had a prior `completed` interaction (which the `ranked` CTE filters out, but just in case), `ON CONFLICT` updates it — idempotent by design. Only runs if `picked` returned a row.

---

### 5. `chosen`
```sql
SELECT dataset_id AS id FROM current_started
UNION ALL
SELECT dataset_id AS id FROM upsert
LIMIT 1
```
**The merge.** `UNION ALL` + `LIMIT 1` means: prefer the resumed item, fall back to the newly assigned one. Exactly one row, always.

---

### 6. `user_stats`
```sql
COUNT(*) FILTER (WHERE status = 'completed') AS labeled_count,
(SELECT COUNT(*) FROM dataset) - COUNT(*) FILTER (WHERE status = 'completed') AS remaining_count
```
Piggybacked progress calculation. Free, since we're already in the transaction.

---

### 7. Final `SELECT`
```sql
SELECT c.id, d2.content, us.labeled_count, us.remaining_count
FROM chosen c CROSS JOIN user_stats us
```
Joins everything together. `CROSS JOIN` on `user_stats` is safe because `user_stats` is always exactly one row (an aggregate with no `GROUP BY`).

---

## Why this is elegant

### One query does it all
Assignment, deduplication, locking, progress stats — zero round-trips. The application just calls the function and renders the result.

### `SKIP LOCKED` is the right tool for work queues
`SELECT ... FOR UPDATE SKIP LOCKED` is specifically designed for task-queue patterns. It's non-blocking (unlike `FOR UPDATE`), non-racy (unlike optimistic retry loops), and transactionally safe. Postgres documentation literally calls this out as the recommended pattern for "job queue" use cases.

### Idempotent by design
Call it twice in a row — same result. The `current_started` check and the `ON CONFLICT` upsert together make the function safe to retry without side effects.

### Priority without application logic
The ranking is expressed declaratively in SQL. The application doesn't need to know anything about label counts, who's working on what, or how to prioritize — the database handles it.

### Exclusion is implicit
Users never see posts they've completed. This is enforced in `ranked` with a `WHERE NOT EXISTS` correlated subquery, so the exclusion is database-enforced, not trust-the-caller.
