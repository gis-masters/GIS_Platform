INSERT INTO data.schemas (name, class_rule)
SELECT 'garbage_border',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'garbage_border');

INSERT INTO data.schemas (name, class_rule)
SELECT 'garbage_buildings',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'garbage_buildings');

INSERT INTO data.schemas (name, class_rule)
SELECT 'garbage_respons_poly',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'garbage_respons_poly');

INSERT INTO data.schemas (name, class_rule)
SELECT 'gratuitous',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'gratuitous');

INSERT INTO data.schemas (name, class_rule)
SELECT 'lease',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'lease');

INSERT INTO data.schemas (name, class_rule)
SELECT 'lease_buffer',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'lease_buffer');

INSERT INTO data.schemas (name, class_rule)
SELECT 'municipal',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'municipal');

INSERT INTO data.schemas (name, class_rule)
SELECT 'red_lines_2019',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'red_lines_2019');

INSERT INTO data.schemas (name, class_rule)
SELECT 'responsible',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'responsible');

INSERT INTO data.schemas (name, class_rule)
SELECT 'zu_buffer',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'zu_buffer');

INSERT INTO data.schemas (name, class_rule)
SELECT 'garbage_containers',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'garbage_containers');

INSERT INTO data.schemas (name, class_rule)
SELECT 'garbage_responsible',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'garbage_responsible');

INSERT INTO data.schemas (name, class_rule)
SELECT 'streets_cleaning',
       '{}'
WHERE NOT EXISTS(SELECT id FROM data.schemas WHERE name = 'streets_cleaning');

UPDATE data.schemas
SET class_rule =
        '{
          "tags": [
            "system",
            "Сан. очистка (ДГХ)"
          ],
          "name": "garbage_border",
          "title": "Граница",
          "styleName": "garbage_border",
          "tableName": "garbage_border",
          "properties": [
            {
              "name": "name",
              "title": "Наименование",
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
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
              "hidden": true,
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Polygon"
              ]
            }
          ],
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'garbage_border';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "garbage_buildings",
          "tags": [
            "system",
            "Сан. очистка (ДГХ)"
          ],
          "name": "garbage_buildings",
          "title": "Здания",
          "tableName": "garbage_buildings",
          "originName": "garbage_buildings",
          "properties": [
            {
              "name": "classid",
              "title": "Код объекта»",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Здания",
                  "value": "50102022"
                }
              ],
              "asTitle": true
            },
            {
              "name": "area",
              "title": "Площадь, кв.м.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 0
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
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'garbage_buildings';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "garbage_respons_poly",
          "tags": [
            "system",
            "Сан. очистка (ДГХ)"
          ],
          "name": "garbage_respons_poly",
          "title": "Ответственные",
          "tableName": "garbage_respons_poly",
          "originName": "garbage_respons_poly",
          "properties": [
            {
              "name": "classid",
              "title": "Тип территории",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Государственная собственность",
                  "value": "1"
                },
                {
                  "title": "Муниципальная собственность",
                  "value": "2"
                },
                {
                  "title": "Частная собственность",
                  "value": "3"
                },
                {
                  "title": "Право аренды",
                  "value": "4"
                },
                {
                  "title": "Право безвозмездного пользования",
                  "value": "5"
                },
                {
                  "title": "Участки на кадастровом учете",
                  "value": "6"
                },
                {
                  "title": "Придомовые территории",
                  "value": "7"
                },
                {
                  "title": "Дороги, проезды",
                  "value": "8"
                },
                {
                  "title": "Скверы",
                  "value": "9"
                },
                {
                  "title": "Участки, не учтенные в ЕГРН",
                  "value": "10"
                },
                {
                  "title": "Прочие",
                  "value": "11"
                }
              ],
              "asTitle": true
            },
            {
              "name": "cad_num",
              "title": "Кадастровый номер",
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "raddress",
              "title": "Местоположение, адресное описание",
              "valueType": "STRING"
            },
            {
              "name": "landuser",
              "title": "Землепользователь",
              "valueType": "STRING"
            },
            {
              "name": "usage",
              "title": "Вид использования земельного участка",
              "valueType": "STRING"
            },
            {
              "name": "propertyty",
              "title": "Тип собственности",
              "valueType": "STRING"
            },
            {
              "name": "responsible",
              "title": "Наименование ответственного",
              "valueType": "STRING"
            },
            {
              "name": "responsi_1",
              "title": "Ответственный",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "ЖСК ТСН ТСЖ",
                  "value": "1"
                },
                {
                  "title": "МУП «Аванград»",
                  "value": "2"
                },
                {
                  "title": "МКД(ответственный не указан)",
                  "value": "3"
                },
                {
                  "title": "МУП «Железнодорожный Жилсервис»",
                  "value": "4"
                },
                {
                  "title": "МУП «Киевский Жилсервис»",
                  "value": "5"
                },
                {
                  "title": "МУП «Центральный Жилсервис»",
                  "value": "6"
                },
                {
                  "title": "МБУ «Город»",
                  "value": "7"
                },
                {
                  "title": "Землепользователь(государственная собственность)",
                  "value": "8"
                },
                {
                  "title": "Землепользователь(муниципальная собственность)",
                  "value": "9"
                },
                {
                  "title": "Землепользователь(арендатор)",
                  "value": "10"
                },
                {
                  "title": "Землепользователь(безвозмездное пользование)",
                  "value": "11"
                },
                {
                  "title": "Землепользователь(на кадастровом учете)",
                  "value": "12"
                },
                {
                  "title": "Землепользователь(ИЖС)",
                  "value": "13"
                },
                {
                  "title": "Землепользователь(юридическое лицо)",
                  "value": "14"
                },
                {
                  "title": "Ответственный не определен",
                  "value": "15"
                }
              ]
            },
            {
              "name": "area",
              "title": "Площадь м. кв.",
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
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'garbage_respons_poly';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "gratuitous",
          "tags": [
            "system",
            "Сан. очистка (ДГХ)"
          ],
          "name": "gratuitous",
          "title": "Безвозмездное пользование",
          "tableName": "gratuitous",
          "originName": "gratuitous",
          "properties": [
            {
              "name": "cad_num",
              "title": "Кадастровый номер",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "num_zu",
              "title": "Номер ЗУ",
              "hidden": true,
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "landuser",
              "title": "Землепользователь",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "usage",
              "title": "Разрешенное использование",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "landuse",
              "title": "Вид разрешенного использования",
              "hidden": true,
              "required": true,
              "valueType": "TEXT"
            },
            {
              "name": "ccode",
              "title": "Категория землепользования (код)",
              "hidden": true,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Земли сельскохозяйственного назначения",
                  "value": "003001000000"
                },
                {
                  "title": "Сельскохозяйственные угодья",
                  "value": "003001000010"
                },
                {
                  "title": "Земельные участки, занятые внутрихозяйственными дорогами, коммуникациями, лесными насаждениями, предназначенными для обеспечения защиты земель от негативного воздействия, водными объектами, а также занятые зданиями, сооружениями, используемыми для производства, хранения и первичной переработки сельскохозяйственной продукции",
                  "value": "003001000020"
                },
                {
                  "title": "Прочие земельные участки из состава земель сельскохозяйственного назначения",
                  "value": "003001000030"
                },
                {
                  "title": "Земли населенных пунктов",
                  "value": "003002000000"
                },
                {
                  "title": "Земельные участки, отнесенные к зонам сельскохозяйственного использования",
                  "value": "003002000010"
                },
                {
                  "title": "Земельные участки, занятые жилищным фондом и объектами инженерной инфраструктуры жилищно-коммунального комплекса",
                  "value": "003002000020"
                },
                {
                  "title": "Земельные участки, приобретенные (предоставленные) для индивидуального жилищного строительства",
                  "value": "003002000030"
                },
                {
                  "title": "Земельные участки, приобретенные (предоставленные) на условиях осуществления на них жилищного строительства (за исключением индивидуального жилищного строительства)",
                  "value": "003002000040"
                },
                {
                  "title": "Земельные участки, приобретенные (предоставленные) для ведения личного подсобного хозяйства, садоводства и огородничества или животноводства, а также дачного хозяйства",
                  "value": "003002000060"
                },
                {
                  "title": "Земельные участки, отнесенные к производственным территориальным зонам и зонам инженерных и транспортных инфраструктур",
                  "value": "003002000090"
                },
                {
                  "title": "Земельные участки для обеспечения обороны",
                  "value": "003002000110"
                },
                {
                  "title": "Земельные участки для обеспечения безопасности",
                  "value": "003002000120"
                },
                {
                  "title": "Земельные участки для обеспечения таможенных нужд",
                  "value": "003002000130"
                },
                {
                  "title": "Прочие земельные участки",
                  "value": "003002000100"
                },
                {
                  "title": "Земли промышленности, энергетики, транспорта, связи, радиовещания, телевидения, информатики, земли для обеспечения космической деятельности, земли обороны, безопасности и земли иного специального назначения",
                  "value": "003003000000"
                },
                {
                  "title": "Земельные участки из состава земель промышленности",
                  "value": "003003000010"
                },
                {
                  "title": "Земельные участки из состава земель энергетики",
                  "value": "003003000020"
                },
                {
                  "title": "Земельные участки из состава земель транспорта",
                  "value": "003003000030"
                },
                {
                  "title": "Земельные участки из состава земель связи, радиовещания, телевидения, информатики",
                  "value": "003003000040"
                },
                {
                  "title": "Земельные участки из состава земель обороны",
                  "value": "003003000060"
                },
                {
                  "title": "Земельные участки из состава земель безопасности",
                  "value": "003003000070"
                },
                {
                  "title": "Земельные участки из состава земель для обеспечения таможенных нужд",
                  "value": "003008000010"
                },
                {
                  "title": "Земельные участки из состава земель иного специального назначения",
                  "value": "003003000080"
                },
                {
                  "title": "Земли особо охраняемых территорий и объектов",
                  "value": "003004000000"
                },
                {
                  "title": "Земли лесного фонда",
                  "value": "003005000000"
                },
                {
                  "title": "Земли водного фонда",
                  "value": "003006000000"
                },
                {
                  "title": "Земли запаса",
                  "value": "003007000000"
                },
                {
                  "title": "Земельные участки, для которых категория земель не установлена",
                  "value": "003008000000"
                }
              ]
            },
            {
              "name": "category",
              "title": "Категория Земельного участка",
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "raddress",
              "title": "Адрес в соответствии с ФИАС",
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "otypecode",
              "title": "Вид объекта недвижимости (код)",
              "hidden": true,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Объекты учёта и регистрации",
                  "value": "002001000000"
                },
                {
                  "title": "Земельный участок",
                  "value": "002001001000"
                },
                {
                  "title": "Здание",
                  "value": "002001002000"
                },
                {
                  "title": "Помещение",
                  "value": "002001003000"
                },
                {
                  "title": "Сооружение",
                  "value": "002001004000"
                },
                {
                  "title": "Линейное сооружение, расположенное более чем в одном кадастровом округе",
                  "value": "002001004001"
                },
                {
                  "title": "Условная часть линейного сооружения",
                  "value": "002001004002"
                },
                {
                  "title": "Объект незавершённого строительства",
                  "value": "002001005000"
                },
                {
                  "title": "Предприятие как имущественный комплекс (ПИК)",
                  "value": "002001006000"
                },
                {
                  "title": "Участок недр",
                  "value": "002001007000"
                },
                {
                  "title": "Единый недвижимый комплекс",
                  "value": "002001008000"
                },
                {
                  "title": "Границы",
                  "value": "002002000000"
                },
                {
                  "title": "Государственная граница Российской Федерации",
                  "value": "002002001000"
                },
                {
                  "title": "Граница между субъектами Российской Федерации",
                  "value": "002002002000"
                },
                {
                  "title": "Граница муниципального образования",
                  "value": "002002003000"
                },
                {
                  "title": "Граница населённого пункта",
                  "value": "002002004000"
                },
                {
                  "title": "Зоны",
                  "value": "002003000000"
                },
                {
                  "title": "Зона с особыми условиями использования территорий",
                  "value": "002003001000"
                },
                {
                  "title": "Территориальная зона",
                  "value": "002003002000"
                },
                {
                  "title": "Особая экономическая зона",
                  "value": "002003003000"
                },
                {
                  "title": "Территория объекта культурного наследия",
                  "value": "002004000000"
                }
              ]
            },
            {
              "name": "objecttype",
              "title": "Вид объекта недвижимости",
              "hidden": true,
              "required": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "ptypecode",
              "title": "Вид земельного участка (код)",
              "hidden": true,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Землепользование",
                  "value": "01"
                },
                {
                  "title": "Единое землепользование",
                  "value": "02"
                },
                {
                  "title": "Обособленный участок",
                  "value": "03"
                },
                {
                  "title": "Условный участок",
                  "value": "04"
                },
                {
                  "title": "Многоконтурный участок",
                  "value": "05"
                },
                {
                  "title": "Значение отсутствует",
                  "value": "06"
                }
              ]
            },
            {
              "name": "parceltype",
              "title": "Вид Земельного участка",
              "hidden": true,
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "rdate",
              "title": "Дата постановки на учет/ регистрации",
              "hidden": true,
              "required": true,
              "valueType": "DATETIME"
            },
            {
              "name": "cdate",
              "title": "Дата снятия с учета/регистрации",
              "hidden": true,
              "required": true,
              "valueType": "DATETIME"
            },
            {
              "name": "cost",
              "title": "Кадастровая стоимость",
              "hidden": true,
              "required": true,
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 8
            },
            {
              "name": "area_doc",
              "title": "Площадь по документу",
              "required": true,
              "valueType": "DOUBLE",
              "fractionDigits": 8
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
WHERE name = 'gratuitous';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "lease",
          "tags": [
            "system",
            "Сан. очистка (ДГХ)"
          ],
          "name": "lease",
          "title": "Аренда",
          "tableName": "lease",
          "originName": "lease",
          "properties": [
            {
              "name": "cad_num",
              "title": "Кадастровый номер",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "num_zu",
              "title": "Номер ЗУ",
              "hidden": true,
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "tenant",
              "title": "Арендатор",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "usage",
              "title": "Разрешенное использование",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "landuse",
              "title": "Вид разрешенного использования",
              "hidden": true,
              "required": true,
              "valueType": "TEXT"
            },
            {
              "name": "ccode",
              "title": "Категория землепользования (код)",
              "hidden": true,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Земли сельскохозяйственного назначения",
                  "value": "003001000000"
                },
                {
                  "title": "Сельскохозяйственные угодья",
                  "value": "003001000010"
                },
                {
                  "title": "Земельные участки, занятые внутрихозяйственными дорогами, коммуникациями, лесными насаждениями, предназначенными для обеспечения защиты земель от негативного воздействия, водными объектами, а также занятые зданиями, сооружениями, используемыми для производства, хранения и первичной переработки сельскохозяйственной продукции",
                  "value": "003001000020"
                },
                {
                  "title": "Прочие земельные участки из состава земель сельскохозяйственного назначения",
                  "value": "003001000030"
                },
                {
                  "title": "Земли населенных пунктов",
                  "value": "003002000000"
                },
                {
                  "title": "Земельные участки, отнесенные к зонам сельскохозяйственного использования",
                  "value": "003002000010"
                },
                {
                  "title": "Земельные участки, занятые жилищным фондом и объектами инженерной инфраструктуры жилищно-коммунального комплекса",
                  "value": "003002000020"
                },
                {
                  "title": "Земельные участки, приобретенные (предоставленные) для индивидуального жилищного строительства",
                  "value": "003002000030"
                },
                {
                  "title": "Земельные участки, приобретенные (предоставленные) на условиях осуществления на них жилищного строительства (за исключением индивидуального жилищного строительства)",
                  "value": "003002000040"
                },
                {
                  "title": "Земельные участки, приобретенные (предоставленные) для ведения личного подсобного хозяйства, садоводства и огородничества или животноводства, а также дачного хозяйства",
                  "value": "003002000060"
                },
                {
                  "title": "Земельные участки, отнесенные к производственным территориальным зонам и зонам инженерных и транспортных инфраструктур",
                  "value": "003002000090"
                },
                {
                  "title": "Земельные участки для обеспечения обороны",
                  "value": "003002000110"
                },
                {
                  "title": "Земельные участки для обеспечения безопасности",
                  "value": "003002000120"
                },
                {
                  "title": "Земельные участки для обеспечения таможенных нужд",
                  "value": "003002000130"
                },
                {
                  "title": "Прочие земельные участки",
                  "value": "003002000100"
                },
                {
                  "title": "Земли промышленности, энергетики, транспорта, связи, радиовещания, телевидения, информатики, земли для обеспечения космической деятельности, земли обороны, безопасности и земли иного специального назначения",
                  "value": "003003000000"
                },
                {
                  "title": "Земельные участки из состава земель промышленности",
                  "value": "003003000010"
                },
                {
                  "title": "Земельные участки из состава земель энергетики",
                  "value": "003003000020"
                },
                {
                  "title": "Земельные участки из состава земель транспорта",
                  "value": "003003000030"
                },
                {
                  "title": "Земельные участки из состава земель связи, радиовещания, телевидения, информатики",
                  "value": "003003000040"
                },
                {
                  "title": "Земельные участки из состава земель обороны",
                  "value": "003003000060"
                },
                {
                  "title": "Земельные участки из состава земель безопасности",
                  "value": "003003000070"
                },
                {
                  "title": "Земельные участки из состава земель для обеспечения таможенных нужд",
                  "value": "003008000010"
                },
                {
                  "title": "Земельные участки из состава земель иного специального назначения",
                  "value": "003003000080"
                },
                {
                  "title": "Земли особо охраняемых территорий и объектов",
                  "value": "003004000000"
                },
                {
                  "title": "Земли лесного фонда",
                  "value": "003005000000"
                },
                {
                  "title": "Земли водного фонда",
                  "value": "003006000000"
                },
                {
                  "title": "Земли запаса",
                  "value": "003007000000"
                },
                {
                  "title": "Земельные участки, для которых категория земель не установлена",
                  "value": "003008000000"
                }
              ]
            },
            {
              "name": "category",
              "title": "Категория Земельного участка",
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "raddress",
              "title": "Адрес в соответствии с ФИАС",
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "otypecode",
              "title": "Вид объекта недвижимости (код)",
              "hidden": true,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Объекты учёта и регистрации",
                  "value": "002001000000"
                },
                {
                  "title": "Земельный участок",
                  "value": "002001001000"
                },
                {
                  "title": "Здание",
                  "value": "002001002000"
                },
                {
                  "title": "Помещение",
                  "value": "002001003000"
                },
                {
                  "title": "Сооружение",
                  "value": "002001004000"
                },
                {
                  "title": "Линейное сооружение, расположенное более чем в одном кадастровом округе",
                  "value": "002001004001"
                },
                {
                  "title": "Условная часть линейного сооружения",
                  "value": "002001004002"
                },
                {
                  "title": "Объект незавершённого строительства",
                  "value": "002001005000"
                },
                {
                  "title": "Предприятие как имущественный комплекс (ПИК)",
                  "value": "002001006000"
                },
                {
                  "title": "Участок недр",
                  "value": "002001007000"
                },
                {
                  "title": "Единый недвижимый комплекс",
                  "value": "002001008000"
                },
                {
                  "title": "Границы",
                  "value": "002002000000"
                },
                {
                  "title": "Государственная граница Российской Федерации",
                  "value": "002002001000"
                },
                {
                  "title": "Граница между субъектами Российской Федерации",
                  "value": "002002002000"
                },
                {
                  "title": "Граница муниципального образования",
                  "value": "002002003000"
                },
                {
                  "title": "Граница населённого пункта",
                  "value": "002002004000"
                },
                {
                  "title": "Зоны",
                  "value": "002003000000"
                },
                {
                  "title": "Зона с особыми условиями использования территорий",
                  "value": "002003001000"
                },
                {
                  "title": "Территориальная зона",
                  "value": "002003002000"
                },
                {
                  "title": "Особая экономическая зона",
                  "value": "002003003000"
                },
                {
                  "title": "Территория объекта культурного наследия",
                  "value": "002004000000"
                }
              ]
            },
            {
              "name": "objecttype",
              "title": "Вид объекта недвижимости",
              "hidden": true,
              "required": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "ptypecode",
              "title": "Вид земельного участка (код)",
              "hidden": true,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Землепользование",
                  "value": "01"
                },
                {
                  "title": "Единое землепользование",
                  "value": "02"
                },
                {
                  "title": "Обособленный участок",
                  "value": "03"
                },
                {
                  "title": "Условный участок",
                  "value": "04"
                },
                {
                  "title": "Многоконтурный участок",
                  "value": "05"
                },
                {
                  "title": "Значение отсутствует",
                  "value": "06"
                }
              ]
            },
            {
              "name": "parceltype",
              "title": "Вид Земельного участка",
              "hidden": true,
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "rdate",
              "title": "Дата постановки на учет/ регистрации",
              "hidden": true,
              "required": true,
              "valueType": "DATETIME"
            },
            {
              "name": "cdate",
              "title": "Дата снятия с учета/регистрации",
              "hidden": true,
              "required": true,
              "valueType": "DATETIME"
            },
            {
              "name": "cost",
              "title": "Кадастровая стоимость",
              "hidden": true,
              "required": true,
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 8
            },
            {
              "name": "area_doc",
              "title": "Площадь по документу",
              "required": true,
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 8
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
WHERE name = 'lease';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "lease_buffer",
          "tags": [
            "system",
            "Сан. очистка (ДГХ)"
          ],
          "name": "lease_buffer",
          "title": "Зоны ответственности арендаторов",
          "tableName": "lease_buffer",
          "originName": "lease_buffer",
          "properties": [
            {
              "name": "cad_num",
              "title": "Кадастровый номер",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "num_zu",
              "title": "Номер ЗУ",
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "tenant",
              "title": "Арендатор",
              "valueType": "STRING"
            },
            {
              "name": "usage",
              "title": "Разрешенное использование",
              "valueType": "STRING"
            },
            {
              "name": "landuse",
              "title": "Вид разрешенного использования",
              "valueType": "TEXT"
            },
            {
              "name": "ccode",
              "title": "Категория землепользования (код)",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Земли сельскохозяйственного назначения",
                  "value": "003001000000"
                },
                {
                  "title": "Сельскохозяйственные угодья",
                  "value": "003001000010"
                },
                {
                  "title": "Земельные участки, занятые внутрихозяйственными дорогами, коммуникациями, лесными насаждениями, предназначенными для обеспечения защиты земель от негативного воздействия, водными объектами, а также занятые зданиями, сооружениями, используемыми для производства, хранения и первичной переработки сельскохозяйственной продукции",
                  "value": "003001000020"
                },
                {
                  "title": "Прочие земельные участки из состава земель сельскохозяйственного назначения",
                  "value": "003001000030"
                },
                {
                  "title": "Земли населенных пунктов",
                  "value": "003002000000"
                },
                {
                  "title": "Земельные участки, отнесенные к зонам сельскохозяйственного использования",
                  "value": "003002000010"
                },
                {
                  "title": "Земельные участки, занятые жилищным фондом и объектами инженерной инфраструктуры жилищно-коммунального комплекса",
                  "value": "003002000020"
                },
                {
                  "title": "Земельные участки, приобретенные (предоставленные) для индивидуального жилищного строительства",
                  "value": "003002000030"
                },
                {
                  "title": "Земельные участки, приобретенные (предоставленные) на условиях осуществления на них жилищного строительства (за исключением индивидуального жилищного строительства)",
                  "value": "003002000040"
                },
                {
                  "title": "Земельные участки, приобретенные (предоставленные) для ведения личного подсобного хозяйства, садоводства и огородничества или животноводства, а также дачного хозяйства",
                  "value": "003002000060"
                },
                {
                  "title": "Земельные участки, отнесенные к производственным территориальным зонам и зонам инженерных и транспортных инфраструктур",
                  "value": "003002000090"
                },
                {
                  "title": "Земельные участки для обеспечения обороны",
                  "value": "003002000110"
                },
                {
                  "title": "Земельные участки для обеспечения безопасности",
                  "value": "003002000120"
                },
                {
                  "title": "Земельные участки для обеспечения таможенных нужд",
                  "value": "003002000130"
                },
                {
                  "title": "Прочие земельные участки",
                  "value": "003002000100"
                },
                {
                  "title": "Земли промышленности, энергетики, транспорта, связи, радиовещания, телевидения, информатики, земли для обеспечения космической деятельности, земли обороны, безопасности и земли иного специального назначения",
                  "value": "003003000000"
                },
                {
                  "title": "Земельные участки из состава земель промышленности",
                  "value": "003003000010"
                },
                {
                  "title": "Земельные участки из состава земель энергетики",
                  "value": "003003000020"
                },
                {
                  "title": "Земельные участки из состава земель транспорта",
                  "value": "003003000030"
                },
                {
                  "title": "Земельные участки из состава земель связи, радиовещания, телевидения, информатики",
                  "value": "003003000040"
                },
                {
                  "title": "Земельные участки из состава земель обороны",
                  "value": "003003000060"
                },
                {
                  "title": "Земельные участки из состава земель безопасности",
                  "value": "003003000070"
                },
                {
                  "title": "Земельные участки из состава земель для обеспечения таможенных нужд",
                  "value": "003008000010"
                },
                {
                  "title": "Земельные участки из состава земель иного специального назначения",
                  "value": "003003000080"
                },
                {
                  "title": "Земли особо охраняемых территорий и объектов",
                  "value": "003004000000"
                },
                {
                  "title": "Земли лесного фонда",
                  "value": "003005000000"
                },
                {
                  "title": "Земли водного фонда",
                  "value": "003006000000"
                },
                {
                  "title": "Земли запаса",
                  "value": "003007000000"
                },
                {
                  "title": "Земельные участки, для которых категория земель не установлена",
                  "value": "003008000000"
                }
              ]
            },
            {
              "name": "category",
              "title": "Категория Земельного участка",
              "valueType": "STRING"
            },
            {
              "name": "raddress",
              "title": "Адрес в соответствии с ФИАС",
              "valueType": "STRING"
            },
            {
              "name": "otypecode",
              "title": "Вид объекта недвижимости (код)",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Объекты учёта и регистрации",
                  "value": "002001000000"
                },
                {
                  "title": "Земельный участок",
                  "value": "002001001000"
                },
                {
                  "title": "Здание",
                  "value": "002001002000"
                },
                {
                  "title": "Помещение",
                  "value": "002001003000"
                },
                {
                  "title": "Сооружение",
                  "value": "002001004000"
                },
                {
                  "title": "Линейное сооружение, расположенное более чем в одном кадастровом округе",
                  "value": "002001004001"
                },
                {
                  "title": "Условная часть линейного сооружения",
                  "value": "002001004002"
                },
                {
                  "title": "Объект незавершённого строительства",
                  "value": "002001005000"
                },
                {
                  "title": "Предприятие как имущественный комплекс (ПИК)",
                  "value": "002001006000"
                },
                {
                  "title": "Участок недр",
                  "value": "002001007000"
                },
                {
                  "title": "Единый недвижимый комплекс",
                  "value": "002001008000"
                },
                {
                  "title": "Границы",
                  "value": "002002000000"
                },
                {
                  "title": "Государственная граница Российской Федерации",
                  "value": "002002001000"
                },
                {
                  "title": "Граница между субъектами Российской Федерации",
                  "value": "002002002000"
                },
                {
                  "title": "Граница муниципального образования",
                  "value": "002002003000"
                },
                {
                  "title": "Граница населённого пункта",
                  "value": "002002004000"
                },
                {
                  "title": "Зоны",
                  "value": "002003000000"
                },
                {
                  "title": "Зона с особыми условиями использования территорий",
                  "value": "002003001000"
                },
                {
                  "title": "Территориальная зона",
                  "value": "002003002000"
                },
                {
                  "title": "Особая экономическая зона",
                  "value": "002003003000"
                },
                {
                  "title": "Территория объекта культурного наследия",
                  "value": "002004000000"
                }
              ]
            },
            {
              "name": "objecttype",
              "title": "Вид объекта недвижимости",
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "ptypecode",
              "title": "Вид земельного участка (код)",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Землепользование",
                  "value": "01"
                },
                {
                  "title": "Единое землепользование",
                  "value": "02"
                },
                {
                  "title": "Обособленный участок",
                  "value": "03"
                },
                {
                  "title": "Условный участок",
                  "value": "04"
                },
                {
                  "title": "Многоконтурный участок",
                  "value": "05"
                },
                {
                  "title": "Значение отсутствует",
                  "value": "06"
                }
              ]
            },
            {
              "name": "parceltype",
              "title": "Вид Земельного участка",
              "valueType": "STRING"
            },
            {
              "name": "rdate",
              "title": "Дата постановки на учет/ регистрации",
              "valueType": "DATETIME"
            },
            {
              "name": "cdate",
              "title": "Дата снятия с учета/регистрации",
              "valueType": "DATETIME"
            },
            {
              "name": "area_doc",
              "title": "Площадь, м.кв.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 8
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
WHERE name = 'lease_buffer';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "municipal",
          "tags": [
            "system",
            "Сан. очистка (ДГХ)"
          ],
          "name": "municipal",
          "title": "Муниципальная собственность",
          "tableName": "municipal",
          "originName": "municipal",
          "properties": [
            {
              "name": "cad_num",
              "title": "Кадастровый номер",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "num_zu",
              "title": "Номер ЗУ",
              "hidden": true,
              "required": true,
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "landuser",
              "title": "Землепользователь",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "usage",
              "title": "Разрешенное использование",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "landuse",
              "title": "Вид разрешенного использования",
              "hidden": true,
              "required": true,
              "valueType": "TEXT"
            },
            {
              "name": "ccode",
              "title": "Категория землепользования (код)",
              "hidden": true,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Земли сельскохозяйственного назначения",
                  "value": "003001000000"
                },
                {
                  "title": "Сельскохозяйственные угодья",
                  "value": "003001000010"
                },
                {
                  "title": "Земельные участки, занятые внутрихозяйственными дорогами, коммуникациями, лесными насаждениями, предназначенными для обеспечения защиты земель от негативного воздействия, водными объектами, а также занятые зданиями, сооружениями, используемыми для производства, хранения и первичной переработки сельскохозяйственной продукции",
                  "value": "003001000020"
                },
                {
                  "title": "Прочие земельные участки из состава земель сельскохозяйственного назначения",
                  "value": "003001000030"
                },
                {
                  "title": "Земли населенных пунктов",
                  "value": "003002000000"
                },
                {
                  "title": "Земельные участки, отнесенные к зонам сельскохозяйственного использования",
                  "value": "003002000010"
                },
                {
                  "title": "Земельные участки, занятые жилищным фондом и объектами инженерной инфраструктуры жилищно-коммунального комплекса",
                  "value": "003002000020"
                },
                {
                  "title": "Земельные участки, приобретенные (предоставленные) для индивидуального жилищного строительства",
                  "value": "003002000030"
                },
                {
                  "title": "Земельные участки, приобретенные (предоставленные) на условиях осуществления на них жилищного строительства (за исключением индивидуального жилищного строительства)",
                  "value": "003002000040"
                },
                {
                  "title": "Земельные участки, приобретенные (предоставленные) для ведения личного подсобного хозяйства, садоводства и огородничества или животноводства, а также дачного хозяйства",
                  "value": "003002000060"
                },
                {
                  "title": "Земельные участки, отнесенные к производственным территориальным зонам и зонам инженерных и транспортных инфраструктур",
                  "value": "003002000090"
                },
                {
                  "title": "Земельные участки для обеспечения обороны",
                  "value": "003002000110"
                },
                {
                  "title": "Земельные участки для обеспечения безопасности",
                  "value": "003002000120"
                },
                {
                  "title": "Земельные участки для обеспечения таможенных нужд",
                  "value": "003002000130"
                },
                {
                  "title": "Прочие земельные участки",
                  "value": "003002000100"
                },
                {
                  "title": "Земли промышленности, энергетики, транспорта, связи, радиовещания, телевидения, информатики, земли для обеспечения космической деятельности, земли обороны, безопасности и земли иного специального назначения",
                  "value": "003003000000"
                },
                {
                  "title": "Земельные участки из состава земель промышленности",
                  "value": "003003000010"
                },
                {
                  "title": "Земельные участки из состава земель энергетики",
                  "value": "003003000020"
                },
                {
                  "title": "Земельные участки из состава земель транспорта",
                  "value": "003003000030"
                },
                {
                  "title": "Земельные участки из состава земель связи, радиовещания, телевидения, информатики",
                  "value": "003003000040"
                },
                {
                  "title": "Земельные участки из состава земель обороны",
                  "value": "003003000060"
                },
                {
                  "title": "Земельные участки из состава земель безопасности",
                  "value": "003003000070"
                },
                {
                  "title": "Земельные участки из состава земель для обеспечения таможенных нужд",
                  "value": "003008000010"
                },
                {
                  "title": "Земельные участки из состава земель иного специального назначения",
                  "value": "003003000080"
                },
                {
                  "title": "Земли особо охраняемых территорий и объектов",
                  "value": "003004000000"
                },
                {
                  "title": "Земли лесного фонда",
                  "value": "003005000000"
                },
                {
                  "title": "Земли водного фонда",
                  "value": "003006000000"
                },
                {
                  "title": "Земли запаса",
                  "value": "003007000000"
                },
                {
                  "title": "Земельные участки, для которых категория земель не установлена",
                  "value": "003008000000"
                }
              ]
            },
            {
              "name": "category",
              "title": "Категория Земельного участка",
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "raddress",
              "title": "Адрес в соответствии с ФИАС",
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "otypecode",
              "title": "Вид объекта недвижимости (код)",
              "hidden": true,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Объекты учёта и регистрации",
                  "value": "002001000000"
                },
                {
                  "title": "Земельный участок",
                  "value": "002001001000"
                },
                {
                  "title": "Здание",
                  "value": "002001002000"
                },
                {
                  "title": "Помещение",
                  "value": "002001003000"
                },
                {
                  "title": "Сооружение",
                  "value": "002001004000"
                },
                {
                  "title": "Линейное сооружение, расположенное более чем в одном кадастровом округе",
                  "value": "002001004001"
                },
                {
                  "title": "Условная часть линейного сооружения",
                  "value": "002001004002"
                },
                {
                  "title": "Объект незавершённого строительства",
                  "value": "002001005000"
                },
                {
                  "title": "Предприятие как имущественный комплекс (ПИК)",
                  "value": "002001006000"
                },
                {
                  "title": "Участок недр",
                  "value": "002001007000"
                },
                {
                  "title": "Единый недвижимый комплекс",
                  "value": "002001008000"
                },
                {
                  "title": "Границы",
                  "value": "002002000000"
                },
                {
                  "title": "Государственная граница Российской Федерации",
                  "value": "002002001000"
                },
                {
                  "title": "Граница между субъектами Российской Федерации",
                  "value": "002002002000"
                },
                {
                  "title": "Граница муниципального образования",
                  "value": "002002003000"
                },
                {
                  "title": "Граница населённого пункта",
                  "value": "002002004000"
                },
                {
                  "title": "Зоны",
                  "value": "002003000000"
                },
                {
                  "title": "Зона с особыми условиями использования территорий",
                  "value": "002003001000"
                },
                {
                  "title": "Территориальная зона",
                  "value": "002003002000"
                },
                {
                  "title": "Особая экономическая зона",
                  "value": "002003003000"
                },
                {
                  "title": "Территория объекта культурного наследия",
                  "value": "002004000000"
                }
              ]
            },
            {
              "name": "objecttype",
              "title": "Вид объекта недвижимости",
              "hidden": true,
              "required": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "ptypecode",
              "title": "Вид земельного участка (код)",
              "hidden": true,
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Землепользование",
                  "value": "01"
                },
                {
                  "title": "Единое землепользование",
                  "value": "02"
                },
                {
                  "title": "Обособленный участок",
                  "value": "03"
                },
                {
                  "title": "Условный участок",
                  "value": "04"
                },
                {
                  "title": "Многоконтурный участок",
                  "value": "05"
                },
                {
                  "title": "Значение отсутствует",
                  "value": "06"
                }
              ]
            },
            {
              "name": "parceltype",
              "title": "Вид Земельного участка",
              "hidden": true,
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "rdate",
              "title": "Дата постановки на учет/ регистрации",
              "hidden": true,
              "required": true,
              "valueType": "DATETIME"
            },
            {
              "name": "cdate",
              "title": "Дата снятия с учета/регистрации",
              "hidden": true,
              "required": true,
              "valueType": "DATETIME"
            },
            {
              "name": "cost",
              "title": "Кадастровая стоимость",
              "hidden": true,
              "required": true,
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 8
            },
            {
              "name": "area_doc",
              "title": "Площадь по документу",
              "required": true,
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 8
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
WHERE name = 'municipal';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "red_lines_2019",
          "tags": [
            "system",
            "Сан. очистка (ДГХ)"
          ],
          "name": "red_lines_2019",
          "title": "Красные линии 2019",
          "tableName": "red_lines_2019",
          "originName": "red_lines_2019",
          "properties": [
            {
              "name": "status",
              "title": "Статус объекта",
              "maxLength": 50,
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
                "LineString"
              ]
            }
          ],
          "geometryType": "MultiLineString"
        }'
WHERE name = 'red_lines_2019';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "responsible",
          "tags": [
            "system",
            "Сан. очистка (ДГХ)"
          ],
          "name": "responsible",
          "title": "Ответственные",
          "tableName": "responsible",
          "originName": "responsible",
          "properties": [
            {
              "name": "responsi_1",
              "title": "Отвественный",
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "cad_num",
              "title": "Кадастровый номер",
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "landuser",
              "title": "Землепользователь",
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "tenant",
              "title": "Арендатор",
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "usage",
              "title": "Вид разрешенного использования",
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "usefact",
              "title": "Фактическое использование",
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "area",
              "title": "Площадь м. кв.",
              "maxLength": 3,
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 2
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
          "geometryType": "MultiPolygon"
        }'
WHERE name = 'responsible';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "zu_buffer",
          "tags": [
            "system",
            "Сан. очистка (ДГХ)"
          ],
          "name": "zu_buffer",
          "title": "10-тиметровая зона вокруг земельных участков",
          "tableName": "zu_buffer",
          "originName": "zu_buffer",
          "properties": [
            {
              "name": "cad_num",
              "title": "Кадастровый номер",
              "maxLength": 50,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "num_zu",
              "title": "Номер ЗУ",
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "tenant",
              "title": "Землепользователь",
              "valueType": "STRING"
            },
            {
              "name": "usage",
              "title": "Разрешенное использование",
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "landuse",
              "title": "Вид разрешенного использования",
              "valueType": "TEXT"
            },
            {
              "name": "ccode",
              "title": "Категория землепользования (код)",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Земли сельскохозяйственного назначения",
                  "value": "003001000000"
                },
                {
                  "title": "Сельскохозяйственные угодья",
                  "value": "003001000010"
                },
                {
                  "title": "Земельные участки, занятые внутрихозяйственными дорогами, коммуникациями, лесными насаждениями, предназначенными для обеспечения защиты земель от негативного воздействия, водными объектами, а также занятые зданиями, сооружениями, используемыми для производства, хранения и первичной переработки сельскохозяйственной продукции",
                  "value": "003001000020"
                },
                {
                  "title": "Прочие земельные участки из состава земель сельскохозяйственного назначения",
                  "value": "003001000030"
                },
                {
                  "title": "Земли населенных пунктов",
                  "value": "003002000000"
                },
                {
                  "title": "Земельные участки, отнесенные к зонам сельскохозяйственного использования",
                  "value": "003002000010"
                },
                {
                  "title": "Земельные участки, занятые жилищным фондом и объектами инженерной инфраструктуры жилищно-коммунального комплекса",
                  "value": "003002000020"
                },
                {
                  "title": "Земельные участки, приобретенные (предоставленные) для индивидуального жилищного строительства",
                  "value": "003002000030"
                },
                {
                  "title": "Земельные участки, приобретенные (предоставленные) на условиях осуществления на них жилищного строительства (за исключением индивидуального жилищного строительства)",
                  "value": "003002000040"
                },
                {
                  "title": "Земельные участки, приобретенные (предоставленные) для ведения личного подсобного хозяйства, садоводства и огородничества или животноводства, а также дачного хозяйства",
                  "value": "003002000060"
                },
                {
                  "title": "Земельные участки, отнесенные к производственным территориальным зонам и зонам инженерных и транспортных инфраструктур",
                  "value": "003002000090"
                },
                {
                  "title": "Земельные участки для обеспечения обороны",
                  "value": "003002000110"
                },
                {
                  "title": "Земельные участки для обеспечения безопасности",
                  "value": "003002000120"
                },
                {
                  "title": "Земельные участки для обеспечения таможенных нужд",
                  "value": "003002000130"
                },
                {
                  "title": "Прочие земельные участки",
                  "value": "003002000100"
                },
                {
                  "title": "Земли промышленности, энергетики, транспорта, связи, радиовещания, телевидения, информатики, земли для обеспечения космической деятельности, земли обороны, безопасности и земли иного специального назначения",
                  "value": "003003000000"
                },
                {
                  "title": "Земельные участки из состава земель промышленности",
                  "value": "003003000010"
                },
                {
                  "title": "Земельные участки из состава земель энергетики",
                  "value": "003003000020"
                },
                {
                  "title": "Земельные участки из состава земель транспорта",
                  "value": "003003000030"
                },
                {
                  "title": "Земельные участки из состава земель связи, радиовещания, телевидения, информатики",
                  "value": "003003000040"
                },
                {
                  "title": "Земельные участки из состава земель обороны",
                  "value": "003003000060"
                },
                {
                  "title": "Земельные участки из состава земель безопасности",
                  "value": "003003000070"
                },
                {
                  "title": "Земельные участки из состава земель для обеспечения таможенных нужд",
                  "value": "003008000010"
                },
                {
                  "title": "Земельные участки из состава земель иного специального назначения",
                  "value": "003003000080"
                },
                {
                  "title": "Земли особо охраняемых территорий и объектов",
                  "value": "003004000000"
                },
                {
                  "title": "Земли лесного фонда",
                  "value": "003005000000"
                },
                {
                  "title": "Земли водного фонда",
                  "value": "003006000000"
                },
                {
                  "title": "Земли запаса",
                  "value": "003007000000"
                },
                {
                  "title": "Земельные участки, для которых категория земель не установлена",
                  "value": "003008000000"
                }
              ]
            },
            {
              "name": "category",
              "title": "Категория Земельного участка",
              "valueType": "STRING"
            },
            {
              "name": "raddress",
              "title": "Адрес в соответствии с ФИАС",
              "valueType": "STRING"
            },
            {
              "name": "otypecode",
              "title": "Вид объекта недвижимости (код)",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Объекты учёта и регистрации",
                  "value": "002001000000"
                },
                {
                  "title": "Земельный участок",
                  "value": "002001001000"
                },
                {
                  "title": "Здание",
                  "value": "002001002000"
                },
                {
                  "title": "Помещение",
                  "value": "002001003000"
                },
                {
                  "title": "Сооружение",
                  "value": "002001004000"
                },
                {
                  "title": "Линейное сооружение, расположенное более чем в одном кадастровом округе",
                  "value": "002001004001"
                },
                {
                  "title": "Условная часть линейного сооружения",
                  "value": "002001004002"
                },
                {
                  "title": "Объект незавершённого строительства",
                  "value": "002001005000"
                },
                {
                  "title": "Предприятие как имущественный комплекс (ПИК)",
                  "value": "002001006000"
                },
                {
                  "title": "Участок недр",
                  "value": "002001007000"
                },
                {
                  "title": "Единый недвижимый комплекс",
                  "value": "002001008000"
                },
                {
                  "title": "Границы",
                  "value": "002002000000"
                },
                {
                  "title": "Государственная граница Российской Федерации",
                  "value": "002002001000"
                },
                {
                  "title": "Граница между субъектами Российской Федерации",
                  "value": "002002002000"
                },
                {
                  "title": "Граница муниципального образования",
                  "value": "002002003000"
                },
                {
                  "title": "Граница населённого пункта",
                  "value": "002002004000"
                },
                {
                  "title": "Зоны",
                  "value": "002003000000"
                },
                {
                  "title": "Зона с особыми условиями использования территорий",
                  "value": "002003001000"
                },
                {
                  "title": "Территориальная зона",
                  "value": "002003002000"
                },
                {
                  "title": "Особая экономическая зона",
                  "value": "002003003000"
                },
                {
                  "title": "Территория объекта культурного наследия",
                  "value": "002004000000"
                }
              ]
            },
            {
              "name": "objecttype",
              "title": "Вид объекта недвижимости",
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "ptypecode",
              "title": "Вид земельного участка (код)",
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Землепользование",
                  "value": "01"
                },
                {
                  "title": "Единое землепользование",
                  "value": "02"
                },
                {
                  "title": "Обособленный участок",
                  "value": "03"
                },
                {
                  "title": "Условный участок",
                  "value": "04"
                },
                {
                  "title": "Многоконтурный участок",
                  "value": "05"
                },
                {
                  "title": "Значение отсутствует",
                  "value": "06"
                }
              ]
            },
            {
              "name": "parceltype",
              "title": "Вид Земельного участка",
              "valueType": "STRING"
            },
            {
              "name": "rdate",
              "title": "Дата постановки на учет/ регистрации",
              "valueType": "DATETIME"
            },
            {
              "name": "cdate",
              "title": "Дата снятия с учета/регистрации",
              "valueType": "DATETIME"
            },
            {
              "name": "area_doc",
              "title": "Площадь, м.кв.",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 8
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
WHERE name = 'zu_buffer';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "garbage_containers",
          "tags": [
            "system",
            "Сан. очистка (ДГХ)"
          ],
          "name": "garbage_containers",
          "title": "Контейнерные площадки",
          "tableName": "garbage_containers",
          "originName": "garbage_containers",
          "properties": [
            {
              "name": "classid",
              "title": "Код объекта",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Контейнерые площадки",
                  "value": "50101001"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "contnumpl",
              "title": "Количество контейнеров планируемое",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "contnumact",
              "title": "Количество контейнеров фактическое",
              "required": true,
              "valueType": "STRING",
              "asTitle": true
            },
            {
              "name": "location",
              "title": "Место расположения площадки",
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "landsctype",
              "title": "Тип площадки (благоустройство)",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Благоустроена",
                  "value": "1"
                },
                {
                  "title": "Благоустроена, требует ремонта",
                  "value": "2"
                },
                {
                  "title": "Не благоустроена",
                  "value": "3"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "enttype",
              "title": "Тип площадки (подход)",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Асфальт",
                  "value": "1"
                },
                {
                  "title": "Щебень",
                  "value": "2"
                },
                {
                  "title": "Бетон",
                  "value": "3"
                },
                {
                  "title": "Бетонный экран",
                  "value": "4"
                },
                {
                  "title": "Выкатной",
                  "value": "5"
                },
                {
                  "title": "Грунтовка",
                  "value": "6"
                },
                {
                  "title": "На проезжей части",
                  "value": "7"
                },
                {
                  "title": "Твердое покрытие",
                  "value": "8"
                },
                {
                  "title": "Подход отсутствует",
                  "value": "9"
                }
              ],
              "foreignKeyType": "STRING"
            },
            {
              "name": "notes",
              "title": "Примечания",
              "required": true,
              "valueType": "TEXT",
              "asTitle": true
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Point"
              ]
            }
          ],
          "geometryType": "Point"
        }'
WHERE name = 'garbage_containers';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "garbage_responsible",
          "tags": [
            "system",
            "Сан. очистка (ДГХ)"
          ],
          "name": "garbage_responsible",
          "title": "Ответственные по уборке ",
          "tableName": "garbage_responsible",
          "originName": "garbage_responsible",
          "properties": [
            {
              "name": "classid",
              "title": "Код объекта»",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "МУП Аванград",
                  "value": "50103001"
                },
                {
                  "title": "МУП Железнодорожный ЖС",
                  "value": "50103002"
                },
                {
                  "title": "МУП Киевский ЖС",
                  "value": "50103003"
                },
                {
                  "title": "МУП Центральный ЖС",
                  "value": "50103004"
                },
                {
                  "title": "МБУ Город",
                  "value": "50103005"
                },
                {
                  "title": "ТСЖ и прочие",
                  "value": "50103006"
                }
              ]
            },
            {
              "name": "cleantime",
              "title": "Время уборки",
              "maxLength": 30,
              "valueType": "STRING"
            },
            {
              "name": "source",
              "title": "Источник данных",
              "valueType": "STRING"
            },
            {
              "name": "jannumb",
              "title": "Количество дворников",
              "maxLength": 2,
              "valueType": "STRING"
            },
            {
              "name": "location",
              "title": "Местоположение, адресное описание",
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "compname",
              "title": "Наименование управляющей компании",
              "required": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "supervisor",
              "title": "Начальник на участке",
              "required": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "yardkeeper",
              "title": "Ответственное лицо",
              "required": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "cleanrange",
              "title": "Периодичность уборки",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Ежедневно",
                  "value": "1"
                },
                {
                  "title": "1 раз в год",
                  "value": "2"
                },
                {
                  "title": "1 раз в месяц",
                  "value": "3"
                },
                {
                  "title": "1 раз в неделю",
                  "value": "4"
                },
                {
                  "title": "2 раза в год",
                  "value": "5"
                },
                {
                  "title": "2 раза в месяц",
                  "value": "6"
                },
                {
                  "title": "2 раза в неделю",
                  "value": "7"
                },
                {
                  "title": "3 раза в месяц",
                  "value": "8"
                },
                {
                  "title": "3 раза в неделю",
                  "value": "9"
                },
                {
                  "title": "4 раза в месяц",
                  "value": "10"
                },
                {
                  "title": "4 раза в неделю",
                  "value": "11"
                },
                {
                  "title": "5 раз в неделю",
                  "value": "12"
                },
                {
                  "title": "6 раз в год",
                  "value": "13"
                },
                {
                  "title": "Не установлена",
                  "value": "14"
                }
              ]
            },
            {
              "name": "area",
              "title": "Площадь, кв.м.",
              "required": true,
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 8
            },
            {
              "name": "length",
              "title": "Протяженность, м",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 8
            },
            {
              "name": "cleanmet",
              "title": "Способ уборки",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Ручная",
                  "value": "1"
                },
                {
                  "title": "Механическая",
                  "value": "2"
                }
              ]
            },
            {
              "name": "population",
              "title": "Численность населения",
              "valueType": "DOUBLE",
              "totalDigits": 38,
              "fractionDigits": 8
            },
            {
              "name": "notes",
              "title": "Примечания",
              "valueType": "TEXT"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "Point"
              ]
            }
          ],
          "geometryType": "Point"
        }'
WHERE name = 'garbage_responsible';

UPDATE data.schemas
SET class_rule =
        '{
          "styleName": "streets_cleaning",
          "tags": [
            "system",
            "Сан. очистка (ДГХ)"
          ],
          "name": "streets_cleaning",
          "title": "Ответственные по уборке (улицы)",
          "tableName": "streets_cleaning",
          "originName": "streets_cleaning",
          "properties": [
            {
              "name": "classid",
              "title": "Код объекта»",
              "required": true,
              "valueType": "CHOICE",
              "enumerations": [
                {
                  "title": "Ответственные по уборке (улицы)",
                  "value": "50105001"
                }
              ]
            },
            {
              "name": "streetname",
              "title": "Название улицы",
              "required": true,
              "maxLength": 50,
              "valueType": "STRING"
            },
            {
              "name": "plotnumb",
              "title": "Номер участка",
              "required": true,
              "maxLength": 2,
              "valueType": "STRING"
            },
            {
              "name": "deputy",
              "title": "Ответственный от администрации (заместитель главы)",
              "required": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "yardkeeper",
              "title": "Ответственный по контролю за содержанием (дворник)",
              "required": true,
              "valueType": "STRING"
            },
            {
              "name": "supervisor",
              "title": "Ответственный по контролю за содержанием (мастер)",
              "required": true,
              "maxLength": 100,
              "valueType": "STRING"
            },
            {
              "name": "notes",
              "title": "Примечания",
              "valueType": "TEXT"
            },
            {
              "name": "shape",
              "title": "Геометрия",
              "valueType": "GEOMETRY",
              "allowedValues": [
                "LineString"
              ]
            }
          ],
          "geometryType": "MultiLineString"
        }'
WHERE name = 'streets_cleaning';
