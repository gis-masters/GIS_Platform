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
$$ LANGUAGE plpgsql;


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
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION public.delete_from_fts_documents() RETURNS TRIGGER AS $$
BEGIN
    EXECUTE format('DELETE FROM data.fts_documents WHERE schema = %L AND "table" = %L AND id = $1',
                   TG_ARGV[0], TG_ARGV[1])
        USING OLD.id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.delete_from_fts_layers() RETURNS TRIGGER AS $$
BEGIN
    EXECUTE format('DELETE FROM data.fts_layers WHERE schema = %L AND "table" = %L AND id = $1',
                   TG_ARGV[0], TG_ARGV[1])
        USING OLD.objectid;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;
