INSERT INTO data.schemas (name, class_rule)
SELECT 'smev_message_meta_schema',
       '{
    "name": "smev_message_meta_schema",
    "title": "Мета информация сообщений СМЭВ",
    "readOnly": true,
    "tableName": "smev_message_meta",
    "originName": "smev_message_meta",
    "properties": [
        {
            "name": "id",
            "title": "Идентификатор",
            "valueType": "UUID"
        },
        {
            "name": "direction",
            "title": "Направление (входящее/исходящие)",
            "required": true,
            "valueType": "STRING"
        },
        {
            "name": "client_id",
            "title": "Заданный ИД сообщения",
            "required": true,
            "valueType": "UUID"
        },
        {
            "name": "reference_client_id",
            "title": "ИД связанного сообщения",
            "valueType": "UUID"
        },
        {
            "name": "mnemonic",
            "title": "Мнемоника запроса",
            "required": true,
            "valueType": "TEXT"
        },
        {
            "name": "mnemonic_version",
            "title": "Версия мнемоники",
            "required": true,
            "valueType": "TEXT"
        },
        {
            "name": "reference_reestr_incoming",
            "title": "Ссылка на входящее сообщение реестра",
            "valueType": "UUID"
        },
        {
            "name": "reference_reestr_outgoing",
            "title": "Ссылка на исходящие сообщение реестра",
            "valueType": "UUID"
        },
        {
            "name": "xml_object",
            "title": "Сообщение в виде JSON",
            "required": true,
            "valueType": "TEXT"
        },
        {
            "name": "xml_string",
            "title": "Сообщение в виде XML",
            "required": true,
            "valueType": "TEXT"
        },
        {
            "name": "records",
            "title": "Записи БД из которых было сформировано сообщение",
            "valueType": "TEXT"
        },
        {
            "name": "attachments",
            "title": "Вложения",
            "valueType": "TEXT"
        },
        {
            "name": "created_at",
            "title": "Дата и время создания (отправки в очередь либо чтения из очереди)",
            "valueType": "DATETIME"
        }
    ]
}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'smev_message_meta_schema');
