INSERT INTO data.schemas (name, class_rule)
SELECT 'advertising_zone_simf_2025',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'advertising_zone_simf_2025');

INSERT INTO data.schemas (name, class_rule)
SELECT 'advertising_point_simf_2025',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'advertising_point_simf_2025');

INSERT INTO data.schemas (name, class_rule)
SELECT 'signs_on_buildings',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'signs_on_buildings');

UPDATE data.schemas
SET class_rule =
        '{
            "name": "advertising_zone_simf_2025",
            "tags": [
              "system",
              "advertising"
            ],
            "title": "Зоны возможного размещения рекламных конструкций города Симферополь",
            "readOnly": true,
            "styleName": "advertising_zone_simf_2025",
            "tableName": "advertising_zone_simf_2025",
            "originName": "advertising_zone_simf_2025",
            "properties": [
              {
                "name": "objectid",
                "title": "№",
                "readOnly": true,
                "valueType": "INT",
                "description": "Идентификатор объекта (Заполняется автоматически)"
              },
              {
                "name": "objectname",
                "title": "Наименование",
                "required": true,
                "valueType": "STRING",
                "objectIdentityOnUi": true
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
                "required": true,
                "valueType": "STRING"
              }
            ],
            "description": "Зоны возможного размещения рекламных конструкций города Симферополь",
            "geometryType": "MultiPolygon"
          }'
WHERE name = 'advertising_zone_simf_2025';

UPDATE data.schemas
SET class_rule =
        '{
            "name": "advertising_point_simf_2025",
            "tags": [
              "system",
              "advertising"
            ],
            "title": "Рекламные конструкции города Симферополь",
            "readOnly": false,
            "styleName": "advertising_point_simf_2025",
            "tableName": "advertising_point_simf_2025",
            "originName": "advertising_point_simf_2025",
            "properties": [
              {
                "name": "objectid",
                "title": "№",
                "readOnly": true,
                "valueType": "INT",
                "description": "Идентификатор объекта (Заполняется автоматически)"
              },
              {
                "name": "classid",
                "title": "Код объекта",
                "required": true,
                "valueType": "CHOICE",
                "enumerations": [
                  {
                    "title": "Модульная малая двухсторонняя ",
                    "value": "510000001"
                  },
                  {
                    "title": "Модульная малая односторонняя ",
                    "value": "510000002"
                  },
                  {
                    "title": "Отдельно стоящий короб ",
                    "value": "510000003"
                  },
                  {
                    "title": "Панель-кронштейн на здании ",
                    "value": "510000004"
                  },
                  {
                    "title": "Панель-кронштейн на опоре ",
                    "value": "510000005"
                  },
                  {
                    "title": "Панель-кронштейн на опоре односторонний ",
                    "value": "510000006"
                  },
                  {
                    "title": "Светодиодный V-образный экран ",
                    "value": "510000007"
                  },
                  {
                    "title": "Светодиодный односторонний экран ",
                    "value": "510000008"
                  },
                  {
                    "title": "Светодиодная опора в центре ",
                    "value": "510000009"
                  },
                  {
                    "title": "Светодиодный трехсторонний экран ",
                    "value": "510000010"
                  },
                  {
                    "title": "Светодиодный четырехсторонний экран ",
                    "value": "510000011"
                  },
                  {
                    "title": "Стелла, пилон ",
                    "value": "510000012"
                  },
                  {
                    "title": "Стелла односторонняя, пилон",
                    "value": "510000013"
                  },
                  {
                    "title": "Уличный рекламный указатель ",
                    "value": "510000014"
                  },
                  {
                    "title": "Флаг ",
                    "value": "510000015"
                  },
                  {
                    "title": "Щитовая опора большого формата V-образная ",
                    "value": "510000016"
                  },
                  {
                    "title": "Щитовая опора большого формата в центре ",
                    "value": "510000017"
                  },
                  {
                    "title": "Щитовая односторонняя опора большого формата в центре",
                    "value": "510000018"
                  },
                  {
                    "title": "Щитовая опора большого формата сбоку ",
                    "value": "510000019"
                  },
                  {
                    "title": "Щитовая односторонняя опора большого формата сбоку ",
                    "value": "510000020"
                  },
                  {
                    "title": "Щитовая опора большого формата сбоку 2 ",
                    "value": "510000022"
                  },
                  {
                    "title": "Щитовая односторонняя опора большого формата сбоку 2 ",
                    "value": "510000023"
                  },
                  {
                    "title": "Щитовая трехсторонняя опора большого формата ",
                    "value": "510000024"
                  },
                  {
                    "title": "Щитовая четырехсторонняя опора большого формата ",
                    "value": "510000025"
                  },
                  {
                    "title": "Щитовая опора малого формата ",
                    "value": "510000026"
                  },
                  {
                    "title": "Щитовая V- образная опора малого формата ",
                    "value": "510000027"
                  },
                  {
                    "title": "Щитовая опора малого формата в центре ",
                    "value": "510000028"
                  },
                  {
                    "title": "Щитовая односторонняя опора малого формата ",
                    "value": "510000029"
                  },
                  {
                    "title": "Щитовая трехсторонняя опора малого формата ",
                    "value": "510000030"
                  },
                  {
                    "title": "Щитовая трехсторонняя опора малого формата 2 ",
                    "value": "510000031"
                  },
                  {
                    "title": "Щитовая четырехсторонняя опора малого формата ",
                    "value": "510000032"
                  },
                  {
                    "title": "Щитовая трехсторонняя опора малого формата на ножке ",
                    "value": "510000033"
                  },
                  {
                    "title": "Щитовая V- образная опора сверхбольшого формата ",
                    "value": "510000034"
                  },
                  {
                    "title": "Щитовая опора сверхбольшого формата в центре ",
                    "value": "510000035"
                  },
                  {
                    "title": "Щитовая односторонняя опора сверхбольшого формата в центре ",
                    "value": "510000036"
                  },
                  {
                    "title": "Щитовая трехсторонняя опора сверхбольшого формата в центре ",
                    "value": "510000037"
                  },
                  {
                    "title": "Щитовая четырехсторонняя опора сверхбольшого формата в центре ",
                    "value": "510000038"
                  },
                  {
                    "title": "Щитовая V- образная опора среднего формата ",
                    "value": "510000039"
                  },
                  {
                    "title": "Щитовая опора среднего формата в центре ",
                    "value": "510000040"
                  },
                  {
                    "title": "Щитовая односторонняя опора среднего формата в центре ",
                    "value": "510000041"
                  },
                  {
                    "title": "Щитовая опора среднего формата сбоку ",
                    "value": "510000042"
                  },
                  {
                    "title": "Щитовая односторонняя опора среднего формата сбоку ",
                    "value": "510000043"
                  },
                  {
                    "title": "Щитовая трехсторонняя опора среднего формата ",
                    "value": "510000044"
                  },
                  {
                    "title": "Щитовая четырехсторонняя опора среднего формата  ",
                    "value": "510000045"
                  }
                ],
                "objectIdentityOnUi": true
              },
              {
                "name": "trade_num",
                "title": "Номер на схеме",
                "maxLength": 10,
                "valueType": "STRING"
              },
              {
                "name": "location",
                "title": "Местоположение (адресное описание)",
                "valueType": "STRING"
              },
              {
                "name": "sides_num",
                "title": "Количество сторон",
                "valueType": "CHOICE",
                "enumerations": [
                  {
                    "title": "Односторонняя",
                    "value": "Односторонняя"
                  },
                  {
                    "title": "Двухсторонняя (плоская)",
                    "value": "Двухсторонняя (плоская)"
                  },
                  {
                    "title": "Трехсторонняя",
                    "value": "Трехсторонняя"
                  },
                  {
                    "title": "Четырехсторонняя",
                    "value": "Четырехсторонняя"
                  }
                ]
              },
              {
                "name": "size",
                "title": "Размер конструкции",
                "valueType": "STRING"
              },
              {
                "name": "pillar",
                "title": "Расположение опоры",
                "valueType": "CHOICE",
                "enumerations": [
                  {
                    "title": "Опора по центру",
                    "value": "Опора по центру"
                  },
                  {
                    "title": "Опора сбоку",
                    "value": "Опора сбоку"
                  }
                ]
              },
              {
                "name": "inf_area",
                "title": "Площадь информационного поля",
                "valueType": "STRING"
              },
              {
                "name": "response",
                "title": "Ответственный за размещение и эксплуатацию",
                "valueType": "STRING"
              },
              {
                "name": "issue_date",
                "title": "Дата выдачи разрешения на установку и эксплуатацию",
                "valueType": "DATETIME"
              },
              {
                "name": "exp_date",
                "title": "Дата окончания действия разрешения на установку и эксплуатацию",
                "valueType": "DATETIME"
              },
              {
                "name": "reg_number",
                "title": "Номер в Реестре согласований",
                "valueType": "STRING"
              },
              {
                "name": "owner",
                "title": "Собственник объекта недвижимого имущества, на котором установлена конструкция",
                "valueType": "STRING"
              },
              {
                "name": "cancelreas",
                "title": "Основания аннулирования согласования",
                "maxLength": 500,
                "valueType": "STRING"
              },
              {
                "name": "notes",
                "title": "Примечания",
                "valueType": "STRING"
              },
              {
                "name": "doc",
                "title": "Документы",
                "maxSize": 50000000,
                "multiple": true,
                "valueType": "FILE"
              },
              {
                "name": "photo",
                "title": "Фотофиксация (фотоматериалы)",
                "maxSize": 50000000,
                "multiple": true,
                "valueType": "FILE"
              },
              {
                "name": "shape",
                "title": "shape",
                "hidden": true,
                "valueType": "GEOMETRY",
                "allowedValues": [
                  "Point"
                ]
              },
              {
                "name": "ruleid",
                "title": "Идентификатор стиля",
                "hidden": true,
                "required": true,
                "valueType": "STRING"
              }
            ],
            "description": "Рекламные конструкции города Симферополь",
            "geometryType": "Point"
          }'
WHERE name = 'advertising_point_simf_2025';


UPDATE data.schemas
SET class_rule =
        '{
      "name": "signs_on_buildings",
      "tags": [
        "system",
        "advertising"
      ],
      "title": "Вывески на зданиях",
      "readOnly": false,
      "styleName": "signs_on_buildings",
      "tableName": "signs_on_buildings",
      "originName": "signs_on_buildings",
      "properties": [
        {
          "name": "objectid",
          "title": "№",
          "readOnly": true,
          "valueType": "LONG",
          "description": "Идентификатор объекта (Заполняется автоматически)",
          "maxDefaultWidth": 105
        },
        {
          "name": "location",
          "title": "Местоположение (адресное описание)",
          "valueType": "STRING"
        },
        {
          "name": "size",
          "title": "Размер конструкции",
          "valueType": "STRING"
        },
        {
          "name": "inf_area",
          "title": "Площадь информационного поля",
          "valueType": "STRING"
        },
        {
          "name": "response",
          "title": "Ответственный за размещение и эксплуатацию",
          "valueType": "STRING"
        },
        {
          "name": "issue_date",
          "title": "Дата выдачи разрешения на установку и эксплуатацию",
          "valueType": "DATETIME"
        },
        {
          "name": "exp_date",
          "title": "Дата окончания действия разрешения на установку и эксплуатацию",
          "valueType": "DATETIME"
        },
        {
          "name": "reg_number",
          "title": "Номер в Реестре согласований",
          "valueType": "STRING"
        },
        {
          "name": "owner",
          "title": "Собственник объекта недвижимого имущества, на котором установлена конструкция",
          "valueType": "STRING"
        },
        {
          "name": "cancelreas",
          "title": "Основания аннулирования согласования",
          "maxLength": 500,
          "valueType": "STRING"
        },
        {
          "name": "notes",
          "title": "Примечания",
          "valueType": "STRING"
        },
        {
          "name": "doc",
          "title": "Документы",
          "maxSize": 50000000,
          "multiple": true,
          "valueType": "FILE"
        },
        {
          "name": "photo",
          "title": "Фотофиксация (фотоматериалы)",
          "maxSize": 50000000,
          "multiple": true,
          "valueType": "FILE"
        },
        {
          "name": "shape",
          "title": "shape",
          "hidden": true,
          "valueType": "GEOMETRY",
          "allowedValues": [
            "Point"
          ]
        },
        {
          "name": "ruleid",
          "title": "Идентификатор стиля",
          "hidden": true,
          "required": true,
          "valueType": "STRING"
        },
        {
          "name": "created_by",
          "title": "Создатель",
          "readOnly": true,
          "valueType": "STRING",
          "description": "Пользователь создавший объект (Заполняется автоматически)"
        },
        {
          "name": "created_at",
          "title": "Дата создания",
          "readOnly": true,
          "valueType": "DATETIME",
          "description": "Дата создания объекта (Заполняется автоматически)"
        },
        {
          "name": "updated_by",
          "title": "Редактор",
          "hidden": true,
          "readOnly": true,
          "valueType": "STRING",
          "description": "Пользователь редактировавший объект последним (Заполняется автоматически)"
        },
        {
          "name": "last_modified",
          "title": "Дата редактирования",
          "hidden": true,
          "readOnly": true,
          "valueType": "DATETIME",
          "description": "Дата последнего редактирования объекта (Заполняется автоматически)"
        }
      ],
      "description": "Вывески на зданиях",
      "geometryType": "Point"
    }'
WHERE name = 'signs_on_buildings';

