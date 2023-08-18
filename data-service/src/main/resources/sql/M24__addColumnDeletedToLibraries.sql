DELETE FROM data.doc_libraries WHERE title LIKE 'System root directory';

DO
'
    DECLARE
        selectrow record;
    BEGIN
        for selectrow in
            select ''ALTER TABLE IF EXISTS data.'' || T.library_table ||
                   '' ADD COLUMN IF NOT EXISTS is_deleted boolean DEFAULT false'' as
                       script
            from (select table_name as library_table
                  FROM data.doc_libraries) t
            loop
                execute selectrow.script;
            end loop;
    END;
' LANGUAGE PLPGSQL;
