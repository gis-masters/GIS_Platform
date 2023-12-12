-- Пришедший пользовательский запрос ищем функцией `<->` из pg_trgm расширения. Возвращает «расстояние» между аргументами, то есть один минус значение similarity().
-- Затрачиваем 0,2 сек
-- @formatter:off

-- поиск: золотое поле виноградная 27
-- делаем запрос в словарь по каждому слову отдельно: 'золотое' 'поле' 'виноградная' '27'
SELECT word_distance.dist, d.*
FROM
    (
        SELECT word, word <-> '27'::text as dist
        FROM data.fts_dictionary
    ) AS word_distance
        JOIN data.fts_dictionary AS d ON word_distance.word = d.word
WHERE word_distance.dist < 0.9
ORDER BY word_distance.dist
LIMIT 20;


SELECT  subquery.concatenated_data <-> '90:08:100301:708' as dist,
        subquery.schema,
        subquery.table,
        subquery.id,
        subquery.concatenated_data
FROM
    (
        SELECT  ts_rank(d.vector_data, query) AS _rank_,
                d.schema,
                d.table,
                d.id,
                d.concatenated_data
        FROM data.fts_layers AS d, to_tsquery('90 | 08 | 100301') query
        ORDER BY  _rank_ DESC NULLS LAST
        LIMIT 1000
    ) AS subquery
ORDER BY dist
OFFSET 0 LIMIT 20