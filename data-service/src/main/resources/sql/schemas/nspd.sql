INSERT INTO data.schemas (name, class_rule)
SELECT 'ter_zone_nspd',
       '{}' WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'ter_zone_nspd');

INSERT INTO data.schemas (name, class_rule)
SELECT 'zouit_nspd',
       '{}' WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'zouit_nspd');

INSERT INTO data.schemas (name, class_rule)
SELECT 'zu_nspd',
       '{}' WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'zu_nspd');

INSERT INTO data.schemas (name, class_rule)
SELECT 'border_nspd',
       '{}' WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'border_nspd');

INSERT INTO data.schemas (name, class_rule)
SELECT 'oks_nspd',
       '{}' WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'oks_nspd');


UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "NSPD"
          ],
          "name": "ter_zone_nspd",
          "title": "Территориальные зоны",
          "tableName": "ter_zone_nspd",
          "styleName": "ter_zone_nspd",
          "properties": [
            {
              "name": "type_boundary_value",
              "title": "Вид",
              "valueType": "STRING"
            },
            {
              "name": "type_zone",
              "title": "Тип зоны",
              "valueType": "STRING"
            },
            {
              "name": "registration_date",
              "title": "Дата присвоения",
              "valueType": "DATETIME"
            },
            {
              "name": "reg_numb_border",
              "title": "Реестровый номер границы",
              "valueType": "STRING"
            },
            {
              "name": "cadastral_district",
              "title": "Кадастровый район",
              "valueType": "STRING"
            },
            {
              "name": "old_account_number",
              "title": "Учетный номер",
              "valueType": "STRING"
            },
            {
              "name": "name_by_doc",
              "title": "Наименование",
              "valueType": "STRING",
              "maxLength": 5000
            },
            {
              "name": "content_restrict_encumbrances",
              "title": "Ограничение",
              "valueType": "STRING"
            },
            {
              "name": "legal_act_document_name",
              "title": "Документ",
              "valueType": "STRING",
              "maxLength": 5000
            },
            {
              "name": "legal_act_document_number",
              "title": "Номер",
              "valueType": "STRING"
            },
            {
              "name": "legal_act_document_date",
              "title": "Дата",
              "valueType": "STRING"
            },
            {
              "name": "legal_act_document_issuer",
              "title": "Орган власти, организация выдавшие документ",
              "valueType": "STRING"
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "valueType": "STRING",
              "hidden": true,
              "maxLength": 50
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "valueType": "DATETIME",
              "hidden": true
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "valueType": "DATETIME",
              "hidden": true,
              "description": "Дата последней модификации документа"
            },
            {
              "name": "updated_by",
              "title": "Кто обновил",
              "valueType": "STRING",
              "hidden": true,
              "readOnly": true,
              "maxLength": 50
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "valueType": "STRING",
              "hidden": true
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "hidden": true,
              "allowedValues": [
                "Polygon"
              ]
            }
          ],
          "originName": "ter_zone_nspd",
          "readOnly": false,
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'ter_zone_nspd';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "NSPD"
          ],
          "name": "zouit_nspd",
          "title": "Зоны с особыми условиями использования территорий",
          "tableName": "zouit_nspd",
          "styleName": "zouit_nspd",
          "properties": [
            {
              "name": "type_boundary_value",
              "title": "Вид",
              "valueType": "STRING"
            },
            {
              "name": "type_zone",
              "title": "Тип зоны",
              "valueType": "STRING"
            },
            {
              "name": "registration_date",
              "title": "Дата присвоения",
              "valueType": "DATETIME"
            },
            {
              "name": "reg_numb_border",
              "title": "Реестровый номер границы",
              "valueType": "STRING"
            },
            {
              "name": "cadastral_district",
              "title": "Кадастровый район",
              "valueType": "STRING"
            },
            {
              "name": "old_account_number",
              "title": "Учетный номер",
              "valueType": "STRING"
            },
            {
              "name": "name_by_doc",
              "title": "Наименование",
              "valueType": "STRING",
              "maxLength": 5000
            },
            {
              "name": "content_restrict_encumbrances",
              "title": "Ограничение",
              "valueType": "STRING",
              "maxLength": 5000
            },
            {
              "name": "legal_act_document_name",
              "title": "Документ",
              "valueType": "STRING"
            },
            {
              "name": "legal_act_document_number",
              "title": "Номер",
              "valueType": "STRING"
            },
            {
              "name": "legal_act_document_date",
              "title": "Дата",
              "valueType": "STRING"
            },
            {
              "name": "legal_act_document_issuer",
              "title": "Орган власти, организация выдавшие документ",
              "valueType": "STRING",
              "maxLength": 5000
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "valueType": "STRING",
              "hidden": true,
              "maxLength": 50
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "valueType": "DATETIME",
              "hidden": true
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "valueType": "DATETIME",
              "hidden": true,
              "description": "Дата последней модификации документа"
            },
            {
              "name": "updated_by",
              "title": "Кто обновил",
              "valueType": "STRING",
              "hidden": true,
              "readOnly": true,
              "maxLength": 50
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "valueType": "STRING",
              "hidden": true
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "hidden": true,
              "allowedValues": [
                "Polygon"
              ]
            }
          ],
          "originName": "zouit_nspd",
          "readOnly": false,
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'zouit_nspd';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "NSPD"
          ],
          "name": "zu_nspd",
          "title": "Земельные участки",
          "tableName": "zu_nspd",
          "styleName": "zu_nspd",
          "properties": [
            {
              "name": "land_record_type",
              "title": "Вид объекта недвижимости",
              "valueType": "STRING"
            },
            {
              "name": "land_record_subtype",
              "title": "Вид земельного участка",
              "valueType": "STRING"
            },
            {
              "name": "land_record_reg_date",
              "title": "Дата присвоения",
              "valueType": "DATETIME"
            },
            {
              "name": "cad_num",
              "title": "Кадастровый номер",
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "quarter_cad_number",
              "title": "Кадастровый квартал",
              "valueType": "STRING"
            },
            {
              "name": "readable_address",
              "title": "Адрес",
              "valueType": "STRING",
              "maxLength": 5000
            },
            {
              "name": "land_record_area",
              "title": "Площадь уточненная",
              "valueType": "STRING"
            },
            {
              "name": "declared_area",
              "title": "Площадь декларированная",
              "valueType": "STRING"
            },
            {
              "name": "area",
              "title": "Площадь",
              "valueType": "STRING"
            },
            {
              "name": "previously_posted",
              "title": "Статус",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Учтенный",
                  "value": "Учтенный"
                },
                {
                  "title": "Ранее учтенный",
                  "value": "Ранее учтенный"
                },
                {
                  "title": "Временный",
                  "value": "Временный"
                },
                {
                  "title": "Архивный",
                  "value": "Архивный"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "land_record_category_type",
              "title": "Категория земель",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Земли населенных пунктов",
                  "value": "Земли населенных пунктов"
                },
                {
                  "title": "Земли сeльcкoxoзяйcтвeннoгo нaзнaчeния",
                  "value": "Земли сeльcкoxoзяйcтвeннoгo нaзнaчeния"
                },
                {
                  "title": "Промышленные земли",
                  "value": "Промышленные земли"
                },
                {
                  "title": "Земли лесного фонда",
                  "value": "Земли лесного фонда"
                },
                {
                  "title": "Ocoбo oxpaняeмыe пpиpoдныe тeppитopии",
                  "value": "Ocoбo oxpaняeмыe пpиpoдныe тeppитopии"
                },
                {
                  "title": "Земли водного фонда",
                  "value": "Земли водного фонда"
                },
                {
                  "title": "Земли государственного запаса",
                  "value": "Земли государственного запаса"
                },
                {
                  "value": "Категория не установлена",
                  "title": "Категория не установлена"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "permitted_use_established_by_document",
              "title": "Вид разрешенного использования",
              "valueType": "STRING"
            },
            {
              "name": "ownership_type",
              "title": "Форма собственности",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Государственная",
                  "value": "Государственная"
                },
                {
                  "title": "Муниципальная",
                  "value": "Муниципальная"
                },
                {
                  "title": "Частная",
                  "value": "Частная"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "cost_value",
              "title": "Кадастровая стоимость, р.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "cost_index",
              "title": "Удельный показатель кадастровой стоимости",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 4
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "valueType": "STRING",
              "hidden": true,
              "maxLength": 50
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "valueType": "DATETIME",
              "hidden": true
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "valueType": "DATETIME",
              "hidden": true,
              "description": "Дата последней модификации документа"
            },
            {
              "name": "updated_by",
              "title": "Кто обновил",
              "valueType": "STRING",
              "hidden": true,
              "readOnly": true,
              "maxLength": 50
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "valueType": "STRING",
              "hidden": true
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "hidden": true,
              "allowedValues": [
                "Polygon"
              ]
            }
          ],
          "originName": "zu_nspd",
          "readOnly": false,
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'zu_nspd';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "NSPD"
          ],
          "name": "border_nspd",
          "title": "Административное деление",
          "tableName": "border_nspd",
          "styleName": "border_nspd",
          "properties": [
            {
              "name": "brd_nmb",
              "title": "Вид",
              "valueType": "STRING"
            },
            {
              "name": "code",
              "title": "Код",
              "valueType": "STRING"
            },
            {
              "name": "description",
              "title": "Наименование",
              "valueType": "STRING",
              "maxLength": 5000
            },
            {
              "name": "document_date",
              "title": "Дата",
              "valueType": "DATETIME"
            },
            {
              "name": "document_issuer",
              "title": "Орган власти, организация выдавшие документ",
              "valueType": "STRING",
              "maxLength": 5000
            },
            {
              "name": "document_name",
              "title": "Документ",
              "valueType": "STRING",
              "maxLength": 5000
            },
            {
              "name": "document_number",
              "title": "Номер",
              "valueType": "STRING"
            },
            {
              "name": "guid",
              "title": "guid",
              "valueType": "STRING"
            },
            {
              "name": "legal_acts",
              "title": "Правовые акты",
              "valueType": "STRING"
            },
            {
              "name": "loc",
              "title": "Локация",
              "valueType": "STRING"
            },
            {
              "name": "note",
              "title": "Описание",
              "valueType": "STRING"
            },
            {
              "name": "okato",
              "title": "ОКАТО",
              "valueType": "STRING"
            },
            {
              "name": "oktmo",
              "title": "ОКТМО",
              "valueType": "STRING"
            },
            {
              "name": "orig_cad_num",
              "title": "Реестровый номер",
              "valueType": "STRING"
            },
            {
              "name": "record_number",
              "title": "Реестровый номер",
              "valueType": "STRING"
            },
            {
              "name": "reg_code",
              "title": "Идентификационный номер",
              "valueType": "STRING"
            },
            {
              "name": "reg_num",
              "title": "Реестровый номер",
              "valueType": "STRING"
            },
            {
              "name": "registration_date",
              "title": "Дата постановки на учет / регистрации",
              "valueType": "DATETIME"
            },
            {
              "name": "status",
              "title": "Статус",
              "valueType": "STRING"
            },
            {
              "name": "subcat",
              "title": "Категория",
              "valueType": "STRING"
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "valueType": "STRING",
              "hidden": true,
              "maxLength": 50
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "valueType": "DATETIME",
              "hidden": true
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "valueType": "DATETIME",
              "hidden": true,
              "description": "Дата последней модификации документа"
            },
            {
              "name": "updated_by",
              "title": "Кто обновил",
              "valueType": "STRING",
              "hidden": true,
              "readOnly": true,
              "maxLength": 50
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "valueType": "STRING",
              "hidden": true
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "hidden": true,
              "allowedValues": [
                "Polygon"
              ]
            }
          ],
          "originName": "border_nspd",
          "readOnly": false,
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'border_nspd';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "NSPD"
          ],
          "name": "oks_nspd",
          "title": "Объекты капитального строительства",
          "tableName": "oks_nspd",
          "styleName": "oks_nspd",
          "properties": [
            {
              "name": "build_record_type_value",
              "title": "Вид объекта недвижимости",
              "valueType": "STRING"
            },
            {
              "name": "build_record_registration_date",
              "title": "Дата присвоения",
              "valueType": "DATETIME"
            },
            {
              "name": "cad_num",
              "title": "Кадастровый номер",
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "quarter_cad_number",
              "title": "Кадастровый квартал",
              "valueType": "STRING"
            },
            {
              "name": "readable_address",
              "title": "Адрес",
              "valueType": "STRING",
              "maxLength": 5000
            },
            {
              "name": "building_name",
              "title": "Наименование",
              "valueType": "STRING",
              "maxLength": 5000
            },
            {
              "name": "purpose",
              "title": "Назначение",
              "valueType": "STRING"
            },
            {
              "name": "build_record_area",
              "title": "Площадь общая",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "status",
              "title": "Статус",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Учтенный",
                  "value": "Учтенный"
                },
                {
                  "title": "Ранее учтенный",
                  "value": "Ранее учтенный"
                },
                {
                  "title": "Временный",
                  "value": "Временный"
                },
                {
                  "title": "Архивный",
                  "value": "Архивный"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "ownership_type",
              "title": "Форма собственности",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Государственная",
                  "value": "Государственная"
                },
                {
                  "title": "Муниципальная",
                  "value": "Муниципальная"
                },
                {
                  "title": "Частная",
                  "value": "Частная"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "cost_value",
              "title": "Кадастровая стоимость, р.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "cost_index",
              "title": "Удельный показатель кадастровой стоимости",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 4
            },
            {
              "name": "floors",
              "title": "Количество этажей (в том числе подземных)",
              "valueType": "STRING"
            },
            {
              "name": "underground_floors",
              "title": "Количество подземных этажей",
              "valueType": "STRING"
            },
            {
              "name": "materials",
              "title": "Материал стен",
              "valueType": "STRING"
            },
            {
              "name": "year_built",
              "title": "Завершение строительства",
              "valueType": "STRING"
            },
            {
              "name": "year_commisioning",
              "title": "Ввод в эксплуатацию",
              "valueType": "STRING"
            },
            {
              "name": "cultural_heritage_val",
              "title": "Сведения о включении объекта недвижимости в единый государственный реестр объектов культурного наследия (памятников истории и культуры) народов Российской Федерации",
              "valueType": "STRING"
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "valueType": "STRING",
              "hidden": true,
              "maxLength": 50
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "valueType": "DATETIME",
              "hidden": true
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "valueType": "DATETIME",
              "hidden": true,
              "description": "Дата последней модификации документа"
            },
            {
              "name": "updated_by",
              "title": "Кто обновил",
              "valueType": "STRING",
              "hidden": true,
              "readOnly": true,
              "maxLength": 50
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "valueType": "STRING",
              "hidden": true
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "hidden": true,
              "allowedValues": [
                "Polygon"
              ]
            }
          ],
          "originName": "oks_nspd",
          "readOnly": false,
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'oks_nspd';
