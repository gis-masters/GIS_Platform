INSERT INTO data.schemas (name, class_rule)
SELECT 'historicsettlement_65',  
'{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'historicsettlement_65');

INSERT INTO data.schemas (name, class_rule)
SELECT 'waterprotectionzone_65',  
'{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'waterprotectionzone_65');

INSERT INTO data.schemas (name, class_rule)
SELECT 'otherzone_65',  
'{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'otherzone_65');


UPDATE data.schemas 
SET class_rule =
       '{
        "name": "historicsettlement_65",
        "title": "Границы территории исторического поселения",
        "readOnly": true,
        "styleName": "historicsettlement_65",
        "tableName": "historicsettlement_65",
        "originName": "HistoricSettlement",
        "tags": ["system", "Приказ 10, версия 8 изм. от от 6 февраля 2025 № 65"],
        "properties": [
          {
            "name": "ruleid",
            "title": "Идентификатор стиля",
            "hidden": true,
            "valueType": "STRING",
            "calculatedValueWellKnownFormula": "rule_id_terr_Rf_subRf"
          },
          {
            "name": "globalid",
            "title": "Идентификатор объекта",
            "pattern": "(urn:uuid:)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}|\\{[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\}",
            "required": true,
            "valueType": "STRING"
          },
          {
            "name": "classid",
            "title": "Границы территории исторического поселения",
            "required": true,
            "valueType": "CHOICE",
            "enumerations": [
              {
                "title": "Граница территории исторического поселения",
                "value": "604020100"
              }
            ]
          },
          {
            "name": "name",
            "title": "Наименование объекта",
            "required": true,
            "valueType": "STRING"
          },
          {
            "name": "settl_cat",
            "title": "Категория историко-культурного значения исторического поселения",
            "required": true,
            "valueType": "CHOICE",
            "enumerations": [
              {
                "title": "Федеральное значение",
                "value": "1"
              },
              {
                "title": "Региональное значение",
                "value": "2"
              }
            ]
          },
          {
            "name": "source",
            "title": "Источник данных",
            "valueType": "STRING"
          },
          {
            "name": "note",
            "title": "Примечание",
            "valueType": "STRING"
          },
          {
            "name": "shape",
            "title": "геометрия",
            "valueType": "GEOMETRY",
            "hidden":true,                       
            "allowedValues": [
             "Polygon"
            ]
          }
        ],
        "description": "Класс объектов «Границы территории исторического поселения»",
        "geometryType": "MultiPolygon"
      }'
WHERE name = 'historicsettlement_65';

UPDATE data.schemas 
SET class_rule =
       '{
        "name": "waterprotectionzone_65",
        "title": "Водоохранные зоны",
        "readOnly": true,
        "styleName": "waterprotectionzone_65",
        "tableName": "waterprotectionzone_65",
        "originName": "WaterProtectionZone",
        "tags": ["system", "Приказ 10, версия 8 изм. от от 6 февраля 2025 № 65"],
        "properties": [
          {
            "name": "ruleid",
            "title": "Идентификатор стиля",
            "hidden": true,
            "valueType": "STRING",
            "calculatedValueWellKnownFormula": "rule_id_without_regstatus"
          },
          {
            "name": "globalid",
            "title": "Идентификатор объекта",
            "pattern": "(urn:uuid:)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}|\\{[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\}",
            "required": true,
            "valueType": "STRING"
          },
          {
            "name": "classid",
            "title": "Водоохранные зоны",
            "required": true,
            "valueType": "CHOICE",
            "enumerations": [
              {
                "title": "Водоохранная зона",
                "value": "603011101"
              }
            ]
          },
          {
            "name": "objectname",
            "title": "Наименование объекта (для которого устанавливается зона)",
            "valueType": "STRING"
          },
          {
            "name": "source",
            "title": "Источник данных",
            "valueType": "STRING"
          },
          {
            "name": "note",
            "title": "Примечание",
            "valueType": "STRING"
          },
          {
            "name": "numberzoit",
            "title": "Учетный номер зоны, внесенный в единый государственный реестр недвижимости",
            "valueType": "STRING"
          },
          {
            "name": "reestrzoit",
            "title": "Реестровый номер зоны, внесенный в единый государственный реестр недвижимости",
            "valueType": "STRING"
          },
          {
            "name": "dateegrn",
            "title": "Дата внесения зон с особыми условиями использования территории в единый государственный реестр недвижимости",
            "valueType": "STRING"
          },
          {
            "name": "status",
            "title": "Статус объекта",
            "required": true,
            "valueType": "CHOICE",
            "enumerations": [
              {
                "title": "Существующий",
                "value": "1"
              },
              {
                "title": "Планируемый",
                "value": "2"
              }
            ]
          },
          {
            "name": "shape",
            "title": "геометрия",
            "valueType": "GEOMETRY",
            "hidden":true,                       
            "allowedValues": [
             "Polygon"
            ]
          }
        ],
        "description": "Класс объектов «Водоохранные зоны»",
        "geometryType": "MultiPolygon"
      }'
WHERE name = 'waterprotectionzone_65';

UPDATE data.schemas 
SET class_rule =
       '{
        "name": "otherzone_65",
        "title": "Иные зоны с особыми условиями использования",
        "readOnly": true,
        "styleName": "otherzone_65",
        "tableName": "otherzone_65",
        "originName": "OtherZone",
        "tags": ["system", "Приказ 10, версия 8 изм. от от 6 февраля 2025 № 65"],
        "properties": [
          {
            "name": "ruleid",
            "title": "Идентификатор стиля",
            "hidden": true,
            "valueType": "STRING",
            "calculatedValueWellKnownFormula": "rule_id_without_regstatus"
          },
          {
            "name": "globalid",
            "title": "Идентификатор объекта",
            "pattern": "(urn:uuid:)?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}|\\{[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\}",
            "required": true,
            "valueType": "STRING"
          },
          {
            "name": "classid",
            "title": "Иные зоны с особыми условиями использования",
            "required": true,
            "valueType": "CHOICE",
            "enumerations": [
              {
                "title": "Придорожная полоса",
                "value": "603011701"
              },
              {
                "title": "Приаэродромная территория",
                "value": "603011702"
              },
              {
                "title": "Зона наблюдений радиационных объектов",
                "value": "603011703"
              },
              {
                "title": "Другие зоны, устанавливаемые в соответствии с законодательством Российской Федерации",
                "value": "603011704"
              },
              {
                "title": "Зона охраняемого военного объекта, охранная зона военного объекта, запретные и специальные зоны, устанавливаемые в связи с размещением указанных объектов",
                "value": "603011712"
              },
              {
                "title": "Зона ограничений передающего радиотехнического объекта, являющегося объектом капитального строительства",
                "value": "603011713"
              },
              {
                "title": "Охранная зона геодезических пунктов государственной геодезической сети, нивелирных пунктов государственной нивелирной сети и гравиметрических пунктов государственной гравиметрической сети",
                "value": "603011714"
              },
              {
                "title": "Зона безопасности с особым правовым режимом",
                "value": "603011715"
              },
              {
                "title": "Рыбохозяйственная заповедная зона озера Байкал",
                "value": "603011716"
              },
              {
                "title": "Зона минимальных расстояний до магистральных или промышленных трубопроводов(газопроводов, нефтепроводови нефтепродуктопроводов, аммиакопроводов)",
                "value": "603011717"
              },
              {
                "title": "Охранная зона объектов инфраструктуры метрополитена",
                "value": "603011718"
              }
            ]
          },
          {
            "name": "zone_desc",
            "title": "Описание зоны",
            "valueType": "STRING"
          },
          {
            "name": "objectname",
            "title": "Наименование объекта (для которого устанавливается зона)",
            "valueType": "STRING"
          },
          {
            "name": "aeroszone",
            "title": "Подзона приаэродромной территории",
            "valueType": "CHOICE",
            "enumerations": [
              {
                "title": "Первая подзона",
                "value": "1"
              },
              {
                "title": "Вторая подзона",
                "value": "2"
              },
              {
                "title": "Третья подзона",
                "value": "3"
              },
              {
                "title": "Четвертая подзона",
                "value": "4"
              },
              {
                "title": "Пятая подзона",
                "value": "5"
              },
              {
                "title": "Шестая подзона",
                "value": "6"
              },
              {
                "title": "Седьмая подзона",
                "value": "7"
              }
            ]
          },
          {
            "name": "source",
            "title": "Источник данных",
            "valueType": "STRING"
          },
          {
            "name": "note",
            "title": "Примечание",
            "valueType": "STRING"
          },
          {
            "name": "numberzoit",
            "title": "Учетный номер зоны, внесенный в единый государственный реестр недвижимости",
            "valueType": "STRING"
          },
          {
            "name": "reestrzoir",
            "title": "Реестровый номер зоны, внесенный в единый государственный реестр недвижимости",
            "valueType": "STRING"
          },
          {
           "name": "dateegrn",
            "title": "Дата внесения зон с особыми условиями использования территории в единый государственный реестр недвижимости",
            "valueType": "STRING"
          },
          {
            "name": "status",
            "title": "Статус объекта",
            "required": true,
            "valueType": "CHOICE",
            "enumerations": [
              {
                "title": "Существующий",
                "value": "1"
              },
              {
                "title": "Планируемый",
                "value": "2"
              }
            ]
          },
          {
            "name": "shape",
            "title": "геометрия",
            "valueType": "GEOMETRY",
            "hidden":true,                       
            "allowedValues": [
             "Polygon"
            ]
          }
        ],
        "description": "Класс объектов «Иные зоны с особыми условиями использования»",
        "geometryType": "MultiPolygon"
}',
custom_rule = 'var errors = [];

      if (obj.classid == ''603011702'') {
        if (!obj.aeroszone) {
          errors.push({attribute: ''aeroszone'', error: ''Значение обязательно к заполнению''});
        }
      } else if (obj.aeroszone) {
          errors.push({attribute: ''aeroszone'', error: ''Значение заполняется только для объекта "Приаэродромная территория"''});
      }

      return errors;'
WHERE name = 'otherzone_65';
