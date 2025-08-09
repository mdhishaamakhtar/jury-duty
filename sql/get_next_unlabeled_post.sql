CREATE OR REPLACE FUNCTION get_next_unlabeled_post(uid uuid)
RETURNS TABLE (id uuid, content text)
LANGUAGE sql
AS $$
WITH current_started AS (
    -- If the user already has something started, return it first
    SELECT uli.dataset_id
    FROM user_label_interaction uli
    WHERE uli.user_id = uid
      AND uli.status  = 'started'
    ORDER BY uli.dataset_id
    LIMIT 1
),
ranked AS (
    -- Rank datasets for selection
    SELECT
        d.id,
        CASE
            -- No interactions at all
            WHEN COUNT(*) FILTER (WHERE uli.status IS NOT NULL) = 0 THEN 1
            -- Completed by 1 person, no started
            WHEN COUNT(*) FILTER (WHERE uli.status = 'completed') = 1
             AND COUNT(*) FILTER (WHERE uli.status = 'started') = 0 THEN 2
            -- Completed by 2+ people, no started
            WHEN COUNT(*) FILTER (WHERE uli.status = 'completed') >= 2
             AND COUNT(*) FILTER (WHERE uli.status = 'started') = 0 THEN 3
            -- Started by someone else
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
    -- Pick only if no current_started for this user
    SELECT r.id
    FROM ranked r
    JOIN dataset d ON d.id = r.id
    WHERE NOT EXISTS (SELECT 1 FROM current_started)
    ORDER BY r.priority, r.id
    FOR UPDATE OF d SKIP LOCKED
    LIMIT 1
),
upsert AS (
    -- Insert or update to mark as started
    INSERT INTO user_label_interaction (user_id, dataset_id, status)
    SELECT uid, p.id, 'started'
    FROM picked p
    ON CONFLICT (user_id, dataset_id)
    DO UPDATE SET status = EXCLUDED.status
    RETURNING dataset_id
),
chosen AS (
    -- Prefer existing started, otherwise new pick
    SELECT dataset_id AS id FROM current_started
    UNION ALL
    SELECT dataset_id AS id FROM upsert
    LIMIT 1
)
SELECT
    c.id,
    (SELECT d2.content FROM dataset d2 WHERE d2.id = c.id) AS content
FROM chosen c;
$$;
