CREATE
OR REPLACE FUNCTION get_next_unlabeled_post(uid uuid) RETURNS TABLE(id uuid, content text) LANGUAGE sql AS $$ WITH next_post AS (
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
                AND status = 'completed'
        )
    GROUP BY
        d.id,
        d.content
    ORDER BY
        -- Priority ranking: 0=my started, 1=no one started, 2=completed by 1, 3=completed by 2+, 4=started by others
        CASE
            -- My started posts (highest priority)
            WHEN count(
                CASE
                    WHEN uli.user_id = uid
                    AND uli.status = 'started' THEN 1
                END
            ) > 0 THEN 0 -- No interactions at all
            WHEN count(uli.user_id) = 0 THEN 1 -- Has completed interactions but no started
            WHEN count(
                CASE
                    WHEN uli.status = 'completed' THEN 1
                END
            ) > 0
            AND count(
                CASE
                    WHEN uli.status = 'started' THEN 1
                END
            ) = 0 THEN 1 + LEAST(
                count(
                    CASE
                        WHEN uli.status = 'completed' THEN 1
                    END
                ),
                2
            ) -- Started by someone else (lowest priority)
            ELSE 4
        END,
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

$$;