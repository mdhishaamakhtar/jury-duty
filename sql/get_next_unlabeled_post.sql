CREATE OR REPLACE FUNCTION get_next_unlabeled_post(uid uuid)
RETURNS TABLE (id uuid, content text)
LANGUAGE sql
AS $$
WITH ranked AS (
    -- Compute priority per dataset row (no locking here)
    SELECT
        d.id,
        /* Priority ranking:
           0 = my started,
           1 = no one started,
           2/3 = completed by 1 / 2+ (no one started),
           4 = started by others
        */
        CASE
            -- My started posts (highest priority)
            WHEN COUNT(*) FILTER (WHERE uli.user_id = uid AND uli.status = 'started') > 0 THEN 0

            -- No interactions at all
            WHEN COUNT(uli.user_id) = 0 THEN 1

            -- Has completed interactions but no started
            WHEN COUNT(*) FILTER (WHERE uli.status = 'completed') > 0
             AND COUNT(*) FILTER (WHERE uli.status = 'started')  = 0
            THEN 1 + LEAST(COUNT(*) FILTER (WHERE uli.status = 'completed'), 2)

            -- Started by someone else (lowest priority)
            ELSE 4
        END AS priority
    FROM dataset d
    LEFT JOIN user_label_interaction uli
      ON uli.dataset_id = d.id
    WHERE NOT EXISTS (
        SELECT 1
        FROM user_label_interaction uli2
        WHERE uli2.dataset_id = d.id
          AND uli2.user_id   = uid
          AND uli2.status    = 'completed'
    )
    GROUP BY d.id
),
picked AS (
    -- Apply the lock only when picking the winner row
    SELECT r.id
    FROM ranked r
    JOIN dataset d ON d.id = r.id
    ORDER BY r.priority, r.id
    FOR UPDATE OF d SKIP LOCKED
    LIMIT 1
),
ins AS (
    INSERT INTO user_label_interaction (user_id, dataset_id, status)
    SELECT uid, p.id, 'started'
    FROM picked p
    RETURNING dataset_id
)
SELECT
    i.dataset_id AS id,
    (SELECT d2.content FROM dataset d2 WHERE d2.id = i.dataset_id) AS content
FROM ins i;
$$;
