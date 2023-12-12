INSERT INTO data.fts_layers(schema, "table", id, concatenated_data)
SELECT
    'workspace_789' AS schema,
'zu_pro_789_d839' AS "table",
objectid::bigint AS id,
COALESCE(cad_num::text, '') || ' ' ||
COALESCE(readableaddress::text, '') || ' ' ||
COALESCE(usage::text, '')
FROM workspace_789.zu_pro_789_d839
ON CONFLICT (schema, "table", id) DO NOTHING;


INSERT INTO data.fts_layers(schema, "table", id, concatenated_data)
SELECT
    'workspace_789' AS schema,
'oks_pro_789_f56c' AS "table",
objectid::bigint AS id,
COALESCE(cad_num::text, '') || ' ' ||
COALESCE(readablead::text, '') || ' ' ||
COALESCE(objecttype::text, '')
FROM workspace_789.oks_pro_789_f56c
ON CONFLICT (schema, "table", id) DO NOTHING;







-- Отсортируйте таблицу fts_dictionary по длине слова (по возрастанию)
SELECT *
FROM data.fts_dictionary
ORDER BY LENGTH(word) desc;



-- Если в слове словаря присутствуют спец символы - они должны быть заменены на пробелы и к этому слову нужно снова применить to_tsvector
-- Таким образом мы разобьем сложную фигню
--     /opt/spatial_data/crimea_data/r_belogorskiy/sp_zelenogorskoe/pzz/balki_yakovlevka_zelenogorskoe_novogrigoryevka_novoklenovo/balki_yakovlevka_zelenogorskoe_novogrigoryevka_novoklenovo_pzz_2019_5k_p.tif
-- на мелкие слова
--     '2019':22 '5k':23 'balki':11,16 'belogorskiy':7 'crimea':4 'data':3,5 'novogrigoryevka':14,19 'novoklenovo':15,20 'opt':1 'p':24 'pzz':10,21 'r':6 'sp':8 'spatial':2 'tif':25 'yakovlevka':12,17 'zelenogorsko':9,13,18
-- и будем поддерживать словарь в адекватном состоянии - для поддержания быстрого поиска по нему
SELECT to_tsvector('opt spatial_data crimea_data r_belogorskiy sp_zelenogorskoe pzz balki_yakovlevka_zelenogorskoe_novogrigoryevka_novoklenovo balki_yakovlevka_zelenogorskoe_novogrigoryevka_novoklenovo_pzz_2019_5k_p tif')










           ANALYZE data.fts_layers;

explain (analyze, costs off)
SELECT d.concatenated_data <-> '1394' as dist, d.schema, d.table, d.id, d.concatenated_data
FROM data.fts_layers AS d
WHERE (d.concatenated_data <-> '1394' < 0.93)
ORDER BY dist OFFSET 0 LIMIT 10

    explain (analyze, costs off)
SELECT d.concatenated_data <-> '90:25:000000:421' as dist, d.schema, d.table, d.id, d.concatenated_data
FROM data.fts_layers AS d
WHERE (d.concatenated_data <-> '90:25:000000:421' < 0.9)
ORDER BY dist OFFSET 0 LIMIT 10

    explain (analyze, costs off)
SELECT d.concatenated_data <-> 'Добровское сельское' as dist, d.schema, d.table, d.id, d.concatenated_data
FROM data.fts_layers AS d
WHERE (d.concatenated_data <-> 'Добровское сельское' < 0.9)
ORDER BY dist OFFSET 0 LIMIT 10

CREATE INDEX IF NOT EXISTS idx_fts_layers_gist
    ON data.fts_layers USING gist (data.replace_ru_letters(concatenated_data) public.gist_trgm_ops);

SELECT id, LENGTH(concatenated_data) AS string_length, concatenated_data
FROM data.fts_layers
ORDER BY string_length DESC;




SELECT to_tsvector('russian', d.concatenated_data)
FROM data.fts_layers AS d
WHERE id IN (10017007)

SELECT string_to_array(to_tsvector('russian', d.concatenated_data)::text, ' ')
FROM data.fts_layers AS d
WHERE id = 10017007;
