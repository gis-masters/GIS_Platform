-- Добавим сопутствующую таблицу, словарь и индекс по словарю не забудем
CREATE TABLE IF NOT EXISTS data.fts_dictionary_types
(
    id   smallint NOT NULL,
    type character varying(10),
    CONSTRAINT unique_id UNIQUE (id),
    CONSTRAINT unique_type UNIQUE (type)
    ) TABLESPACE pg_default;
ALTER TABLE data.fts_dictionary_types
    OWNER to ${db_owner};

INSERT INTO data.fts_dictionary_types(id, type)
VALUES (1, 'LAYER')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO data.fts_dictionary_types(id, type)
VALUES (2, 'DOCUMENT')
    ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS data.fts_dictionary
(
    word    character varying NOT NULL,
    type_id smallint          NOT NULL,
    CONSTRAINT unique_words UNIQUE (word, type_id),
    CONSTRAINT pk_dictionary_type_id FOREIGN KEY (type_id)
    REFERENCES data.fts_dictionary_types (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    ) TABLESPACE pg_default;
ALTER TABLE data.fts_dictionary
    OWNER to ${db_owner};

CREATE INDEX IF NOT EXISTS trgm_gist_indx ON data.fts_dictionary USING gist (word public.gist_trgm_ops);


-- -- Создадим функцию для обновления словаря из данных библиотек fts_dictionary
-- CREATE OR REPLACE FUNCTION update_fts_dictionary_from_documents()
--     RETURNS VOID AS
-- $$
-- BEGIN
--     INSERT INTO data.fts_dictionary (word, type_id)
--     SELECT substring(original_word, 2, length(original_word) - 2), 2
--     FROM (SELECT substring(
--                          unnest(string_to_array(to_tsvector('russian', d.concatenated_data)::text, ' ')),
--                          '([^:]+)'
--                  ) AS original_word
--           FROM data.fts_documents AS d) AS cte
--     ON CONFLICT (word) DO NOTHING;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- -- Создадим функцию для обновления словаря из данных слоев fts_layers
-- Вот так функции вызываются SELECT update_fts_dictionary_from_documents()
-- CREATE OR REPLACE FUNCTION update_fts_dictionary_from_layers()
--     RETURNS VOID AS
-- $$
-- BEGIN
--     INSERT INTO data.fts_dictionary (word, type_id)
--     SELECT substring(original_word, 2, length(original_word) - 2), 1
--     FROM (SELECT substring(
--                          unnest(string_to_array(to_tsvector('russian', d.concatenated_data)::text, ' ')),
--                          '([^:]+)'
--                  ) AS original_word
--           FROM data.fts_layers AS d) AS cte
--     ON CONFLICT (word) DO NOTHING;
-- END;
-- $$ LANGUAGE plpgsql;
