INSERT INTO data.schemas (name, class_rule)
SELECT 'pipeline_topo_500',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'pipeline_topo_500');

INSERT INTO data.schemas (name, class_rule)
SELECT 'electricline_topo_500',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'electricline_topo_500');

INSERT INTO data.schemas (name, class_rule)
SELECT 'gaspipeline_topo_500',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'gaspipeline_topo_500');

INSERT INTO data.schemas (name, class_rule)
SELECT 'sewerpipeline_topo_500',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'sewerpipeline_topo_500');

INSERT INTO data.schemas (name, class_rule)
SELECT 'telecomline_topo_500',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'telecomline_topo_500');

INSERT INTO data.schemas (name, class_rule)
SELECT 'thermalpipeline_topo_500',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'thermalpipeline_topo_500');

INSERT INTO data.schemas (name, class_rule)
SELECT 'building_topo_500',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'building_topo_500');


UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "pipeline_topo_500",
          "tags": [
            "system",
            "Топография 500 Инженерные сети"
          ],
          "name": "pipeline_topo_500",
          "title": "Трубопроводы специального назначения",
          "tableName": "pipeline_topo_500",
          "originName": "pipeline_topo_500",
          "properties": [
            {
              "name": "classid",
              "title": "Код объекта",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Воздухопровод",
                  "value": "1"
                },
                {
                  "title": "Нефтепровод",
                  "value": "2"
                },
                {
                  "title": "Технический трубопровод",
                  "value": "3"
                }
              ],
              "foreignKeyType": "INTEGER",
              "asTitle": true
            },
            {
              "name": "pline_type",
              "title": "Вид расположения трубопровода",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Наземный",
                  "value": "1"
                },
                {
                  "title": "Подземный",
                  "value": "2"
                }
              ],
              "foreignKeyType": "INTEGER",
              "asTitle": true
            },
            {
              "name": "pline_cnt",
              "title": "Количество труб",
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "d_pline",
              "title": "Диаметр трубопровода, мм",
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "status",
              "title": "Статус объекта",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Действующий",
                  "value": "1"
                },
                {
                  "title": "Не действующий",
                  "value": "2"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "length",
              "title": "Протяженность, м.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 0
            },
            {
              "name": "note",
              "title": "Примечание",
              "valueType": "TEXT"
            },
            {
              "name": "balance_holder",
              "title": "Принадлежность сети",
              "valueType": "STRING"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "hidden": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "LineString"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "valueType": "INT"
            }
          ],
          "geometryType": "MultiLineString"
        }'
WHERE name = 'pipeline_topo_500';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Топография 500 Инженерные сети"
          ],
          "name": "electricline_topo_500",
          "title": "Линии электропередачи",
          "styleName": "electricline_topo_500",
          "tableName": "electricline_topo_500",
          "originName": "electricline_topo_500",
          "properties": [
            {
              "name": "classid",
              "title": "Код объекта",
              "asTitle": true,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Линии электропередачи (ЛЭП) высокого напряжения",
                  "value": "1"
                },
                {
                  "title": "Линии электропередачи (ЛЭП) низкого напряжения",
                  "value": "2"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "line_type",
              "title": "Вид расположения",
              "asTitle": true,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Воздушный",
                  "value": "1"
                },
                {
                  "title": "Подземный",
                  "value": "2"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "voltage",
              "title": "Напряжение",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "line_cnt",
              "title": "Количество кабелей/проводов",
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "status",
              "title": "Статус объекта",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Действующий",
                  "value": "1"
                },
                {
                  "title": "Не действующий",
                  "value": "2"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "length",
              "title": "Протяженность, м.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 0
            },
            {
              "name": "note",
              "title": "Примечание",
              "hidden": true,
              "valueType": "TEXT"
            },
            {
              "name": "balance_holder",
              "title": "Принадлежность сети",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "ООО «Севастопольэнерго»",
                  "value": "1"
                },
                {
                  "title": "ГБУ «Горсвет» ",
                  "value": "2"
                },
                {
                  "title": "ФГУП «102 Предприятие электрических сетей Минобороны РФ»",
                  "value": "3"
                },
                {
                  "title": "АО «Балаклавское рудоуправление»",
                  "value": "4"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "hidden": true,
              "readOnly": true,
              "valueType": "DATETIME",
              "description": "Дата последней модификации документа"
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
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "updated_by",
              "title": "Кто обновил",
              "hidden": true,
              "readOnly": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "hidden": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "LineString"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "valueType": "INT"
            }
          ],
          "geometryType": "MultiLineString"
        }'
WHERE name = 'electricline_topo_500';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Топография 500 Инженерные сети"
          ],
          "name": "gaspipeline_topo_500",
          "title": "Сети газоснабжения",
          "styleName": "gaspipeline_topo_500",
          "tableName": "gaspipeline_topo_500",
          "originName": "gaspipeline_topo_500",
          "properties": [
            {
              "name": "classid",
              "title": "Код объекта",
              "asTitle": true,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Газопровод",
                  "value": "1"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "pline_type",
              "title": "Вид расположения трубопровода",
              "asTitle": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Наземный",
                  "value": "1"
                },
                {
                  "title": "Подземный",
                  "value": "2"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "type_distr",
              "title": "Тип распределительных газопроводов по давлению ",
              "asTitle": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Высокое",
                  "value": "1"
                },
                {
                  "title": "Среднее",
                  "value": "2"
                },
                {
                  "title": "Низкое",
                  "value": "3"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "pline_cnt",
              "title": "Количество труб",
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "d_pline",
              "title": "Диаметр трубопровода, мм",
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "status",
              "title": "Статус объекта",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Действующий",
                  "value": "1"
                },
                {
                  "title": "Не действующий",
                  "value": "2"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "length",
              "title": "Протяженность, м.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 0
            },
            {
              "name": "note",
              "title": "Примечание",
              "valueType": "TEXT"
            },
            {
              "name": "balance_holder",
              "title": "Принадлежность сети",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "ПАО «Севастопольгаз»",
                  "value": "1"
                },
                {
                  "title": "ГУП «Севастопольгаз»",
                  "value": "2"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "hidden": true,
              "readOnly": true,
              "valueType": "DATETIME",
              "description": "Дата последней модификации документа"
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
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "updated_by",
              "title": "Кто обновил",
              "hidden": true,
              "readOnly": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "hidden": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "LineString"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "valueType": "INT"
            }
          ],
          "geometryType": "MultiLineString"
        }'
WHERE name = 'gaspipeline_topo_500';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Топография 500 Инженерные сети"
          ],
          "name": "sewerpipeline_topo_500",
          "title": "Сети водоотведения",
          "styleName": "sewerpipeline_topo_500",
          "tableName": "sewerpipeline_topo_500",
          "originName": "sewerpipeline_topo_500",
          "properties": [
            {
              "name": "classid",
              "title": "Код объекта",
              "asTitle": true,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Канализация (без подразделений)",
                  "value": "1"
                },
                {
                  "title": "Канализация бытовая",
                  "value": "2"
                },
                {
                  "title": "Канализация дренажная",
                  "value": "3"
                },
                {
                  "title": "Канализация ливневая",
                  "value": "4"
                },
                {
                  "title": "Канализация напорная",
                  "value": "5"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "pline_type",
              "title": "Вид расположения трубопровода",
              "asTitle": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Наземная",
                  "value": "1"
                },
                {
                  "title": "Подземная",
                  "value": "2"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "pline_cnt",
              "title": "Количество труб",
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "d_pline",
              "title": "Диаметр трубопровода, мм",
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "status",
              "title": "Статус объекта",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Действующий",
                  "value": "1"
                },
                {
                  "title": "Не действующий",
                  "value": "2"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "length",
              "title": "Протяженность, м",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 0
            },
            {
              "name": "note",
              "title": "Примечание",
              "valueType": "TEXT"
            },
            {
              "name": "balance_holder",
              "title": "Принадлежность сети",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "ГУПС «Водоканал»",
                  "value": "1"
                },
                {
                  "title": "Сети пребывающие в индивидуальной собственности абонентов водоотведения",
                  "value": "2"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "sew_type",
              "title": "Тип сети водоотведения",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Самотечная",
                  "value": "1"
                },
                {
                  "title": "Напорная",
                  "value": "2"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "hidden": true,
              "readOnly": true,
              "valueType": "DATETIME",
              "description": "Дата последней модификации документа"
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
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "updated_by",
              "title": "Кто обновил",
              "hidden": true,
              "readOnly": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "hidden": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "LineString"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "valueType": "INT"
            }
          ],
          "geometryType": "MultiLineString"
        }'
WHERE name = 'sewerpipeline_topo_500';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Топография 500 Инженерные сети"
          ],
          "name": "telecomline_topo_500",
          "title": "Линии связи",
          "styleName": "telecomline_topo_500",
          "tableName": "telecomline_topo_500",
          "originName": "telecomline_topo_500",
          "properties": [
            {
              "name": "classid",
              "title": "Код объекта",
              "asTitle": true,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Линии связи и технических средств управления",
                  "value": "1"
                },
                {
                  "title": "Телефонная канализация",
                  "value": "2"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "line_type",
              "title": "Вид расположения трубопровода",
              "asTitle": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Наземный",
                  "value": "1"
                },
                {
                  "title": "Подземный",
                  "value": "2"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "line_cnt",
              "title": "Количество кабелей",
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "status",
              "title": "Статус объекта",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Действующий",
                  "value": "1"
                },
                {
                  "title": "Не действующий",
                  "value": "2"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "length",
              "title": "Протяженность, м.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 0
            },
            {
              "name": "note",
              "title": "Примечание",
              "valueType": "TEXT"
            },
            {
              "name": "balabce_holder",
              "title": "Принадлежность сети",
              "asTitle": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "АО «Севастополь телеком»",
                  "value": "1"
                },
                {
                  "title": "ООО «Миранда-медиа»",
                  "value": "2"
                },
                {
                  "title": "Воинская часть 40136 ",
                  "value": "3"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "hidden": true,
              "readOnly": true,
              "valueType": "DATETIME",
              "description": "Дата последней модификации документа"
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
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "updated_by",
              "title": "Кто обновил",
              "hidden": true,
              "readOnly": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "hidden": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "LineString"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "valueType": "INT"
            }
          ],
          "geometryType": "MultiLineString"
        }'
WHERE name = 'telecomline_topo_500';

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Топография 500 Инженерные сети"
          ],
          "name": "thermalpipeline_topo_500",
          "title": "Сети теплоснабжения",
          "styleName": "thermalpipeline_topo_500",
          "tableName": "thermalpipeline_topo_500",
          "originName": "thermalpipeline_topo_500",
          "properties": [
            {
              "name": "classid",
              "title": "Код объекта",
              "asTitle": true,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Теплосеть",
                  "value": "1"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "pline_type",
              "title": "Вид расположения трубопровода",
              "asTitle": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Наземный",
                  "value": "1"
                },
                {
                  "title": "Подземный",
                  "value": "2"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "pline_cnt",
              "title": "Количество труб",
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "d_pline",
              "title": "Диаметр трубопровода, мм",
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "status",
              "title": "Статус объекта",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Действующий",
                  "value": "1"
                },
                {
                  "title": "Не действующий",
                  "value": "2"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "length",
              "title": "Протяженность сооружения, м",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 0
            },
            {
              "name": "note",
              "title": "Примечание",
              "valueType": "TEXT"
            },
            {
              "name": "balabce_holder",
              "title": "Принадлежность сети",
              "asTitle": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "ГУПС «Севтеплоэнерго»",
                  "value": "1"
                },
                {
                  "title": "Сети пребывающие в индивидуальной собственности абонентов теплоснабжения ",
                  "value": "2"
                }
              ],
              "foreignKeyType": "INTEGER"
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "hidden": true,
              "readOnly": true,
              "valueType": "DATETIME",
              "description": "Дата последней модификации документа"
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
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "updated_by",
              "title": "Кто обновил",
              "hidden": true,
              "readOnly": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "hidden": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "LineString"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "hidden": true,
              "valueType": "INT"
            }
          ],
          "geometryType": "MultiLineString"
        }'
WHERE name = 'thermalpipeline_topo_500';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "building_topo_500",
          "tags": [
            "system",
            "Топография 500 Инженерные сети"
          ],
          "name": "building_topo_500",
          "title": "Здания и сооружения",
          "tableName": "building_topo_500",
          "originName": "building_topo_500",
          "properties": [
            {
              "name": "classid",
              "title": "Код объекта",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Здание",
                  "value": "1"
                },
                {
                  "title": "Сооружение",
                  "value": "2"
                },
                {
                  "title": "Объект незавершенного строительства",
                  "value": "3"
                }
              ],
              "asTitle": true
            },
            {
              "name": "type_z",
              "title": "Вид здания (назначение)",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "жилое здание",
                  "value": "1"
                },
                {
                  "title": "нежилое здание",
                  "value": "2"
                }
              ]
            },
            {
              "name": "type_s",
              "title": "Вид сооружения (назначение)",
              "valueType": "STRING"
            },
            {
              "name": "index",
              "title": "Индекс",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Д",
                  "value": "1"
                },
                {
                  "title": "ДН",
                  "value": "2"
                },
                {
                  "title": "К",
                  "value": "3"
                },
                {
                  "title": "КЖ",
                  "value": "4"
                },
                {
                  "title": "КН",
                  "value": "5"
                },
                {
                  "title": "М",
                  "value": "6"
                },
                {
                  "title": "МБ",
                  "value": "7"
                },
                {
                  "title": "МН",
                  "value": "8"
                },
                {
                  "title": "Н",
                  "value": "9"
                },
                {
                  "title": "СМ",
                  "value": "10"
                },
                {
                  "title": "Т",
                  "value": "11"
                },
                {
                  "title": "Ц",
                  "value": "12"
                }
              ]
            },
            {
              "name": "built_area",
              "title": "Площадь застройки, кв. м.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "area",
              "title": "Общая площадь, кв. м.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "floor",
              "title": "Этажность",
              "maxLength": 2,
              "valueType": "STRING"
            },
            {
              "name": "note",
              "title": "Примечание",
              "valueType": "TEXT"
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
            }
          ],
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'building_topo_500';
