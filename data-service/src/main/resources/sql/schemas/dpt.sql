INSERT INTO data.schemas (name, class_rule)
SELECT 'public_territory_borders_dpt',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'public_territory_borders_dpt');

INSERT INTO data.schemas (name, class_rule)
SELECT 'red_line_dpt',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'red_line_dpt');

INSERT INTO data.schemas (name, class_rule)
SELECT 'red_line_line_dpt',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'red_line_line_dpt');

INSERT INTO data.schemas (name, class_rule)
SELECT 'site_planning_dpt',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'site_planning_dpt');

INSERT INTO data.schemas (name, class_rule)
SELECT 'construction_zones_borders_dpt',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'construction_zones_borders_dpt');

INSERT INTO data.schemas (name, class_rule)
SELECT 'element_planning_structure_dpt',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'element_planning_structure_dpt');

INSERT INTO data.schemas (name, class_rule)
SELECT 'formed_land_dpt',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'formed_land_dpt');

INSERT INTO data.schemas (name, class_rule)
SELECT 'indent_line_dpt',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'indent_line_dpt');

UPDATE data.schemas
SET class_rule =
        '{
          "name": "public_territory_borders_dpt",
          "title": "Границы территории общего пользования",
          "tags": [
            "system",
            "ДПТ"
          ],
          "tableName": "public_territory_borders_dpt",
          "properties": [
            {
              "name": "class",
              "title": "Код объекта",
              "valueType": "CHOICE",
              "required": true,
              "asTitle": true,
              "foreignKeyType": "STRING",
              "enumerations": [
                {
                  "value": "7С.1",
                  "title": "Индивидуальной жилой застройки"
                },
                {
                  "value": "7С.2",
                  "title": "Многоквартирной жилой застройки"
                },
                {
                  "value": "7С.3",
                  "title": "Учебного-образовательного назначения"
                },
                {
                  "value": "7С.4",
                  "title": "Территории общественно-делового назначения"
                },
                {
                  "value": "7С.5",
                  "title": "Детские игровые и спортивные площадки"
                },
                {
                  "value": "7С.6",
                  "title": "Производственного, коммунально-складского, инженерного и транспортного назначения"
                },
                {
                  "value": "7С.7",
                  "title": "Тротуары, дорожки, площади"
                },
                {
                  "value": "7С.8",
                  "title": "Дачных, садовых и огороднических товариществ"
                },
                {
                  "value": "7С.9",
                  "title": "Озелененные территории общего пользования"
                },
                {
                  "value": "7С.10",
                  "title": "Защитного озеленения"
                },
                {
                  "value": "7С.11",
                  "title": "Территории, не покрытые лесом и кустарниками"
                },
                {
                  "value": "7С.12",
                  "title": "Территории, покрытые лесом и кустарниками"
                },
                {
                  "value": "7С.13",
                  "title": "Зона поверхностных водных объектов"
                },
                {
                  "value": "7С.14",
                  "title": "Ритуального назначения"
                },
                {
                  "value": "7С.15",
                  "title": "Добычи полезных ископаемых"
                },
                {
                  "value": "7С.16",
                  "title": "Объектов сельскохозяйственного назначения"
                },
                {
                  "value": "7С.17",
                  "title": "Сельскохозяйственного использования"
                },
                {
                  "value": "7С.18",
                  "title": "Рекреационного назначения"
                },
                {
                  "value": "7С.19",
                  "title": "Складирования и захоронения отходов"
                }
              ]
            },
            {
              "name": "status",
              "title": "Статус объекта",
              "valueType": "CHOICE",
              "foreignKeyType": "STRING",
              "enumerations": [
                {
                  "value": "7В.1",
                  "title": "Существующий"
                },
                {
                  "value": "7В.2",
                  "title": "Планируемый"
                }
              ]
            },
            {
              "name": "area",
              "title": "Площадь общая, кв. м.",
              "valueType": "DOUBLE",
              "fractionDigits": 2
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "maxLength": 50,
              "description": "Пользователь создавший объект (Заполняется автоматически)",
              "valueType": "STRING",
              "readOnly": true
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "description": "Дата создания объекта (Заполняется автоматически)",
              "valueType": "DATETIME",
              "readOnly": true
            },
            {
              "name": "last_modified",
              "title": "Дата модификации",
              "valueType": "DATETIME",
              "description": "Дата последней модификации документа",
              "readOnly": true
            },
            {
              "name": "updated_by",
              "title": "Редактор",
              "valueType": "STRING",
              "description": "Пользователь редактировавший объект последним (Заполняется автоматически)",
              "maxLength": 50,
              "readOnly": true
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "hidden": true,
              "allowedValues": [
                "Polygon"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "valueType": "INT",
              "hidden": true
            }
          ],
          "description": "Границы территории общего пользования",
          "originName": "public_territory_borders_dpt",
          "styleName": "public_territory_borders_dpt",
          "readOnly": false,
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'public_territory_borders_dpt';

UPDATE data.schemas
SET class_rule =
        '{
          "name": "red_line_dpt",
          "title": "Красные линии",
          "tags": [
            "system",
            "ДПТ"
          ],
          "tableName": "red_line_dpt",
          "properties": [
            {
              "name": "number",
              "title": "Планировочный номер",
              "valueType": "STRING",
              "asTitle": true,
              "maxLength": 50
            },
            {
              "name": "status",
              "title": "Статус красных линий",
              "valueType": "CHOICE",
              "required": true,
              "foreignKeyType": "STRING",
              "enumerations": [
                {
                  "value": "7Е.1",
                  "title": "Существующий"
                },
                {
                  "value": "7Е.2",
                  "title": "Планируемый"
                },
                {
                  "value": "7Е.3",
                  "title": "Отменяемый"
                }
              ]
            },
            {
              "name": "note",
              "title": "Примечание",
              "valueType": "STRING",
              "maxLength": 256
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "maxLength": 50,
              "description": "Пользователь создавший объект (Заполняется автоматически)",
              "valueType": "STRING",
              "readOnly": true
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "description": "Дата создания объекта (Заполняется автоматически)",
              "valueType": "DATETIME",
              "readOnly": true
            },
            {
              "name": "last_modified",
              "title": "Дата редактирования",
              "valueType": "DATETIME",
              "description": "Дата последнего редактирования объекта (Заполняется автоматически)",
              "readOnly": true
            },
            {
              "name": "updated_by",
              "title": "Редактор",
              "valueType": "STRING",
              "description": "Пользователь редактировавший объект последним (Заполняется автоматически)",
              "readOnly": true,
              "maxLength": 50
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "hidden": true,
              "allowedValues": [
                "Polygon"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "valueType": "INT",
              "hidden": true
            }
          ],
          "description": "Красные линии",
          "originName": "red_line_dpt",
          "styleName": "red_line_dpt",
          "readOnly": false,
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'red_line_dpt';

UPDATE data.schemas
SET class_rule =
        '{
          "name": "red_line_line_dpt",
          "title": "Красные линии",
          "tags": [
            "system",
            "ДПТ"
          ],
          "tableName": "red_line_line_dpt",
          "properties": [
            {
              "name": "number",
              "title": "Планировочный номер",
              "valueType": "STRING",
              "asTitle": true,
              "maxLength": 256
            },
            {
              "name": "status",
              "title": "Статус красных линий",
              "valueType": "CHOICE",
              "required": true,
              "foreignKeyType": "STRING",
              "enumerations": [
                {
                  "value": "7Е.1",
                  "title": "Существующий"
                },
                {
                  "value": "7Е.2",
                  "title": "Планируемый"
                },
                {
                  "value": "7Е.3",
                  "title": "Отменяемый"
                }
              ]
            },
            {
              "name": "length",
              "title": "Протяженность, м.",
              "valueType": "DOUBLE",
              "fractionDigits": 2
            },
            {
              "name": "note",
              "title": "Примечание",
              "valueType": "STRING",
              "maxLength": 256
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "maxLength": 50,
              "description": "Пользователь создавший объект (Заполняется автоматически)",
              "valueType": "STRING",
              "readOnly": true
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "description": "Дата создания объекта (Заполняется автоматически)",
              "valueType": "DATETIME",
              "readOnly": true
            },
            {
              "name": "last_modified",
              "title": "Дата редактирования",
              "valueType": "DATETIME",
              "description": "Дата последнего редактирования объекта (Заполняется автоматически)",
              "readOnly": true
            },
            {
              "name": "updated_by",
              "title": "Редактор",
              "valueType": "STRING",
              "description": "Пользователь редактировавший объект последним (Заполняется автоматически)",
              "readOnly": true,
              "maxLength": 50
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "hidden": true,
              "allowedValues": [
                "LineString"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "valueType": "INT",
              "hidden": true
            }
          ],
          "description": "Красные линии",
          "originName": "red_line_line_dpt",
          "styleName": "red_line_line_dpt",
          "readOnly": false,
          "geometryType": "MultiLineString"
        }'
WHERE name = 'red_line_line_dpt';

UPDATE data.schemas
SET class_rule =
        '{
          "name": "site_planning_dpt",
          "title": "Планировка территории",
          "tags": [
            "system",
            "ДПТ"
          ],
          "tableName": "site_planning_dpt",
          "properties": [
            {
              "name": "name",
              "title": "Наименование",
              "valueType": "STRING"
            },
            {
              "name": "doctype",
              "title": "Вид документа",
              "valueType": "CHOICE",
              "asTitle": true,
              "foreignKeyType": "STRING",
              "enumerations": [
                {
                  "value": "01",
                  "title": "Проект межевания территории"
                },
                {
                  "value": "02",
                  "title": "Проект планировки территории"
                },
                {
                  "value": "03",
                  "title": "ПМТ и ППТ"
                }
              ]
            },
            {
              "name": "area",
              "title": "Площадь, кв. м.",
              "valueType": "DOUBLE",
              "fractionDigits": 2
            },
            {
              "name": "note",
              "title": "Примечание",
              "valueType": "STRING",
              "display": "multiline",
              "maxLength": 500
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "maxLength": 50,
              "description": "Пользователь создавший объект (Заполняется автоматически)",
              "valueType": "STRING",
              "readOnly": true
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "description": "Дата создания объекта (Заполняется автоматически)",
              "valueType": "DATETIME",
              "readOnly": true
            },
            {
              "name": "last_modified",
              "title": "Дата редактирования",
              "valueType": "DATETIME",
              "description": "Дата последнего редактирования объекта (Заполняется автоматически)",
              "readOnly": true
            },
            {
              "name": "updated_by",
              "title": "Редактор",
              "valueType": "STRING",
              "description": "Пользователь редактировавший объект последним (Заполняется автоматически)",
              "readOnly": true,
              "maxLength": 50
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "hidden": true,
              "allowedValues": [
                "Polygon"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "valueType": "INT",
              "hidden": true
            }
          ],
          "description": "Планировка территории",
          "originName": "site_planning_dpt",
          "styleName": "site_planning_dpt",
          "readOnly": false,
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'site_planning_dpt';

UPDATE data.schemas
SET class_rule =
        '{
          "name": "construction_zones_borders_dpt",
          "title": "Границы зон планируемого размещения объектов капитального строительства, линейных объектов",
          "tags": [
            "system",
            "ДПТ"
          ],
          "tableName": "construction_zones_borders_dpt",
          "properties": [
            {
              "name": "name",
              "title": "Вид зоны",
              "valueType": "CHOICE",
              "required": true,
              "asTitle": true,
              "description": "Вид зоны планируемого размещения объектов капитального строительства, линейных объектов",
              "foreignKeyType": "STRING",
              "enumerations": [
                {
                  "value": "7I.4",
                  "title": "Индивидуальной жилой застройки"
                },
                {
                  "value": "7I.3",
                  "title": "Малоэтажной жилой застройки"
                },
                {
                  "value": "7I.2",
                  "title": "Среднеэтажной жилой застройки"
                },
                {
                  "value": "7I.1",
                  "title": "Многоэтажной жилой застройки"
                },
                {
                  "value": "7I.17",
                  "title": "Зона исторической застройки"
                },
                {
                  "value": "7I.8",
                  "title": "Административно-делового назначения"
                },
                {
                  "value": "7I.6",
                  "title": "Общественно-делового назначения"
                },
                {
                  "value": "7I.10",
                  "title": "Торговли и общественного питания"
                },
                {
                  "value": "7I.9",
                  "title": "Социального и коммунально-бытового обслуживания"
                },
                {
                  "value": "7I.11",
                  "title": "Учебно-образовательного назначения"
                },
                {
                  "value": "7I.12",
                  "title": "Культурно-досугового назначения"
                },
                {
                  "value": "7I.14",
                  "title": "Социального обеспечения"
                },
                {
                  "value": "7I.13",
                  "title": "Здравоохранения"
                },
                {
                  "value": "7I.15",
                  "title": "Научно-исследовательского назначения"
                },
                {
                  "value": "7I.16",
                  "title": "Культового назначения"
                },
                {
                  "value": "7I.18",
                  "title": "Производственного и коммунально-складского назначения"
                },
                {
                  "value": "7I.19",
                  "title": "Производственного назначения"
                },
                {
                  "value": "7I.20",
                  "title": "Коммунально-складского назначения"
                },
                {
                  "value": "7I.21",
                  "title": "Инженерной инфраструктуры"
                },
                {
                  "value": "7I.22",
                  "title": "Транспортной инфраструктуры"
                },
                {
                  "value": "7I.23",
                  "title": "Железнодорожного транспорта"
                },
                {
                  "value": "7I.24",
                  "title": "Автомобильного транспорта"
                },
                {
                  "value": "7I.25",
                  "title": "Воздушного транспорта"
                },
                {
                  "value": "7I.26",
                  "title": "Речного (морского) транспорта"
                },
                {
                  "value": "7I.28",
                  "title": "Рекреационного назначения"
                },
                {
                  "value": "7I.30",
                  "title": "Санаторно-курортного лечения"
                },
                {
                  "value": "7I.31",
                  "title": "Спортивного назначения"
                },
                {
                  "value": "7I.29",
                  "title": "Отдыха и туризма"
                },
                {
                  "value": "7I.33",
                  "title": "Сельскохозяйственного назначения"
                },
                {
                  "value": "7I.34",
                  "title": "Ведения дачного хозяйства, садоводства, огородничества"
                },
                {
                  "value": "7I.35",
                  "title": "Ритуального назначения"
                },
                {
                  "value": "7I.36",
                  "title": "Складирования и захоронения отходов"
                },
                {
                  "value": "7I.37",
                  "title": "Обороны и безопасности"
                },
                {
                  "value": "7I.38",
                  "title": "Режимных территорий"
                }
              ]
            },
            {
              "name": "area",
              "title": "Площадь, кв.м",
              "valueType": "DOUBLE",
              "fractionDigits": 2
            },
            {
              "name": "built_up_area",
              "title": "Площадь застройки, кв.м",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "residents_num",
              "title": "Численность проживающих, чел.",
              "valueType": "INT",
              "description": "Проектируемая численность проживающих, чел."
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "maxLength": 50,
              "description": "Пользователь создавший объект (Заполняется автоматически)",
              "valueType": "STRING",
              "readOnly": true
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "description": "Дата создания объекта (Заполняется автоматически)",
              "valueType": "DATETIME",
              "readOnly": true
            },
            {
              "name": "last_modified",
              "title": "Дата редактирования",
              "valueType": "DATETIME",
              "description": "Дата последнего редактирования объекта (Заполняется автоматически)",
              "readOnly": true
            },
            {
              "name": "updated_by",
              "title": "Редактор",
              "valueType": "STRING",
              "description": "Пользователь редактировавший объект последним (Заполняется автоматически)",
              "readOnly": true,
              "maxLength": 50
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "hidden": true,
              "allowedValues": [
                "Polygon"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "valueType": "INT",
              "hidden": true
            }
          ],
          "description": "Границы зон планируемого размещения объектов капитального строительства, линейных объектов",
          "originName": "construction_zones_borders_dpt",
          "styleName": "construction_zones_borders_dpt",
          "readOnly": false,
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'construction_zones_borders_dpt';

UPDATE data.schemas
SET class_rule =
        '{
          "name": "element_planning_structure_dpt",
          "title": "Вид элемента планировочной структуры",
          "tags": [
            "system",
            "ДПТ"
          ],
          "tableName": "element_planning_structure_dpt",
          "properties": [
            {
              "name": "class",
              "title": "Вид элемента планировочной структуры",
              "valueType": "CHOICE",
              "required": true,
              "asTitle": true,
              "foreignKeyType": "STRING",
              "enumerations": [
                {
                  "value": "7А.1",
                  "title": "Район"
                },
                {
                  "value": "7А.2",
                  "title": "Микрорайон"
                },
                {
                  "value": "7А.3",
                  "title": "Квартал"
                },
                {
                  "value": "7А.4",
                  "title": "Территория общего пользования"
                },
                {
                  "value": "7А.5",
                  "title": "Территория садоводческого, огороднического или дачного некоммерческого объединения граждан"
                },
                {
                  "value": "7А.6",
                  "title": "Территория транспортно-пересадочного узла"
                },
                {
                  "value": "7А.7",
                  "title": "Территория, занятая линейным объектом и (или) предназначенная для размещения линейного объекта"
                },
                {
                  "value": "7А.8",
                  "title": "Улично-дорожная сеть"
                }
              ]
            },
            {
              "name": "status",
              "title": "Статус объекта",
              "valueType": "CHOICE",
              "required": true,
              "foreignKeyType": "STRING",
              "enumerations": [
                {
                  "value": "7В.1",
                  "title": "Существующий"
                },
                {
                  "value": "7В.2",
                  "title": "Планируемый"
                }
              ]
            },
            {
              "name": "number",
              "title": "Номер элемента планировочной структуры",
              "valueType": "INT",
              "required": true
            },
            {
              "name": "area",
              "title": "Площадь общая, кв. м.",
              "valueType": "DOUBLE",
              "fractionDigits": 2
            },
            {
              "name": "note",
              "title": "Примечание",
              "valueType": "STRING",
              "display": "multiline",
              "maxLength": 500
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "maxLength": 50,
              "description": "Пользователь создавший объект (Заполняется автоматически)",
              "valueType": "STRING",
              "readOnly": true
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "description": "Дата создания объекта (Заполняется автоматически)",
              "valueType": "DATETIME",
              "readOnly": true
            },
            {
              "name": "last_modified",
              "title": "Дата редактирования",
              "valueType": "DATETIME",
              "description": "Дата последнего редактирования объекта (Заполняется автоматически)",
              "readOnly": true
            },
            {
              "name": "updated_by",
              "title": "Редактор",
              "valueType": "STRING",
              "description": "Пользователь редактировавший объект последним (Заполняется автоматически)",
              "readOnly": true,
              "maxLength": 50
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "hidden": true,
              "allowedValues": [
                "Polygon"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "valueType": "INT",
              "hidden": true
            }
          ],
          "description": "Вид элемента планировочной структуры",
          "originName": "element_planning_structure_dpt",
          "styleName": "element_planning_structure_dpt",
          "readOnly": false,
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'element_planning_structure_dpt';

UPDATE data.schemas
SET class_rule =
        '{
          "name": "formed_land_dpt",
          "title": "Образуемый (изменяемый) земельный участок",
          "tags": [
            "system",
            "ДПТ"
          ],
          "tableName": "formed_land_dpt",
          "properties": [
            {
              "name": "class",
              "title": "Вид границы",
              "valueType": "CHOICE",
              "required": true,
              "asTitle": true,
              "description": "Вид границы образуемого (изменяемого) земельного участка",
              "foreignKeyType": "STRING",
              "enumerations": [
                {
                  "value": "7F.1",
                  "title": "Границы существующих (сохраняемых) земельных участков"
                },
                {
                  "value": "7F.2",
                  "title": "Границы образуемых земельных участков, в отношении которых предполагается изъятие и (или) резервирование для государственных или муниципальных нужд"
                },
                {
                  "value": "7F.3",
                  "title": "Границы изменяемых земельных участков"
                },
                {
                  "value": "7F.4",
                  "title": "Границы образуемых земельных участков"
                },
                {
                  "value": "7F.5",
                  "title": "Границы образуемых земельных участков, которые будут отнесены к имуществу общего пользования"
                },
                {
                  "value": "7F.6",
                  "title": "Границы образуемых земельных участков, которые будут отнесены к территориям общего пользования"
                },
                {
                  "value": "7F.7",
                  "title": "Границы образуемых земельных участков, предполагаемых к изъятию для государственных или муниципальных нужд"
                }
              ]
            },
            {
              "name": "status",
              "title": "Статус объекта",
              "valueType": "CHOICE",
              "required": true,
              "foreignKeyType": "STRING",
              "enumerations": [
                {
                  "value": "7В.1",
                  "title": "Существующий"
                },
                {
                  "value": "7В.2",
                  "title": "Планируемый"
                }
              ]
            },
            {
              "name": "forming_type",
              "title": "Способ образования",
              "valueType": "CHOICE",
              "description": "Способ образования земельного участка",
              "foreignKeyType": "STRING",
              "enumerations": [
                {
                  "value": "7G.1",
                  "title": "Образование земельных участков из земель или земельных участков, находящихся в государственной или муниципальной собственности"
                },
                {
                  "value": "7G.2",
                  "title": "Раздел земельного участка"
                },
                {
                  "value": "7G.3",
                  "title": "Объединение земельных участков"
                },
                {
                  "value": "7G.4",
                  "title": "Выдел земельного участка"
                },
                {
                  "value": "7G.5",
                  "title": "Перераспределение земельных участков"
                }
              ]
            },
            {
              "name": "nominal_num",
              "title": "Условный или кад. номер",
              "valueType": "STRING",
              "required": true,
              "description": "Условный или кадастровый номер образуемого (изменяемого) земельного участка"
            },
            {
              "name": "location_info",
              "title": "Местоположение",
              "valueType": "STRING"
            },
            {
              "name": "area",
              "title": "Площадь, кв.м",
              "valueType": "DOUBLE",
              "required": true,
              "totalDigits": 38,
              "fractionDigits": 2
            },
            {
              "name": "easement",
              "title": "Сервитут",
              "valueType": "URL",
              "description": "Информация о наличии публичного сервитута"
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "maxLength": 50,
              "description": "Пользователь создавший объект (Заполняется автоматически)",
              "valueType": "STRING",
              "readOnly": true
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "description": "Дата создания объекта (Заполняется автоматически)",
              "valueType": "DATETIME",
              "readOnly": true
            },
            {
              "name": "last_modified",
              "title": "Дата редактирования",
              "valueType": "DATETIME",
              "description": "Дата последнего редактирования объекта (Заполняется автоматически)",
              "readOnly": true
            },
            {
              "name": "updated_by",
              "title": "Редактор",
              "valueType": "STRING",
              "description": "Пользователь редактировавший объект последним (Заполняется автоматически)",
              "readOnly": true,
              "maxLength": 50
            },
            {
              "name": "note",
              "title": "Примечание",
              "valueType": "STRING",
              "maxLength": 256
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "hidden": true,
              "allowedValues": [
                "Polygon"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "valueType": "INT",
              "hidden": true
            }
          ],
          "description": "Образуемый (изменяемый) земельный участок",
          "originName": "formed_land_dpt",
          "styleName": "formed_land_dpt",
          "readOnly": false,
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'formed_land_dpt';

UPDATE data.schemas
SET class_rule =
        '{
          "name": "indent_line_dpt",
          "title": "Линии отступа от красных линий",
          "tags": [
            "system",
            "ДПТ"
          ],
          "tableName": "indent_line_dpt",
          "properties": [
            {
              "name": "number",
              "title": "Планировочный номер",
              "valueType": "STRING",
              "required": true,
              "asTitle": true,
              "maxLength": 50
            },
            {
              "name": "created_by",
              "title": "Создатель",
              "maxLength": 50,
              "description": "Пользователь создавший объект (Заполняется автоматически)",
              "valueType": "STRING",
              "readOnly": true
            },
            {
              "name": "created_at",
              "title": "Дата создания",
              "description": "Дата создания объекта (Заполняется автоматически)",
              "valueType": "DATETIME",
              "readOnly": true
            },
            {
              "name": "last_modified",
              "title": "Дата редактирования",
              "valueType": "DATETIME",
              "description": "Дата последнего редактирования объекта (Заполняется автоматически)",
              "readOnly": true
            },
            {
              "name": "updated_by",
              "title": "Редактор",
              "valueType": "STRING",
              "description": "Пользователь редактировавший объект последним (Заполняется автоматически)",
              "readOnly": true,
              "maxLength": 50
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "hidden": true,
              "allowedValues": [
                "Polygon"
              ]
            },
            {
              "name": "ruleid",
              "title": "Идентификатор стиля",
              "valueType": "INT",
              "hidden": true
            }
          ],
          "description": "Линии отступа от красных линий",
          "originName": "indent_line_dpt",
          "styleName": "indent_line_dpt",
          "readOnly": false,
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'indent_line_dpt';
