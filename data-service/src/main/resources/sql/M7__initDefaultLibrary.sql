CREATE TABLE IF NOT EXISTS data.dl_default
(
    id              bigserial NOT NULL,
    title           character varying(500),
    name            character varying,
    type            character varying(50),
    size            bigint,
    inner_path      character varying,
    category        character varying,
    content_type_id character varying,
    is_folder       boolean   NOT NULL default false,
    path            text,
    created_at      timestamp without time zone,
    last_modified   timestamp without time zone,
    created_by      character varying(50),
    intents         character varying(500),
    oktmo           character varying(11),
    native_crs      character varying(50),
    some_files      jsonb,
    one_file        jsonb,
    CONSTRAINT dl_default_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

INSERT INTO data.doc_libraries(title, details, table_name, schema_id, created_by, created_at, last_modified, path)
SELECT 'Тестовая библиотека',
       'Тестовая библиотека с отсылкой к таблице documents',
       'dl_default',
       'dl_default_schema',
       'fiz@migration',
       now(),
       now(),
       '/root'
WHERE NOT EXISTS(SELECT id FROM data.doc_libraries WHERE table_name = 'dl_default');

INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_default_schema',
       '{
  "name": "dl_default_schema",
  "title": "Документы ГПЗУ",
  "description": "documents_schema_v1",
  "tableName": "dl_default",
  "properties": [
    {
      "name": "id",
      "title": "Идентификатор",
      "required": true,
      "hidden": false,
      "valueType": "INT",
      "sequenceNumber": 0
    },
    {
      "name": "title",
      "title": "Заголовок",
      "required": true,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0,
      "maxLength": 500
    },
    {
      "name": "name",
      "title": "Название",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0,
      "maxLength": 254
    },
    {
      "name": "type",
      "title": "Тип",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0,
      "maxLength": 50
    },
    {
      "name": "size",
      "title": "Размер в kb",
      "required": true,
      "hidden": false,
      "valueType": "INT",
      "sequenceNumber": 0
    },
    {
      "name": "inner_path",
      "title": "Где лежит",
      "required": true,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "created_at",
      "title": "Дата создания",
      "required": true,
      "hidden": false,
      "valueType": "DATETIME",
      "sequenceNumber": 0
    },
    {
      "name": "last_modified",
      "title": "Дата последней модификации",
      "required": true,
      "hidden": false,
      "valueType": "DATETIME",
      "sequenceNumber": 0
    },
    {
      "name": "created_by",
      "title": "Создатель",
      "required": true,
      "hidden": false,
      "objectIdentityOnUi": false,
      "valueType": "STRING",
      "sequenceNumber": 0,
      "maxLength": 50
    },
    {
      "name": "category",
      "title": "Категории/Теги",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0,
      "maxLength": 254
    },
    {
      "name": "content_type_id",
      "title": "Идентификатор контент типа",
      "required": true,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0,
      "maxLength": 50
    },
    {
      "name": "is_folder",
      "title": "Признак раздела",
      "required": true,
      "hidden": false,
      "valueType": "BOOLEAN",
      "sequenceNumber": 0
    },
    {
      "name": "path",
      "title": "Полный путь, отражающий иерархию обьектов",
      "required": true,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "binary",
      "required": true,
      "valueType": "BINARY",
      "sequenceNumber": 2
    },
    {
      "name": "oktmo",
      "title": "ОКТМО",
      "required": true,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0,
      "maxLength": 11
    },
    {
      "name": "intents",
      "title": "System intents",
      "required": false,
      "hidden": true,
      "valueType": "STRING",
      "maxLength": 500
    },
    {
      "name": "native_crs",
      "title": "nativeCRS",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0,
      "maxLength": 11
    },
    {
      "name": "some_files",
      "title": "Any user title here",
      "required": false,
      "hidden": false,
      "valueType": "FILE",
      "multiple": true
    },
    {
      "name": "one_file",
      "title": "Any user title here",
      "required": false,
      "hidden": false,
      "valueType": "FILE",
      "multiple": false
    },
    {
      "name": "test",
      "title": "Not exist in database property",
      "required": false,
      "hidden": true,
      "valueType": "STRING",
      "maxLength": 500
    }
  ],
  "contentTypes": [
    {
      "id": "doc_v1",
      "type": "DOCUMENT",
      "title": "Документ первого типа",
      "icon": "DOCUMENT",
      "attributes": [
        {
          "name": "title",
          "title": "Название файла",
          "required": true,
          "hidden": false,
          "sequenceNumber": 0,
          "maxLength": 500
        },
        {
          "name": "binary",
          "title": "Выбор файла",
          "required": true,
          "sequenceNumber": 2
        },
        {
          "name": "native_crs",
          "required": false,
          "hidden": false
        }
      ]
    },
    {
      "id": "doc_v3",
      "type": "DOCUMENT",
      "attributes": [
        {
          "name": "title",
          "title": "Название файла",
          "required": true,
          "maxLength": 100
        }
      ]
    },
    {
      "id": "doc_v2",
      "type": "DOCUMENT",
      "title": "Документ ГПЗУ",
      "icon": "GPZU",
      "attributes": [
        {
          "name": "title",
          "title": "Название файла",
          "required": true,
          "hidden": false,
          "sequenceNumber": 0
        },
        {
          "name": "category",
          "title": "Теги",
          "required": true,
          "hidden": false,
          "sequenceNumber": 1
        },
        {
          "name": "binary",
          "title": "Выбор файла",
          "required": true,
          "sequenceNumber": 2
        },
        {
          "name": "native_crs",
          "required": false,
          "hidden": false,
          "sequenceNumber": 3
        }
      ]
    },
    {
      "id": "folder_v1",
      "type": "FOLDER",
      "attributes": [
        {
          "name": "title"
        }
      ]
    },
    {
      "id": "doc_v4",
      "type": "DOCUMENT",
      "attributes": [
        {
          "name": "title",
          "title": "Название документа"
        },
        {
          "name": "some_files",
          "title": "Картинки котиков"
        },
        {
          "name": "one_file",
          "title": "Одинокое фото собаки"
        }
      ]
    }
  ]
}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_default_schema');

CREATE TABLE IF NOT EXISTS data.dl_zu
(
    id              bigserial,
    title           varchar(500) not null,
    path            varchar(555),
    is_folder       boolean,
    cadastralnumber varchar,
    name            varchar,
    surname         varchar,
    first           varchar,
    datebirth       timestamp,
    place_birth     varchar,
    code_document   varchar,
    name4           varchar,
    series          varchar,
    number          varchar,
    date            timestamp,
    issueorgan      varchar,
    issueorgan_code varchar,
    note            varchar,
    e_mail          varchar,
    phone           varchar,
    citizenship     varchar,
    snils           varchar,
    regnumber82     varchar,
    regdate83       timestamp,
    dateclose       timestamp,
    created_at      timestamp,
    content_type_id varchar,
    patronymic      varchar,
    CONSTRAINT dl_zu_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

alter table data.dl_zu
    owner to fiz;

INSERT INTO data.doc_libraries(title, details, table_name, schema_id, created_by, created_at, last_modified, path)
SELECT 'Библиотека ЗУ',
       'ЗУ библиотека',
       'dl_zu',
       'dl_zu_schema',
       'fiz@fiz',
       now(),
       now(),
       '/root'
WHERE NOT EXISTS(SELECT id FROM data.doc_libraries WHERE table_name = 'dl_zu');

INSERT INTO data.schemas (name, class_rule)
SELECT 'dl_zu_schema',
       '{
  "name": "dl_zu_schema",
  "title": "Земельные участки",
  "readOnly": false,
  "tableName": "dl_zu",
  "originName": "dl_zu",
  "properties": [
    {
      "name": "id",
      "title": "Идентификатор",
      "required": true,
      "hidden": false,
      "valueType": "INT",
      "sequenceNumber": 0
    },
    {
      "name": "is_folder",
      "title": "Признак раздела",
      "required": false,
      "hidden": false,
      "valueType": "BOOLEAN",
      "sequenceNumber": 0
    },
    {
      "name": "path",
      "title": "Полный путь, отражающий иерархию объектов",
      "required": true,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0,
      "maxLength": 555
    },
    {
      "name": "title",
      "title": "Наименование документа",
      "required": true,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0,
      "maxLength": 500
    },
    {
      "name": "content_type_id",
      "title": "Идентификатор контент типа",
      "required": true,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0,
      "maxLength": 50
    },
    {
      "name": "created_at",
      "title": "Дата создания",
      "required": true,
      "hidden": false,
      "valueType": "DATETIME",
      "sequenceNumber": 0
    },
    {
      "name": "cadastralnumber",
      "title": "Кадастровый номер",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "name",
      "title": "Наименование",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "surname",
      "title": "Фамилия",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "first",
      "title": "Имя",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "patronymic",
      "title": "Отчество",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "datebirth",
      "title": "Дата рождения",
      "required": false,
      "hidden": false,
      "valueType": "DATETIME",
      "sequenceNumber": 0
    },
    {
      "name": "place_birth",
      "title": "Место рождения",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "code_document",
      "title": "Код документа",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "name4",
      "title": "Наименование документа",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "series",
      "title": "Серия документа",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "number",
      "title": "Номер документа",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "date",
      "title": "Дата выдачи документа",
      "required": false,
      "hidden": false,
      "valueType": "DATETIME",
      "sequenceNumber": 0
    },
    {
      "name": "issueorgan",
      "title": "Кем выдан документ",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "issueorgan_code",
      "title": "Код органа выдавшего документ",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "note",
      "title": "Примечание",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "e_mail",
      "title": "E_mail",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "phone",
      "title": "Телефон",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "citizenship",
      "title": "Гражданство",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "snils",
      "title": "СНИЛС",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "regnumber82",
      "title": "Регистрационный номер",
      "required": false,
      "hidden": false,
      "valueType": "STRING",
      "sequenceNumber": 0
    },
    {
      "name": "regdate83",
      "title": "Дата постановки на учет/ регистрации",
      "required": false,
      "hidden": false,
      "valueType": "DATETIME",
      "sequenceNumber": 0
    },
    {
      "name": "dateclose",
      "title": "Дата снятия с учета/регистрации",
      "required": false,
      "hidden": false,
      "valueType": "DATETIME",
      "sequenceNumber": 0
    }
  ],
  "description": "Земельные участки",
  "geometryType": "MultiPolygon",
  "customRuleFunction": null
}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'dl_zu_schema');
