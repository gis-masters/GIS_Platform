INSERT INTO data.doc_libraries(title, details, table_name, schema_id, created_by, created_at, last_modified)
SELECT 'Тестовая библиотека',
       'Тестовая библиотека с отсылкой к таблице documents',
       'documents',
       'documents',
       'fiz@fiz',
       now(),
       now()
WHERE NOT EXISTS(SELECT id FROM data.doc_libraries WHERE table_name = 'documents');
