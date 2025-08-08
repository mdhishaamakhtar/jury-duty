CREATE
OR REPLACE FUNCTION get_next_unlabeled_post(uid uuid) RETURNS TABLE(id uuid, content text) LANGUAGE sql AS $ $ WITH next_post AS (
    SELECT
        d.id
    FROM
        dataset d
        LEFT JOIN user_label_interaction uli ON d.id = uli.dataset_id
    WHERE
        d.id NOT IN (
            SELECT
                dataset_id
            FROM
                user_label_interaction
            WHERE
                user_id = uid
        )
    GROUP BY
        d.id,
        d.content
    ORDER BY
        -- Posts with "started" entries rank last (1), others rank first (0)
        CASE
            WHEN count(
                CASE
                    WHEN uli.status = 'started' THEN 1
                END
            ) > 0 THEN 1
            ELSE 0
        END,
        -- Then by completed count
        count(
            CASE
                WHEN uli.status = 'completed' THEN uli.user_id
            END
        ) ASC,
        d.id
    LIMIT
        1
)
INSERT INTO
    user_label_interaction (user_id, dataset_id, status)
SELECT
    uid,
    next_post.id,
    'started'
FROM
    next_post RETURNING dataset_id as id,
    (
        SELECT
            content
        FROM
            dataset
        WHERE
            id = dataset_id
    ) as content;

$ $;