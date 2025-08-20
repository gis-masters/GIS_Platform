CREATE OR REPLACE FUNCTION data.replace_ru_letters(sourceText text)
    RETURNS text
    LANGUAGE plpgsql
    IMMUTABLE
AS
$$
BEGIN
    RETURN regexp_replace(sourceText, 'ё', 'е', 'g');
EXCEPTION
    WHEN OTHERS THEN RAISE EXCEPTION '%', SQLERRM;
END;
$$;;


CREATE OR REPLACE FUNCTION public.universal_copy_to_fts_documents()
    RETURNS TRIGGER AS $$
DECLARE
    source_schema_name  TEXT;
    source_table_name   TEXT;
    id_name             TEXT;
    fields              TEXT[];
    concatenated_data   TEXT = '';
    dynamic_id          BIGINT;
    current_field       TEXT;
    dynamic_path        CHARACTER VARYING;
BEGIN
    source_schema_name := TG_ARGV[0];
    source_table_name := TG_ARGV[1];
    id_name := TG_ARGV[2];
    fields := string_to_array(TG_ARGV[3], ',');

    FOR i IN 1..array_length(fields, 1)
        LOOP
            EXECUTE format('SELECT COALESCE(CAST(($1::record).%I AS TEXT), '''')', fields[i])
                INTO current_field
                USING NEW;

            concatenated_data := concatenated_data || ' ' || current_field;
        END LOOP;

    EXECUTE format('SELECT ($1::record).%I::BIGINT', id_name)
        INTO dynamic_id
        USING NEW;

    EXECUTE format('SELECT ($1::record).%I::CHARACTER VARYING', 'path')
        INTO dynamic_path
        USING NEW;

    -- Используем ON CONFLICT DO UPDATE чтобы обновить concatenated_data и path
    INSERT INTO data.fts_documents (schema, "table", id, path, concatenated_data)
    VALUES (source_schema_name, source_table_name, dynamic_id, dynamic_path, concatenated_data)
    ON CONFLICT (schema, "table", id)
        DO UPDATE SET concatenated_data = EXCLUDED.concatenated_data, path = EXCLUDED.path;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;;


CREATE OR REPLACE FUNCTION public.universal_copy_to_fts_layers()
RETURNS TRIGGER AS $$
DECLARE
    source_schema_name  TEXT;
    source_table_name   TEXT;
    id_name             TEXT;
    fields              TEXT[];
    concatenated_data   TEXT = '';
    dynamic_id          BIGINT;
    current_field       TEXT;
BEGIN
    source_schema_name := TG_ARGV[0];
    source_table_name := TG_ARGV[1];
    id_name := TG_ARGV[2];
    fields := string_to_array(TG_ARGV[3], ',');

    FOR i IN 1..array_length(fields, 1)
        LOOP
            EXECUTE format('SELECT COALESCE(CAST(($1::record).%I AS TEXT), '''')', fields[i])
            INTO current_field
            USING NEW;

            concatenated_data := concatenated_data || ' ' || current_field;
    END LOOP;

    EXECUTE format('SELECT ($1::record).%I::BIGINT', id_name)
        INTO dynamic_id
        USING NEW;

    -- Используем ON CONFLICT DO UPDATE чтобы обновить concatenated_date
    INSERT INTO data.fts_layers (schema, "table", id, concatenated_data)
    VALUES (source_schema_name, source_table_name, dynamic_id, concatenated_data)
        ON CONFLICT (schema, "table", id)
        DO UPDATE SET concatenated_data = EXCLUDED.concatenated_data;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;;


CREATE OR REPLACE FUNCTION public.delete_from_fts_documents() RETURNS TRIGGER AS $$
BEGIN
    EXECUTE format('DELETE FROM data.fts_documents WHERE schema = %L AND "table" = %L AND id = $1',
                   TG_ARGV[0], TG_ARGV[1])
        USING OLD.id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;;

CREATE OR REPLACE FUNCTION public.delete_from_fts_layers() RETURNS TRIGGER AS $$
BEGIN
    EXECUTE format('DELETE FROM data.fts_layers WHERE schema = %L AND "table" = %L AND id = $1',
                   TG_ARGV[0], TG_ARGV[1])
        USING OLD.objectid;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;;

CREATE OR REPLACE FUNCTION public.update_fts_dictionary_incremental() RETURNS TRIGGER AS $$
DECLARE
    new_type_id INT;
BEGIN
    new_type_id := TG_ARGV[0];
    INSERT INTO data.fts_dictionary (word, type_id)
        SELECT substring(original_word, 2, length(original_word) - 2), new_type_id
        FROM (
            SELECT substring(
                       unnest(string_to_array(to_tsvector('russian', NEW.concatenated_data)::text, ' ')),
                   '([^:]+)') AS original_word
        ) AS cte
    ON CONFLICT (word, type_id) DO NOTHING;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;;

DROP TRIGGER IF EXISTS update_fts_dictionary_documents_tgr ON data.fts_documents;;
CREATE TRIGGER update_fts_dictionary_documents_tgr AFTER INSERT OR UPDATE
    ON data.fts_documents
    FOR EACH ROW
EXECUTE PROCEDURE public.update_fts_dictionary_incremental(2);;

DROP TRIGGER IF EXISTS update_fts_dictionary_layers_tgr ON data.fts_layers;;
CREATE TRIGGER update_fts_dictionary_layers_tgr AFTER INSERT OR UPDATE
    ON data.fts_layers
    FOR EACH ROW
EXECUTE PROCEDURE public.update_fts_dictionary_incremental(1);;
