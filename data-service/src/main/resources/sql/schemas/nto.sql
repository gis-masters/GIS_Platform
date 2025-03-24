INSERT INTO data.schemas (name, class_rule)
SELECT 'trading_responsezone_simf_2022',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'trading_responsezone_simf_2022');

INSERT INTO data.schemas (name, class_rule)
SELECT 'nto_all',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'nto_all');

INSERT INTO data.schemas (name, class_rule)
SELECT 'nto_doc_point',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'nto_doc_point');

INSERT INTO data.schemas (name, class_rule)
SELECT 'nto_doc',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'nto_doc');

INSERT INTO data.schemas (name, class_rule)
SELECT 'nto_all_point',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'nto_all_point');

INSERT INTO data.schemas (name, class_rule)
SELECT 'nto_zone',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'nto_zone');

INSERT INTO data.schemas (name, class_rule)
SELECT 'zone_requirement_nto',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'zone_requirement_nto');


UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "НТО"
          ],
          "name": "trading_responsezone_simf_2022",
          "title": "Зоны ответственности",
          "styleName": "trading_responsezone_simf_2022",
          "tableName": "trading_responsezone_simf_2022",
          "properties": [
            {
              "name": "objectname",
              "title": "Наименование",
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "trade_num",
              "title": "Номер объекта на схеме относительно которого установлена зона",
              "maxLength": 10,
              "valueType": "STRING"
            },
            {
              "name": "descript",
              "title": "Описание зоны",
              "valueType": "STRING"
            },
            {
              "name": "area",
              "title": "Площадь, кв. м.",
              "valueType": "DOUBLE",
              "fractionDigits": 2
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "hidden": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Polygon"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "valueType": "STRING"
            }
          ],
          "description": "Зоны ответственности",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'trading_responsezone_simf_2022';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "НТО"
          ],
          "name": "nto_all",
          "title": "Нестационарные торговые объекты",
          "views": [
            {
              "id": "viewsId1",
              "title": "Свободный",
              "styleName": "polygon_nto",
              "attributes": [
                {
                  "name": "classid"
                },
                {
                  "name": "number"
                },
                {
                  "name": "location"
                },
                {
                  "name": "nto_type"
                },
                {
                  "name": "specialty"
                },
                {
                  "name": "status"
                },
                {
                  "name": "season"
                },
                {
                  "name": "area_doc"
                },
                {
                  "name": "area_fact"
                },
                {
                  "name": "photo"
                },
                {
                  "name": "owner"
                },
                {
                  "name": "doc"
                },
                {
                  "name": "timetable"
                },
                {
                  "name": "ownership"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "date_end"
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "viewsId2",
              "title": "Функционирующий",
              "styleName": "polygon_nto",
              "attributes": [
                {
                  "name": "classid"
                },
                {
                  "name": "number"
                },
                {
                  "name": "location"
                },
                {
                  "name": "nto_type"
                },
                {
                  "name": "specialty"
                },
                {
                  "name": "status"
                },
                {
                  "name": "season"
                },
                {
                  "name": "area_doc"
                },
                {
                  "name": "area_fact"
                },
                {
                  "name": "photo"
                },
                {
                  "name": "owner"
                },
                {
                  "name": "doc"
                },
                {
                  "name": "timetable"
                },
                {
                  "name": "ownership"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "date_end"
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "viewsId3",
              "title": "Планируемый",
              "styleName": "polygon_nto",
              "attributes": [
                {
                  "name": "classid"
                },
                {
                  "name": "number"
                },
                {
                  "name": "location"
                },
                {
                  "name": "nto_type"
                },
                {
                  "name": "specialty"
                },
                {
                  "name": "status"
                },
                {
                  "name": "season"
                },
                {
                  "name": "area_doc"
                },
                {
                  "name": "area_fact"
                },
                {
                  "name": "photo"
                },
                {
                  "name": "owner"
                },
                {
                  "name": "doc"
                },
                {
                  "name": "timetable"
                },
                {
                  "name": "ownership"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "date_end"
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "viewsId4",
              "title": "Незаконный",
              "styleName": "polygon_nto",
              "attributes": [
                {
                  "name": "classid"
                },
                {
                  "name": "number"
                },
                {
                  "name": "location"
                },
                {
                  "name": "nto_type"
                },
                {
                  "name": "specialty"
                },
                {
                  "name": "status"
                },
                {
                  "name": "season"
                },
                {
                  "name": "area_doc"
                },
                {
                  "name": "area_fact"
                },
                {
                  "name": "photo"
                },
                {
                  "name": "owner"
                },
                {
                  "name": "doc"
                },
                {
                  "name": "timetable"
                },
                {
                  "name": "ownership"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "date_end"
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "viewsId5",
              "title": "Не сезон",
              "styleName": "polygon_nto",
              "attributes": [
                {
                  "name": "classid"
                },
                {
                  "name": "number"
                },
                {
                  "name": "location"
                },
                {
                  "name": "nto_type"
                },
                {
                  "name": "specialty"
                },
                {
                  "name": "status"
                },
                {
                  "name": "season"
                },
                {
                  "name": "area_doc"
                },
                {
                  "name": "area_fact"
                },
                {
                  "name": "photo"
                },
                {
                  "name": "owner"
                },
                {
                  "name": "doc"
                },
                {
                  "name": "timetable"
                },
                {
                  "name": "ownership"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "date_end"
                },
                {
                  "name": "note"
                }
              ]
            }
          ],
          "readOnly": false,
          "styleName": "polygon_nto",
          "tableName": "nto_all",
          "properties": [
            {
              "name": "classid",
              "title": "Вид объекта",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Автосервис",
                  "value": "311550000"
                },
                {
                  "title": "Бахчевые культуры",
                  "value": "311430000"
                },
                {
                  "title": "Бытовые услуги",
                  "value": "311530000"
                },
                {
                  "title": "Горячие напитки со спец. аппарата",
                  "value": "311370000"
                },
                {
                  "title": "Живая рыба",
                  "value": "311410000"
                },
                {
                  "title": "Живые цветы",
                  "value": "311440000"
                },
                {
                  "title": "Иные нестационарные объекты",
                  "value": "311510000"
                },
                {
                  "title": "Квас",
                  "value": "311390000"
                },
                {
                  "title": "Квас, мороженое",
                  "value": "311400000"
                },
                {
                  "title": "Колбасные изделия",
                  "value": "311350000"
                },
                {
                  "title": "Кондитерские изделия",
                  "value": "311310000"
                },
                {
                  "title": "Лекарственные средства",
                  "value": "311560000"
                },
                {
                  "title": "Мед и продукция пчеловодства",
                  "value": "311420000"
                },
                {
                  "title": "Молочная продукция",
                  "value": "311470000"
                },
                {
                  "title": "Напитки, мороженое",
                  "value": "311380000"
                },
                {
                  "title": "Непродовольственные товары",
                  "value": "311520000"
                },
                {
                  "title": "Общественное питание",
                  "value": "311490000"
                },
                {
                  "title": "Общественный туалет",
                  "value": "311480000"
                },
                {
                  "title": "Питьевая вода",
                  "value": "311500000"
                },
                {
                  "title": "Продовольственные товары",
                  "value": "311340000"
                },
                {
                  "title": "Сельскохозяйственная продукция",
                  "value": "311320000"
                },
                {
                  "title": "Хвойные насаждения",
                  "value": "311450000"
                },
                {
                  "title": "Хлебобулочные изделия",
                  "value": "311360000"
                },
                {
                  "title": "Хлебобулочные и кондитерские изделия",
                  "value": "311460000"
                }
              ]
            },
            {
              "name": "number",
              "title": "Номер на схеме",
              "required": true,
              "valueType": "INT",
              "description": "Уникальный номер места на карте"
            },
            {
              "name": "location",
              "title": "Местоположение",
              "asTitle": true,
              "required": true,
              "maxLength": 400,
              "valueType": "STRING"
            },
            {
              "name": "nto_type",
              "title": "Тип НТО",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "автолавка",
                  "value": "автолавка"
                },
                {
                  "title": "киоск",
                  "value": "киоск"
                },
                {
                  "title": "открытое кафе",
                  "value": "открытое кафе"
                },
                {
                  "title": "бар",
                  "value": "бар"
                },
                {
                  "title": "павильон",
                  "value": "павильон"
                },
                {
                  "title": "кафе-киоск",
                  "value": "кафе-киоск"
                },
                {
                  "title": "бахчевой развал",
                  "value": "бахчевой развал"
                },
                {
                  "title": "торговый павильон",
                  "value": "торговый павильон"
                },
                {
                  "title": "автомагазин",
                  "value": "автомагазин"
                },
                {
                  "title": "торговый автомат",
                  "value": "торговый автомат"
                },
                {
                  "title": "торговая палатка",
                  "value": "торговая палатка"
                },
                {
                  "title": "торговая галерея",
                  "value": "торговая галерея"
                },
                {
                  "title": "елочный базар",
                  "value": "елочный базар"
                },
                {
                  "title": "палатка",
                  "value": "палатка"
                },
                {
                  "title": "киоск - малый модуль",
                  "value": "киоск - малый модуль"
                },
                {
                  "title": "лоток",
                  "value": "лоток"
                },
                {
                  "title": "автокафе",
                  "value": "автокафе"
                },
                {
                  "title": "презентационная стойка",
                  "value": "презентационная стойка"
                }
              ]
            },
            {
              "name": "specialty",
              "title": "Специализация",
              "valueType": "STRING",
              "description": "Описание специализации торгового объекта"
            },
            {
              "name": "status",
              "title": "Статус",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Функционирующий ",
                  "value": "Функционирующий "
                },
                {
                  "title": "Не сезон",
                  "value": "Не сезон"
                },
                {
                  "title": "Свободный",
                  "value": "Свободный"
                },
                {
                  "title": "Планируемый",
                  "value": "Планируемый"
                },
                {
                  "title": "Незаконный",
                  "value": "Незаконный"
                }
              ]
            },
            {
              "name": "season",
              "title": "Период функционирования НТО",
              "valueType": "STRING",
              "description": "Период функционирования НТО"
            },
            {
              "name": "area_doc",
              "title": "Площадь, м.кв.",
              "valueType": "DOUBLE",
              "description": "Площадь по документам",
              "fractionDigits": 6
            },
            {
              "name": "area_fact",
              "title": "Расчётная площадь, кв. м.",
              "readOnly": true,
              "valueType": "DOUBLE",
              "description": "Площадь, вычисленная по координатам",
              "totalDigits": 38,
              "fractionDigits": 2,
              "calculatedValueWellKnownFormula": "st_area"
            },
            {
              "name": "photo",
              "title": "Фото",
              "maxSize": 50000000,
              "multiple": true,
              "valueType": "FILE",
              "description": "Фотоматериалы существующего НТО"
            },
            {
              "name": "owner",
              "title": "Арендатор",
              "multiple": true,
              "libraries": [
                "dl_data_renter_nto"
              ],
              "valueType": "DOCUMENT",
              "maxDocuments": 10
            },
            {
              "name": "doc",
              "title": "Документы",
              "multiple": true,
              "libraries": [
                "dl_data_doc_nto"
              ],
              "valueType": "DOCUMENT",
              "maxDocuments": 10
            },
            {
              "name": "timetable",
              "title": "График работы",
              "valueType": "STRING"
            },
            {
              "name": "ownership",
              "title": "Тип собственности",
              "readOnly": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Государственная",
                  "value": "Государственная"
                },
                {
                  "title": "Частная",
                  "value": "Частная"
                },
                {
                  "title": "Муниципальная",
                  "value": "Муниципальная"
                }
              ]
            },
            {
              "name": "date_reg",
              "title": "Дата начала",
              "required": true,
              "valueType": "DATETIME",
              "description": "Дата начала действия договора"
            },
            {
              "name": "date_end",
              "title": "Дата прекращения",
              "required": true,
              "valueType": "DATETIME",
              "description": "Дата окончания договора"
            },
            {
              "name": "note",
              "title": "Примечание",
              "valueType": "STRING"
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "maxLength": 254,
              "valueType": "STRING"
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "hidden": true,
              "required": false,
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "hidden": true,
              "readOnly": true,
              "required": false,
              "valueType": "DATETIME",
              "description": "Дата последней модификации документа"
            },
            {
              "name": "updated_by",
              "title": "Кто обновил",
              "hidden": true,
              "readOnly": true,
              "required": false,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "hidden": true,
              "required": false,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "hidden": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Polygon"
              ]
            }
          ],
          "description": "Дежурная карта НТО",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'nto_all';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "НТО"
          ],
          "name": "nto_doc_point",
          "title": "Нестационарные торговые объекты c документами",
          "views": [
            {
              "id": "viewsId1",
              "title": "Свободный",
              "styleName": "polygon_nto",
              "attributes": [
                {
                  "name": "classid"
                },
                {
                  "name": "number"
                },
                {
                  "name": "location"
                },
                {
                  "name": "nto_type"
                },
                {
                  "name": "specialty"
                },
                {
                  "name": "status"
                },
                {
                  "name": "season"
                },
                {
                  "name": "area_doc"
                },
                {
                  "name": "area_fact"
                },
                {
                  "name": "photo"
                },
                {
                  "name": "owner"
                },
                {
                  "name": "passport"
                },
                {
                  "name": "lease_contract"
                },
                {
                  "name": "files"
                },
                {
                  "name": "timetable"
                },
                {
                  "name": "ownership"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "date_end"
                },
                {
                  "name": "created_at"
                },
                {
                  "name": "created_by"
                },
                {
                  "name": "last_modified"
                },
                {
                  "name": "updated_by"
                },
                {
                  "name": "shape"
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "viewsId1",
              "title": "Функционирующий",
              "styleName": "polygon_nto",
              "attributes": [
                {
                  "name": "classid"
                },
                {
                  "name": "number"
                },
                {
                  "name": "location"
                },
                {
                  "name": "nto_type"
                },
                {
                  "name": "specialty"
                },
                {
                  "name": "status"
                },
                {
                  "name": "season"
                },
                {
                  "name": "area_doc"
                },
                {
                  "name": "area_fact"
                },
                {
                  "name": "photo"
                },
                {
                  "name": "owner"
                },
                {
                  "name": "passport"
                },
                {
                  "name": "lease_contract"
                },
                {
                  "name": "files"
                },
                {
                  "name": "timetable"
                },
                {
                  "name": "ownership"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "date_end"
                },
                {
                  "name": "created_at"
                },
                {
                  "name": "created_by"
                },
                {
                  "name": "last_modified"
                },
                {
                  "name": "updated_by"
                },
                {
                  "name": "shape"
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "viewsId1",
              "title": "Планируемый",
              "styleName": "polygon_nto",
              "attributes": [
                {
                  "name": "classid"
                },
                {
                  "name": "number"
                },
                {
                  "name": "location"
                },
                {
                  "name": "nto_type"
                },
                {
                  "name": "specialty"
                },
                {
                  "name": "status"
                },
                {
                  "name": "season"
                },
                {
                  "name": "area_doc"
                },
                {
                  "name": "area_fact"
                },
                {
                  "name": "photo"
                },
                {
                  "name": "owner"
                },
                {
                  "name": "passport"
                },
                {
                  "name": "lease_contract"
                },
                {
                  "name": "files"
                },
                {
                  "name": "timetable"
                },
                {
                  "name": "ownership"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "date_end"
                },
                {
                  "name": "created_at"
                },
                {
                  "name": "created_by"
                },
                {
                  "name": "last_modified"
                },
                {
                  "name": "updated_by"
                },
                {
                  "name": "shape"
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "viewsId1",
              "title": "Незаконный",
              "styleName": "polygon_nto",
              "attributes": [
                {
                  "name": "classid"
                },
                {
                  "name": "number"
                },
                {
                  "name": "location"
                },
                {
                  "name": "nto_type"
                },
                {
                  "name": "specialty"
                },
                {
                  "name": "status"
                },
                {
                  "name": "season"
                },
                {
                  "name": "area_doc"
                },
                {
                  "name": "area_fact"
                },
                {
                  "name": "photo"
                },
                {
                  "name": "owner"
                },
                {
                  "name": "passport"
                },
                {
                  "name": "lease_contract"
                },
                {
                  "name": "files"
                },
                {
                  "name": "timetable"
                },
                {
                  "name": "ownership"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "date_end"
                },
                {
                  "name": "created_at"
                },
                {
                  "name": "created_by"
                },
                {
                  "name": "last_modified"
                },
                {
                  "name": "updated_by"
                },
                {
                  "name": "shape"
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "viewsId1",
              "title": "Не сезон",
              "styleName": "polygon_nto",
              "attributes": [
                {
                  "name": "classid"
                },
                {
                  "name": "number"
                },
                {
                  "name": "location"
                },
                {
                  "name": "nto_type"
                },
                {
                  "name": "specialty"
                },
                {
                  "name": "status"
                },
                {
                  "name": "season"
                },
                {
                  "name": "area_doc"
                },
                {
                  "name": "area_fact"
                },
                {
                  "name": "photo"
                },
                {
                  "name": "owner"
                },
                {
                  "name": "passport"
                },
                {
                  "name": "lease_contract"
                },
                {
                  "name": "files"
                },
                {
                  "name": "timetable"
                },
                {
                  "name": "ownership"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "date_end"
                },
                {
                  "name": "created_at"
                },
                {
                  "name": "created_by"
                },
                {
                  "name": "last_modified"
                },
                {
                  "name": "updated_by"
                },
                {
                  "name": "shape"
                },
                {
                  "name": "note"
                }
              ]
            }
          ],
          "readOnly": false,
          "styleName": "polygon_nto",
          "tableName": "nto_doc_point",
          "originName": "nto_doc_point",
          "properties": [
            {
              "name": "classid",
              "title": "Вид объекта",
              "asTitle": true,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Автосервис",
                  "value": "311550000"
                },
                {
                  "title": "Бахчевые культуры",
                  "value": "311430000"
                },
                {
                  "title": "Бытовые услуги",
                  "value": "311530000"
                },
                {
                  "title": "Горячие напитки со спец. аппарата",
                  "value": "311370000"
                },
                {
                  "title": "Живая рыба",
                  "value": "311410000"
                },
                {
                  "title": "Живые цветы",
                  "value": "311440000"
                },
                {
                  "title": "Иные нестационарные объекты",
                  "value": "311510000"
                },
                {
                  "title": "Квас",
                  "value": "311390000"
                },
                {
                  "title": "Квас, мороженое",
                  "value": "311400000"
                },
                {
                  "title": "Колбасные изделия",
                  "value": "311350000"
                },
                {
                  "title": "Кондитерские изделия",
                  "value": "311310000"
                },
                {
                  "title": "Лекарственные средства",
                  "value": "311560000"
                },
                {
                  "title": "Мед и продукция пчеловодства",
                  "value": "311420000"
                },
                {
                  "title": "Молочная продукция",
                  "value": "311470000"
                },
                {
                  "title": "Напитки, мороженое",
                  "value": "311380000"
                },
                {
                  "title": "Непродовольственные товары",
                  "value": "311520000"
                },
                {
                  "title": "Общественное питание",
                  "value": "311490000"
                },
                {
                  "title": "Общественный туалет",
                  "value": "311480000"
                },
                {
                  "title": "Питьевая вода",
                  "value": "311500000"
                },
                {
                  "title": "Продовольственные товары",
                  "value": "311340000"
                },
                {
                  "title": "Сельскохозяйственная продукция",
                  "value": "311320000"
                },
                {
                  "title": "Хвойные насаждения",
                  "value": "311450000"
                },
                {
                  "title": "Хлебобулочные изделия",
                  "value": "311360000"
                },
                {
                  "title": "Хлебобулочные и кондитерские изделия",
                  "value": "311460000"
                }
              ]
            },
            {
              "name": "number",
              "title": "Номер на схеме",
              "required": true,
              "valueType": "INT",
              "description": "Уникальный номер места на карте"
            },
            {
              "name": "location",
              "title": "Место положение",
              "required": true,
              "maxLength": 400,
              "valueType": "STRING",
              "description": "Адресное описание"
            },
            {
              "name": "nto_type",
              "title": "Тип НТО",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "автолавка",
                  "value": "автолавка"
                },
                {
                  "title": "киоск",
                  "value": "киоск"
                },
                {
                  "title": "открытое кафе",
                  "value": "открытое кафе"
                },
                {
                  "title": "бар",
                  "value": "бар"
                },
                {
                  "title": "павильон",
                  "value": "павильон"
                },
                {
                  "title": "кафе-киоск",
                  "value": "кафе-киоск"
                },
                {
                  "title": "бахчевой развал",
                  "value": "бахчевой развал"
                },
                {
                  "title": "торговый павильон",
                  "value": "торговый павильон"
                },
                {
                  "title": "автомагазин",
                  "value": "автомагазин"
                },
                {
                  "title": "торговый автомат",
                  "value": "торговый автомат"
                },
                {
                  "title": "торговая палатка",
                  "value": "торговая палатка"
                },
                {
                  "title": "торговая галерея",
                  "value": "торговая галерея"
                },
                {
                  "title": "елочный базар",
                  "value": "елочный базар"
                },
                {
                  "title": "палатка",
                  "value": "палатка"
                },
                {
                  "title": "киоск - малый модуль",
                  "value": "киоск - малый модуль"
                },
                {
                  "title": "лоток",
                  "value": "лоток"
                },
                {
                  "title": "автокафе",
                  "value": "автокафе"
                },
                {
                  "title": "презентационная стойка",
                  "value": "презентационная стойка"
                }
              ]
            },
            {
              "name": "specialty",
              "title": "Специализация",
              "valueType": "STRING",
              "description": "Описание специализации торгового объекта"
            },
            {
              "name": "status",
              "title": "Статус",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Функционирующий ",
                  "value": "Функционирующий "
                },
                {
                  "title": "Не сезон",
                  "value": "Не сезон"
                },
                {
                  "title": "Свободный",
                  "value": "Свободный"
                },
                {
                  "title": "Планируемый",
                  "value": "Планируемый"
                },
                {
                  "title": "Незаконный",
                  "value": "Незаконный"
                }
              ]
            },
            {
              "name": "season",
              "title": "Период функционирования НТО",
              "valueType": "STRING",
              "description": "Период функционирования НТО"
            },
            {
              "name": "area_doc",
              "title": "Площадь, м.кв.",
              "valueType": "DOUBLE",
              "description": "Площадь по документам",
              "fractionDigits": 6
            },
            {
              "name": "photo",
              "title": "Фотоматериалы существующего НТО",
              "maxSize": 50000000,
              "multiple": true,
              "valueType": "FILE",
              "description": "Фотоматериалы существующего НТО"
            },
            {
              "name": "owner",
              "title": "Арендатор",
              "valueType": "STRING"
            },
            {
              "name": "passport",
              "title": "Паспорт НТО",
              "maxSize": 50000000,
              "multiple": true,
              "required": true,
              "valueType": "FILE"
            },
            {
              "name": "lease_contract",
              "title": "Договор",
              "maxSize": 50000000,
              "multiple": true,
              "required": true,
              "valueType": "FILE"
            },
            {
              "name": "files",
              "title": "Прочие",
              "maxSize": 50000000,
              "multiple": true,
              "valueType": "FILE",
              "description": "Прочие"
            },
            {
              "name": "timetable",
              "title": "График работы",
              "valueType": "STRING"
            },
            {
              "name": "ownership",
              "title": "Тип собственности",
              "readOnly": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Государственная",
                  "value": "Государственная"
                },
                {
                  "title": "Частная",
                  "value": "Частная"
                },
                {
                  "title": "Муниципальная",
                  "value": "Муниципальная"
                }
              ]
            },
            {
              "name": "date_reg",
              "title": "Дата начала",
              "required": true,
              "valueType": "DATETIME",
              "description": "Дата начала действия договора"
            },
            {
              "name": "date_end",
              "title": "Дата прекращения",
              "required": true,
              "valueType": "DATETIME",
              "description": "Дата окончания договора"
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "hidden": true,
              "readOnly": true,
              "valueType": "DATETIME"
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "hidden": true,
              "readOnly": true,
              "valueType": "STRING"
            },
            {
              "name": "last_modified",
              "title": "Дата последней модификации",
              "hidden": true,
              "readOnly": true,
              "valueType": "DATETIME"
            },
            {
              "name": "updated_by",
              "title": "Кто обновил",
              "hidden": true,
              "readOnly": true,
              "valueType": "STRING"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Point"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "valueType": "INT"
            },
            {
              "name": "notes",
              "title": "Примечания",
              "valueType": "STRING"
            }
          ],
          "description": "Нестационарные торговые объекты c документами",
          "geometryType": "Point"
        }'
WHERE name = 'nto_doc_point';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "НТО"
          ],
          "name": "nto_doc",
          "title": "Нестационарные торговые объекты",
          "views": [
            {
              "id": "viewsId1",
              "title": "Свободный",
              "styleName": "polygon_nto",
              "attributes": [
                {
                  "name": "classid"
                },
                {
                  "name": "number"
                },
                {
                  "name": "location"
                },
                {
                  "name": "nto_type"
                },
                {
                  "name": "specialty"
                },
                {
                  "name": "status"
                },
                {
                  "name": "season"
                },
                {
                  "name": "area_doc"
                },
                {
                  "name": "area_fact"
                },
                {
                  "name": "photo"
                },
                {
                  "name": "owner"
                },
                {
                  "name": "passport"
                },
                {
                  "name": "lease_contract"
                },
                {
                  "name": "files"
                },
                {
                  "name": "timetable"
                },
                {
                  "name": "ownership"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "date_end"
                },
                {
                  "name": "created_at"
                },
                {
                  "name": "created_by"
                },
                {
                  "name": "last_modified"
                },
                {
                  "name": "updated_by"
                },
                {
                  "name": "shape"
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "viewsId1",
              "title": "Функционирующий",
              "styleName": "polygon_nto",
              "attributes": [
                {
                  "name": "classid"
                },
                {
                  "name": "number"
                },
                {
                  "name": "location"
                },
                {
                  "name": "nto_type"
                },
                {
                  "name": "specialty"
                },
                {
                  "name": "status"
                },
                {
                  "name": "season"
                },
                {
                  "name": "area_doc"
                },
                {
                  "name": "area_fact"
                },
                {
                  "name": "photo"
                },
                {
                  "name": "owner"
                },
                {
                  "name": "passport"
                },
                {
                  "name": "lease_contract"
                },
                {
                  "name": "files"
                },
                {
                  "name": "timetable"
                },
                {
                  "name": "ownership"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "date_end"
                },
                {
                  "name": "created_at"
                },
                {
                  "name": "created_by"
                },
                {
                  "name": "last_modified"
                },
                {
                  "name": "updated_by"
                },
                {
                  "name": "shape"
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "viewsId1",
              "title": "Планируемый",
              "styleName": "polygon_nto",
              "attributes": [
                {
                  "name": "classid"
                },
                {
                  "name": "number"
                },
                {
                  "name": "location"
                },
                {
                  "name": "nto_type"
                },
                {
                  "name": "specialty"
                },
                {
                  "name": "status"
                },
                {
                  "name": "season"
                },
                {
                  "name": "area_doc"
                },
                {
                  "name": "area_fact"
                },
                {
                  "name": "photo"
                },
                {
                  "name": "owner"
                },
                {
                  "name": "passport"
                },
                {
                  "name": "lease_contract"
                },
                {
                  "name": "files"
                },
                {
                  "name": "timetable"
                },
                {
                  "name": "ownership"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "date_end"
                },
                {
                  "name": "created_at"
                },
                {
                  "name": "created_by"
                },
                {
                  "name": "last_modified"
                },
                {
                  "name": "updated_by"
                },
                {
                  "name": "shape"
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "viewsId1",
              "title": "Незаконный",
              "styleName": "polygon_nto",
              "attributes": [
                {
                  "name": "classid"
                },
                {
                  "name": "number"
                },
                {
                  "name": "location"
                },
                {
                  "name": "nto_type"
                },
                {
                  "name": "specialty"
                },
                {
                  "name": "status"
                },
                {
                  "name": "season"
                },
                {
                  "name": "area_doc"
                },
                {
                  "name": "area_fact"
                },
                {
                  "name": "photo"
                },
                {
                  "name": "owner"
                },
                {
                  "name": "passport"
                },
                {
                  "name": "lease_contract"
                },
                {
                  "name": "files"
                },
                {
                  "name": "timetable"
                },
                {
                  "name": "ownership"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "date_end"
                },
                {
                  "name": "created_at"
                },
                {
                  "name": "created_by"
                },
                {
                  "name": "last_modified"
                },
                {
                  "name": "updated_by"
                },
                {
                  "name": "shape"
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "viewsId1",
              "title": "Не сезон",
              "styleName": "polygon_nto",
              "attributes": [
                {
                  "name": "classid"
                },
                {
                  "name": "number"
                },
                {
                  "name": "location"
                },
                {
                  "name": "nto_type"
                },
                {
                  "name": "specialty"
                },
                {
                  "name": "status"
                },
                {
                  "name": "season"
                },
                {
                  "name": "area_doc"
                },
                {
                  "name": "area_fact"
                },
                {
                  "name": "photo"
                },
                {
                  "name": "owner"
                },
                {
                  "name": "passport"
                },
                {
                  "name": "lease_contract"
                },
                {
                  "name": "files"
                },
                {
                  "name": "timetable"
                },
                {
                  "name": "ownership"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "date_end"
                },
                {
                  "name": "created_at"
                },
                {
                  "name": "created_by"
                },
                {
                  "name": "last_modified"
                },
                {
                  "name": "updated_by"
                },
                {
                  "name": "shape"
                },
                {
                  "name": "note"
                }
              ]
            }
          ],
          "readOnly": false,
          "styleName": "polygon_nto",
          "tableName": "nto_doc",
          "originName": "nto_doc",
          "properties": [
            {
              "name": "classid",
              "title": "Вид объекта",
              "asTitle": true,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Автосервис",
                  "value": "311550000"
                },
                {
                  "title": "Бахчевые культуры",
                  "value": "311430000"
                },
                {
                  "title": "Бытовые услуги",
                  "value": "311530000"
                },
                {
                  "title": "Горячие напитки со спец. аппарата",
                  "value": "311370000"
                },
                {
                  "title": "Живая рыба",
                  "value": "311410000"
                },
                {
                  "title": "Живые цветы",
                  "value": "311440000"
                },
                {
                  "title": "Иные нестационарные объекты",
                  "value": "311510000"
                },
                {
                  "title": "Квас",
                  "value": "311390000"
                },
                {
                  "title": "Квас, мороженое",
                  "value": "311400000"
                },
                {
                  "title": "Колбасные изделия",
                  "value": "311350000"
                },
                {
                  "title": "Кондитерские изделия",
                  "value": "311310000"
                },
                {
                  "title": "Лекарственные средства",
                  "value": "311560000"
                },
                {
                  "title": "Мед и продукция пчеловодства",
                  "value": "311420000"
                },
                {
                  "title": "Молочная продукция",
                  "value": "311470000"
                },
                {
                  "title": "Напитки, мороженое",
                  "value": "311380000"
                },
                {
                  "title": "Непродовольственные товары",
                  "value": "311520000"
                },
                {
                  "title": "Общественное питание",
                  "value": "311490000"
                },
                {
                  "title": "Общественный туалет",
                  "value": "311480000"
                },
                {
                  "title": "Питьевая вода",
                  "value": "311500000"
                },
                {
                  "title": "Продовольственные товары",
                  "value": "311340000"
                },
                {
                  "title": "Сельскохозяйственная продукция",
                  "value": "311320000"
                },
                {
                  "title": "Хвойные насаждения",
                  "value": "311450000"
                },
                {
                  "title": "Хлебобулочные изделия",
                  "value": "311360000"
                },
                {
                  "title": "Хлебобулочные и кондитерские изделия",
                  "value": "311460000"
                }
              ]
            },
            {
              "name": "number",
              "title": "Номер на схеме",
              "required": true,
              "valueType": "INT",
              "description": "Уникальный номер места на карте"
            },
            {
              "name": "location",
              "title": "Местоположение",
              "required": true,
              "maxLength": 400,
              "valueType": "STRING",
              "description": "Адресное описание"
            },
            {
              "name": "nto_type",
              "title": "Тип НТО",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "автолавка",
                  "value": "автолавка"
                },
                {
                  "title": "киоск",
                  "value": "киоск"
                },
                {
                  "title": "открытое кафе",
                  "value": "открытое кафе"
                },
                {
                  "title": "бар",
                  "value": "бар"
                },
                {
                  "title": "павильон",
                  "value": "павильон"
                },
                {
                  "title": "кафе-киоск",
                  "value": "кафе-киоск"
                },
                {
                  "title": "бахчевой развал",
                  "value": "бахчевой развал"
                },
                {
                  "title": "торговый павильон",
                  "value": "торговый павильон"
                },
                {
                  "title": "автомагазин",
                  "value": "автомагазин"
                },
                {
                  "title": "торговый автомат",
                  "value": "торговый автомат"
                },
                {
                  "title": "торговая палатка",
                  "value": "торговая палатка"
                },
                {
                  "title": "торговая галерея",
                  "value": "торговая галерея"
                },
                {
                  "title": "елочный базар",
                  "value": "елочный базар"
                },
                {
                  "title": "палатка",
                  "value": "палатка"
                },
                {
                  "title": "киоск - малый модуль",
                  "value": "киоск - малый модуль"
                },
                {
                  "title": "лоток",
                  "value": "лоток"
                },
                {
                  "title": "автокафе",
                  "value": "автокафе"
                },
                {
                  "title": "презентационная стойка",
                  "value": "презентационная стойка"
                }
              ]
            },
            {
              "name": "specialty",
              "title": "Специализация",
              "valueType": "STRING",
              "description": "Описание специализации торгового объекта"
            },
            {
              "name": "status",
              "title": "Статус",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Функционирующий",
                  "value": "Функционирующий"
                },
                {
                  "title": "Не сезон",
                  "value": "Не сезон"
                },
                {
                  "title": "Свободный",
                  "value": "Свободный"
                },
                {
                  "title": "Планируемый",
                  "value": "Планируемый"
                },
                {
                  "title": "Незаконный",
                  "value": "Незаконный"
                }
              ]
            },
            {
              "name": "season",
              "title": "Период",
              "valueType": "STRING",
              "description": "Период функционирования НТО"
            },
            {
              "name": "area_doc",
              "title": "Площадь, м.кв.",
              "valueType": "DOUBLE",
              "description": "Площадь по документам",
              "fractionDigits": 6
            },
            {
              "name": "area_fact",
              "title": "Расчётная площадь, кв. м.",
              "readOnly": true,
              "valueType": "DOUBLE",
              "description": "Площадь, вычисленная по координатам",
              "totalDigits": 38,
              "fractionDigits": 2,
              "calculatedValueWellKnownFormula": "st_area"
            },
            {
              "name": "photo",
              "title": "Фото",
              "maxSize": 50000000,
              "multiple": true,
              "valueType": "FILE",
              "description": "Фотоматериалы существующего НТО"
            },
            {
              "name": "owner",
              "title": "Арендатор",
              "valueType": "STRING"
            },
            {
              "name": "passport",
              "title": "Паспорт НТО",
              "maxSize": 50000000,
              "multiple": true,
              "required": true,
              "valueType": "FILE"
            },
            {
              "name": "lease_contract",
              "title": "Договор",
              "maxSize": 50000000,
              "multiple": true,
              "required": true,
              "valueType": "FILE"
            },
            {
              "name": "files",
              "title": "Прочие",
              "maxSize": 50000000,
              "multiple": true,
              "valueType": "FILE",
              "description": "Прочие"
            },
            {
              "name": "timetable",
              "title": "График работы",
              "valueType": "STRING"
            },
            {
              "name": "ownership",
              "title": "Тип собственности",
              "readOnly": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Государственная",
                  "value": "Государственная"
                },
                {
                  "title": "Частная",
                  "value": "Частная"
                },
                {
                  "title": "Муниципальная",
                  "value": "Муниципальная"
                }
              ]
            },
            {
              "name": "date_reg",
              "title": "Дата начала",
              "required": true,
              "valueType": "DATETIME",
              "description": "Дата начала действия договора"
            },
            {
              "name": "date_end",
              "title": "Дата прекращения",
              "required": true,
              "valueType": "DATETIME",
              "description": "Дата окончания договора"
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "hidden": true,
              "readOnly": true,
              "valueType": "DATETIME"
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "hidden": true,
              "readOnly": true,
              "valueType": "STRING"
            },
            {
              "name": "last_modified",
              "title": "Дата последней модификации",
              "hidden": true,
              "readOnly": true,
              "valueType": "DATETIME"
            },
            {
              "name": "updated_by",
              "title": "Кто обновил",
              "hidden": true,
              "readOnly": true,
              "valueType": "STRING"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Polygon"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "valueType": "INT"
            },
            {
              "name": "notes",
              "title": "Примечания",
              "valueType": "STRING"
            }
          ],
          "description": "Нестационарные торговые объекты c документами",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'nto_doc';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "НТО"
          ],
          "name": "nto_all_point",
          "title": "Нестационарные торговые объекты",
          "views": [
            {
              "id": "viewsId1",
              "title": "Свободный",
              "styleName": "polygon_nto",
              "attributes": [
                {
                  "name": "classid"
                },
                {
                  "name": "number"
                },
                {
                  "name": "location"
                },
                {
                  "name": "nto_type"
                },
                {
                  "name": "specialty"
                },
                {
                  "name": "status"
                },
                {
                  "name": "season"
                },
                {
                  "name": "area_doc"
                },
                {
                  "name": "area_fact"
                },
                {
                  "name": "photo"
                },
                {
                  "name": "owner"
                },
                {
                  "name": "doc"
                },
                {
                  "name": "timetable"
                },
                {
                  "name": "ownership"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "date_end"
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "viewsId2",
              "title": "Функционирующий",
              "styleName": "polygon_nto",
              "attributes": [
                {
                  "name": "classid"
                },
                {
                  "name": "number"
                },
                {
                  "name": "location"
                },
                {
                  "name": "nto_type"
                },
                {
                  "name": "specialty"
                },
                {
                  "name": "status"
                },
                {
                  "name": "season"
                },
                {
                  "name": "area_doc"
                },
                {
                  "name": "area_fact"
                },
                {
                  "name": "photo"
                },
                {
                  "name": "owner"
                },
                {
                  "name": "doc"
                },
                {
                  "name": "timetable"
                },
                {
                  "name": "ownership"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "date_end"
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "viewsId3",
              "title": "Планируемый",
              "styleName": "polygon_nto",
              "attributes": [
                {
                  "name": "classid"
                },
                {
                  "name": "number"
                },
                {
                  "name": "location"
                },
                {
                  "name": "nto_type"
                },
                {
                  "name": "specialty"
                },
                {
                  "name": "status"
                },
                {
                  "name": "season"
                },
                {
                  "name": "area_doc"
                },
                {
                  "name": "area_fact"
                },
                {
                  "name": "photo"
                },
                {
                  "name": "owner"
                },
                {
                  "name": "doc"
                },
                {
                  "name": "timetable"
                },
                {
                  "name": "ownership"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "date_end"
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "viewsId4",
              "title": "Незаконный",
              "styleName": "polygon_nto",
              "attributes": [
                {
                  "name": "classid"
                },
                {
                  "name": "number"
                },
                {
                  "name": "location"
                },
                {
                  "name": "nto_type"
                },
                {
                  "name": "specialty"
                },
                {
                  "name": "status"
                },
                {
                  "name": "season"
                },
                {
                  "name": "area_doc"
                },
                {
                  "name": "area_fact"
                },
                {
                  "name": "photo"
                },
                {
                  "name": "owner"
                },
                {
                  "name": "doc"
                },
                {
                  "name": "timetable"
                },
                {
                  "name": "ownership"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "date_end"
                },
                {
                  "name": "note"
                }
              ]
            },
            {
              "id": "viewsId5",
              "title": "Не сезон",
              "styleName": "polygon_nto",
              "attributes": [
                {
                  "name": "classid"
                },
                {
                  "name": "number"
                },
                {
                  "name": "location"
                },
                {
                  "name": "nto_type"
                },
                {
                  "name": "specialty"
                },
                {
                  "name": "status"
                },
                {
                  "name": "season"
                },
                {
                  "name": "area_doc"
                },
                {
                  "name": "area_fact"
                },
                {
                  "name": "photo"
                },
                {
                  "name": "owner"
                },
                {
                  "name": "doc"
                },
                {
                  "name": "timetable"
                },
                {
                  "name": "ownership"
                },
                {
                  "name": "date_reg"
                },
                {
                  "name": "date_end"
                },
                {
                  "name": "note"
                }
              ]
            }
          ],
          "readOnly": false,
          "styleName": "trading_point_simf_2022",
          "tableName": "nto_all_point",
          "properties": [
            {
              "name": "classid",
              "title": "Вид объекта",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Автосервис",
                  "value": "311550000"
                },
                {
                  "title": "Бахчевые культуры",
                  "value": "311430000"
                },
                {
                  "title": "Бытовые услуги",
                  "value": "311530000"
                },
                {
                  "title": "Горячие напитки со спец. аппарата",
                  "value": "311370000"
                },
                {
                  "title": "Живая рыба",
                  "value": "311410000"
                },
                {
                  "title": "Живые цветы",
                  "value": "311440000"
                },
                {
                  "title": "Иные нестационарные объекты",
                  "value": "311510000"
                },
                {
                  "title": "Квас",
                  "value": "311390000"
                },
                {
                  "title": "Квас, мороженое",
                  "value": "311400000"
                },
                {
                  "title": "Колбасные изделия",
                  "value": "311350000"
                },
                {
                  "title": "Кондитерские изделия",
                  "value": "311310000"
                },
                {
                  "title": "Лекарственные средства",
                  "value": "311560000"
                },
                {
                  "title": "Мед и продукция пчеловодства",
                  "value": "311420000"
                },
                {
                  "title": "Молочная продукция",
                  "value": "311470000"
                },
                {
                  "title": "Напитки, мороженое",
                  "value": "311380000"
                },
                {
                  "title": "Непродовольственные товары",
                  "value": "311520000"
                },
                {
                  "title": "Общественное питание",
                  "value": "311490000"
                },
                {
                  "title": "Общественный туалет",
                  "value": "311480000"
                },
                {
                  "title": "Питьевая вода",
                  "value": "311500000"
                },
                {
                  "title": "Продовольственные товары",
                  "value": "311340000"
                },
                {
                  "title": "Сельскохозяйственная продукция",
                  "value": "311320000"
                },
                {
                  "title": "Хвойные насаждения",
                  "value": "311450000"
                },
                {
                  "title": "Хлебобулочные изделия",
                  "value": "311360000"
                },
                {
                  "title": "Хлебобулочные и кондитерские изделия",
                  "value": "311460000"
                }
              ]
            },
            {
              "name": "number",
              "title": "Номер на схеме",
              "required": true,
              "valueType": "INT",
              "description": "Уникальный номер места на карте"
            },
            {
              "name": "location",
              "title": "Местоположение",
              "asTitle": true,
              "required": true,
              "maxLength": 400,
              "valueType": "STRING"
            },
            {
              "name": "nto_type",
              "title": "Тип НТО",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "автолавка",
                  "value": "автолавка"
                },
                {
                  "title": "киоск",
                  "value": "киоск"
                },
                {
                  "title": "открытое кафе",
                  "value": "открытое кафе"
                },
                {
                  "title": "бар",
                  "value": "бар"
                },
                {
                  "title": "павильон",
                  "value": "павильон"
                },
                {
                  "title": "кафе-киоск",
                  "value": "кафе-киоск"
                },
                {
                  "title": "бахчевой развал",
                  "value": "бахчевой развал"
                },
                {
                  "title": "торговый павильон",
                  "value": "торговый павильон"
                },
                {
                  "title": "автомагазин",
                  "value": "автомагазин"
                },
                {
                  "title": "торговый автомат",
                  "value": "торговый автомат"
                },
                {
                  "title": "торговая палатка",
                  "value": "торговая палатка"
                },
                {
                  "title": "торговая галерея",
                  "value": "торговая галерея"
                },
                {
                  "title": "елочный базар",
                  "value": "елочный базар"
                },
                {
                  "title": "палатка",
                  "value": "палатка"
                },
                {
                  "title": "киоск - малый модуль",
                  "value": "киоск - малый модуль"
                },
                {
                  "title": "лоток",
                  "value": "лоток"
                },
                {
                  "title": "автокафе",
                  "value": "автокафе"
                },
                {
                  "title": "презентационная стойка",
                  "value": "презентационная стойка"
                }
              ]
            },
            {
              "name": "specialty",
              "title": "Специализация",
              "valueType": "STRING",
              "description": "Описание специализации торгового объекта"
            },
            {
              "name": "status",
              "title": "Статус",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Функционирующий",
                  "value": "Функционирующий"
                },
                {
                  "title": "Не сезон",
                  "value": "Не сезон"
                },
                {
                  "title": "Свободный",
                  "value": "Свободный"
                },
                {
                  "title": "Планируемый",
                  "value": "Планируемый"
                },
                {
                  "title": "Незаконный",
                  "value": "Незаконный"
                }
              ]
            },
            {
              "name": "season",
              "title": "Период функционирования НТО",
              "valueType": "STRING",
              "description": "Период функционирования НТО"
            },
            {
              "name": "area_doc",
              "title": "Площадь, м.кв.",
              "valueType": "DOUBLE",
              "description": "Площадь по документам",
              "fractionDigits": 6
            },
            {
              "name": "photo",
              "title": "Фото",
              "maxSize": 50000000,
              "multiple": true,
              "valueType": "FILE",
              "description": "Фотоматериалы существующего НТО"
            },
            {
              "name": "owner",
              "title": "Арендатор",
              "multiple": true,
              "libraries": [
                "dl_data_renter_nto"
              ],
              "valueType": "DOCUMENT",
              "maxDocuments": 10
            },
            {
              "name": "doc",
              "title": "Документы",
              "multiple": true,
              "libraries": [
                "dl_data_doc_nto"
              ],
              "valueType": "DOCUMENT",
              "maxDocuments": 10
            },
            {
              "name": "timetable",
              "title": "График работы",
              "valueType": "STRING"
            },
            {
              "name": "ownership",
              "title": "Тип собственности",
              "readOnly": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Государственная",
                  "value": "Государственная"
                },
                {
                  "title": "Частная",
                  "value": "Частная"
                },
                {
                  "title": "Муниципальная",
                  "value": "Муниципальная"
                }
              ]
            },
            {
              "name": "date_reg",
              "title": "Дата начала",
              "required": true,
              "valueType": "DATETIME",
              "description": "Дата начала действия договора"
            },
            {
              "name": "date_end",
              "title": "Дата прекращения",
              "required": true,
              "valueType": "DATETIME",
              "description": "Дата окончания договора"
            },
            {
              "name": "note",
              "title": "Примечание",
              "valueType": "STRING"
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "maxLength": 254,
              "valueType": "STRING"
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "hidden": true,
              "required": false,
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "hidden": true,
              "readOnly": true,
              "required": false,
              "valueType": "DATETIME",
              "description": "Дата последней модификации документа"
            },
            {
              "name": "updated_by",
              "title": "Кто обновил",
              "hidden": true,
              "readOnly": true,
              "required": false,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "hidden": true,
              "required": false,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "hidden": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Point"
              ]
            }
          ],
          "description": "Дежурная карта НТО",
          "geometryType": "Point"
        }'
WHERE name = 'nto_all_point';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "НТО"
          ],
          "name": "nto_zone",
          "title": "Зоны проведения мероприятий",
          "readOnly": false,
          "styleName": "fair_zone",
          "tableName": "nto_zone",
          "originName": "nto_zone",
          "properties": [
            {
              "name": "classid",
              "title": "Вид объекта",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Ярмарки",
                  "value": "Ярмарки"
                },
                {
                  "title": "Выставки",
                  "value": "Выставки"
                },
                {
                  "title": "Конкурсы",
                  "value": "Конкурсы"
                },
                {
                  "title": "Форумы",
                  "value": "Форумы"
                },
                {
                  "title": "Аттракционы",
                  "value": "Аттракционы"
                }
              ]
            },
            {
              "name": "number",
              "title": "Номер на схеме",
              "required": true,
              "valueType": "INT",
              "description": "Уникальный номер места на карте"
            },
            {
              "name": "location",
              "title": "Местоположение",
              "display": "multiline",
              "required": true,
              "maxLength": 400,
              "valueType": "STRING",
              "description": "Адресное описание"
            },
            {
              "name": "name",
              "title": "Наименование",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "description": "Наименование мероприятия"
            },
            {
              "name": "schedule",
              "title": "План-график",
              "valueType": "STRING",
              "description": "План-график проведения мероприятий"
            },
            {
              "name": "files",
              "title": "Требования и документы",
              "maxSize": 50000000,
              "multiple": true,
              "valueType": "FILE",
              "description": "Требования к оформлению НТО "
            },
            {
              "name": "amount",
              "title": "Предусмотренное кол-во",
              "valueType": "INT",
              "description": "Предусмотренное кол-во торговых мест"
            },
            {
              "name": "area_fact",
              "title": "Расчётная площадь, кв. м.",
              "readOnly": true,
              "valueType": "DOUBLE",
              "description": "Площадь, вычисленная по координатам",
              "totalDigits": 38,
              "fractionDigits": 2,
              "calculatedValueWellKnownFormula": "st_area"
            },
            {
              "name": "note",
              "title": "Примечания",
              "display": "multiline",
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "hidden": true,
              "readOnly": true,
              "valueType": "DATETIME"
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "hidden": true,
              "readOnly": true,
              "valueType": "STRING"
            },
            {
              "name": "last_modified",
              "title": "Дата последней модификации",
              "hidden": true,
              "readOnly": true,
              "valueType": "DATETIME"
            },
            {
              "name": "updated_by",
              "title": "Кто обновил",
              "hidden": true,
              "readOnly": true,
              "valueType": "STRING"
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "valueType": "INT"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Polygon"
              ]
            }
          ],
          "description": "Зоны требований к нестационарные торговые объекты",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'nto_zone';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "НТО"
          ],
          "name": "zone_requirement_nto",
          "title": "Зоны требований к НТО",
          "readOnly": false,
          "styleName": "zone_requirement_nto",
          "tableName": "zone_requirement_nto",
          "properties": [
            {
              "name": "classid",
              "title": "Вид объекта",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Зона НТО",
                  "value": "Зона НТО"
                },
                {
                  "title": "Граница населенного пункта",
                  "value": "Граница населенного пункта"
                }
              ]
            },
            {
              "name": "name",
              "title": "Наименование",
              "asTitle": true,
              "display": "multiline",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "description": "Наименование зоны"
            },
            {
              "name": "note",
              "title": "Описание зоны",
              "display": "multiline",
              "maxLength": 500,
              "valueType": "STRING"
            },
            {
              "name": "area",
              "title": "Расчётная площадь, кв. м.",
              "readOnly": true,
              "valueType": "DOUBLE",
              "description": "Площадь, вычисленная по координатам",
              "totalDigits": 38,
              "fractionDigits": 2,
              "calculatedValueWellKnownFormula": "st_area"
            },
            {
              "name": "photo",
              "title": "Фото",
              "maxSize": 50000000,
              "maxFiles": 15,
              "multiple": true,
              "valueType": "FILE",
              "description": "Фотоматериалы"
            },
            {
              "name": "projects",
              "title": "Типовые проекты НТО",
              "maxSize": 50000000,
              "maxFiles": 15,
              "multiple": true,
              "required": true,
              "valueType": "FILE"
            },
            {
              "name": "files",
              "title": "Требования",
              "maxSize": 50000000,
              "maxFiles": 15,
              "multiple": true,
              "valueType": "FILE",
              "description": "Требования к оформлению НТО"
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "maxLength": 254,
              "valueType": "STRING"
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "hidden": true,
              "required": false,
              "valueType": "DATETIME"
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "hidden": true,
              "readOnly": true,
              "required": false,
              "valueType": "DATETIME",
              "description": "Дата последней модификации документа"
            },
            {
              "name": "updated_by",
              "title": "Кто обновил",
              "hidden": true,
              "readOnly": true,
              "required": false,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "hidden": true,
              "required": false,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "hidden": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Polygon"
              ]
            }
          ],
          "description": "Зоны требований к нестационарным торговым объектам",
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'zone_requirement_nto'; 
