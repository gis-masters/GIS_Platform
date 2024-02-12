INSERT INTO data.schemas (name, class_rule)
SELECT 'nto',
    '{
    "tags": [
        "system",
        "НТО"
    ],
    "name": "nto",
    "title": "Нестационарные торговые объекты города Севастополь",
    "styleName": "polygon_nto",
    "tableName": "polygon_nto",
    "originName": "polygon_nto",
    "properties": [
        {
            "name": "number",
            "title": "Номер места на карте",
            "valueType": "STRING"
        },
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
                },
                {
                    "title": "Яйцо",
                    "value": "311330000"
                }
            ]
        },
        {
            "name": "region",
            "title": "Районы Севастополя",
            "valueType": "CHOICE",
            "enumerations": [
                {
                    "title": "Нахимовский ВМО (Северная сторона)",
                    "value": "Нахимовский ВМО (Северная сторона)"
                },
                {
                    "title": "Гагаринский ВМО",
                    "value": "Гагаринский ВМО"
                },
                {
                    "title": "Ленинский ВМО",
                    "value": "Ленинский ВМО"
                },
                {
                    "title": "Балаклавский ВМО",
                    "value": "Балаклавский ВМО"
                },
                {
                    "title": "Орлиновский ВМО",
                    "value": "Орлиновский ВМО"
                },
                {
                    "title": "Терновский ВМО",
                    "value": "Терновский ВМО"
                },
                {
                    "title": "Верхнесадов-ский ВМО",
                    "value": "Верхнесадов-ский ВМО"
                },
                {
                    "title": "Качинский ВМО",
                    "value": "Качинский ВМО"
                },
                {
                    "title": "Андреевский ВМО",
                    "value": "Андреевский ВМО"
                },
                {
                    "title": "Инкерманский ВМО",
                    "value": "Инкерманский ВМО"
                },
                {
                    "title": "Нахимовский ВМО",
                    "value": "Нахимовский ВМО"
                }
            ]
        },
        {
            "name": "city",
            "title": "Населенный пункт",
            "valueType": "STRING"
        },
        {
            "name": "street",
            "title": "Улица",
            "valueType": "STRING"
        },
        {
            "name": "home",
            "title": "Номер дома",
            "valueType": "STRING"
        },
        {
            "name": "nto_type",
            "title": "Тип НТО",
            "asTitle": true,
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
                    "title": "презентацион-ная стойка",
                    "value": "презентацион-ная стойка"
                }
            ]
        },
        {
            "name": "specialisa",
            "title": "Специализация НТО",
            "valueType": "STRING"
        },
        {
            "name": "season",
            "title": "Период функционирования НТО",
            "valueType": "STRING"
        },
        {
            "name": "area",
            "title": "Площадь места размещения НТО, кв. м",
            "valueType": "DOUBLE",
            "description": "Площадь автовычисляемая",
            "fractionDigits": 2
        },
        {
            "name": "area_fact",
            "title": "Фактическая площадь, кв. м",
            "hidden": true,
            "valueType": "DOUBLE",
            "description": "Фактическая площадь основания окса",
            "fractionDigits": 2
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
            "title": "Фотоматериалы существующего НТО",
            "maxSize": 50000000,
            "multiple": true,
            "valueType": "FILE"
        },
        {
            "name": "doc_nto",
            "title": "Планируемый внешний вид НТО",
            "maxSize": 50000000,
            "multiple": true,
            "valueType": "FILE"
        },
        {
            "name": "nones",
            "title": "Примечание",
            "valueType": "TEXT"
        },
        {
            "name": "territory",
            "title": "Территория",
            "valueType": "STRING"
        },
        {
            "name": "created_by",
            "title": "Создатель",
            "hidden": true,
            "maxLength": 50,
            "valueType": "STRING"
        },
        {
            "name": "created_at",
            "title": "Дата создания",
            "hidden": true,
            "valueType": "DATETIME"
        },
        {
            "name": "last_modified",
            "title": "Дата последней модификации",
            "hidden": true,
            "valueType": "DATETIME"
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
    "description": "Нестационарные торговые объекты города Севастополь",
    "geometryType": "MultiPolygon"
}'
WHERE NOT EXISTS( SELECT id FROM data.schemas WHERE name = 'nto');

INSERT INTO data.schemas (name, class_rule)
SELECT 'polygon_nto',
    '{
    "tags": [
        "system",
        "НТО"
    ],
    "name": "polygon_nto",
    "title": "Нестационарные торговые объекты города Севастополь",
    "styleName": "polygon_nto",
    "tableName": "polygon_nto",
    "originName": "polygon_nto",
    "properties": [
        {
            "name": "number",
            "title": "Номер места на карте",
            "valueType": "STRING"
        },
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
                },
                {
                    "title": "Яйцо",
                    "value": "311330000"
                }
            ]
        },
        {
            "name": "region",
            "title": "Районы Севастополя",
            "valueType": "CHOICE",
            "enumerations": [
                {
                    "title": "Нахимовский ВМО (Северная сторона)",
                    "value": "Нахимовский ВМО (Северная сторона)"
                },
                {
                    "title": "Гагаринский ВМО",
                    "value": "Гагаринский ВМО"
                },
                {
                    "title": "Ленинский ВМО",
                    "value": "Ленинский ВМО"
                },
                {
                    "title": "Балаклавский ВМО",
                    "value": "Балаклавский ВМО"
                },
                {
                    "title": "Орлиновский ВМО",
                    "value": "Орлиновский ВМО"
                },
                {
                    "title": "Терновский ВМО",
                    "value": "Терновский ВМО"
                },
                {
                    "title": "Верхнесадов-ский ВМО",
                    "value": "Верхнесадов-ский ВМО"
                },
                {
                    "title": "Качинский ВМО",
                    "value": "Качинский ВМО"
                },
                {
                    "title": "Андреевский ВМО",
                    "value": "Андреевский ВМО"
                },
                {
                    "title": "Инкерманский ВМО",
                    "value": "Инкерманский ВМО"
                },
                {
                    "title": "Нахимовский ВМО",
                    "value": "Нахимовский ВМО"
                }
            ]
        },
        {
            "name": "city",
            "title": "Населенный пункт",
            "valueType": "STRING"
        },
        {
            "name": "street",
            "title": "Улица",
            "valueType": "STRING"
        },
        {
            "name": "home",
            "title": "Номер дома",
            "valueType": "STRING"
        },
        {
            "name": "nto_type",
            "title": "Тип НТО",
            "asTitle": true,
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
                    "title": "презентацион-ная стойка",
                    "value": "презентацион-ная стойка"
                }
            ]
        },
        {
            "name": "specialisa",
            "title": "Специализация НТО",
            "valueType": "STRING"
        },
        {
            "name": "season",
            "title": "Период функционирования НТО",
            "valueType": "STRING"
        },
        {
            "name": "area",
            "title": "Площадь места размещения НТО, кв. м",
            "valueType": "DOUBLE",
            "description": "Площадь автовычисляемая",
            "fractionDigits": 2
        },
        {
            "name": "area_fact",
            "title": "Фактическая площадь, кв. м",
            "hidden": true,
            "valueType": "DOUBLE",
            "description": "Фактическая площадь основания окса",
            "fractionDigits": 2
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
            "title": "Фотоматериалы существующего НТО",
            "maxSize": 50000000,
            "multiple": true,
            "valueType": "FILE"
        },
        {
            "name": "doc_nto",
            "title": "Планируемый внешний вид НТО",
            "maxSize": 50000000,
            "multiple": true,
            "valueType": "FILE"
        },
        {
            "name": "nones",
            "title": "Примечание",
            "valueType": "TEXT"
        },
        {
            "name": "created_by",
            "title": "Создатель",
            "hidden": true,
            "maxLength": 50,
            "valueType": "STRING"
        },
        {
            "name": "created_at",
            "title": "Дата создания",
            "hidden": true,
            "valueType": "DATETIME"
        },
        {
            "name": "last_modified",
            "title": "Дата последней модификации",
            "hidden": true,
            "valueType": "DATETIME"
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
    "description": "Нестационарные торговые объекты города Севастополь",
    "geometryType": "MultiPolygon"
}'
WHERE NOT EXISTS( SELECT id FROM data.schemas WHERE name = 'polygon_nto');

INSERT INTO data.schemas (name, class_rule)
SELECT 'trading_point_dobrovskoe',
    '{
    "styleName": "trading_point_dobrovskoe",
    "tags": [
        "system",
        "НТО"
    ],
    "name": "trading_point_dobrovskoe",
    "title": "Нестационарные торговые объекты",
    "tableName": "trading_point_dobrovskoe",
    "originName": "trading_point_dobrovskoe",
    "properties": [
        {
            "name": "classid",
            "title": "Код объекта",
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
                },
                {
                    "title": "Яйцо",
                    "value": "311330000"
                }
            ],
            "foreignKeyType": "STRING",
            "asTitle": true
        },
        {
            "name": "trade_numb",
            "title": "Номер на схеме",
            "required": true,
            "maxLength": 10,
            "valueType": "STRING"
        },
        {
            "name": "address",
            "title": "Местоположение (адресное описание)",
            "required": true,
            "valueType": "STRING"
        },
        {
            "name": "trade_type",
            "title": "Тип торгового объекта",
            "required": true,
            "valueType": "CHOICE",
            "enumerations": [
                {
                    "title": "Иные нестационарные объекты",
                    "value": "Иные нестационарные объекты"
                },
                {
                    "title": "Киоск",
                    "value": "Киоск"
                },
                {
                    "title": "Конструкция для реализации кваса",
                    "value": "Конструкция для реализации кваса"
                },
                {
                    "title": "Конструкция для реализации напитков, мороженого",
                    "value": "Конструкция для реализации напитков, мороженого"
                },
                {
                    "title": "Летняя площадка",
                    "value": "Летняя площадка"
                },
                {
                    "title": "Металлическая конструкция",
                    "value": "Металлическая конструкция"
                },
                {
                    "title": "Палатка",
                    "value": "Палатка"
                },
                {
                    "title": "Специализированная автомашина",
                    "value": "Специализированная автомашина"
                },
                {
                    "title": "Торговый павильон",
                    "value": "Торговый павильон"
                },
                {
                    "title": "Торговый прицеп",
                    "value": "Торговый прицеп"
                },
                {
                    "title": "Трейлер",
                    "value": "Трейлер"
                }
            ],
            "foreignKeyType": "STRING"
        },
        {
            "name": "trade_seas",
            "title": "Период функционирования",
            "maxLength": 20,
            "valueType": "STRING"
        },
        {
            "name": "trade_area",
            "title": "Торговая площадь, кв. м",
            "minWidth": 0,
            "valueType": "DOUBLE",
            "totalDigits": 38,
            "fractionDigits": 2
        },
        {
            "name": "time_work",
            "title": "Режим работы",
            "valueType": "STRING"
        },
        {
            "name": "doc_holder",
            "title": "Наименование юридического лица или индивидуального предпринимателя",
            "required": true,
            "valueType": "STRING"
        },
        {
            "name": "document",
            "title": "Документ-основание",
            "required": true,
            "valueType": "STRING"
        },
        {
            "name": "date_start",
            "title": "Дата выдачи лицензии",
            "required": true,
            "valueType": "DATETIME",
            "dateFormat": "LL"
        },
        {
            "name": "date_close",
            "title": "Дата окончания лицензии",
            "required": true,
            "valueType": "DATETIME",
            "dateFormat": "LL"
        },
        {
            "name": "tel",
            "title": "Контакты (телефон)",
            "maxLength": 10,
            "valueType": "STRING"
        },
        {
            "name": "notes",
            "title": "Примечания",
            "valueType": "TEXT"
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
            "title": "Фотоматериалы",
            "maxSize": 50000000,
            "multiple": true,
            "valueType": "FILE"
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
            "required": true,
            "valueType": "STRING"
        }
    ],
    "description": "Нестационарные торговые объекты",
    "geometryType": "Point"
}'
WHERE NOT EXISTS( SELECT id FROM data.schemas WHERE name = 'trading_point_dobrovskoe');

INSERT INTO data.schemas (name, class_rule)
SELECT 'trading_point_simf_2022',
    '{
    "tags": [
        "system",
        "НТО"
    ],
    "name": "trading_point_simf_2022",
    "title": "Нестационарные торговые объекты города Симферополь",
    "styleName": "trading_point_simf_2022",
    "tableName": "trading_point_simf_2022",
    "originName": "trading_point_simf_2022",
    "properties": [
        {
            "name": "classid",
            "title": "Код объекта",
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
                },
                {
                    "title": "Яйцо",
                    "value": "311330000"
                }
            ],
            "asTitle": true
        },
        {
            "name": "trade_numb",
            "title": "Номер на схеме",
            "maxLength": 10,
            "valueType": "STRING"
        },
        {
            "name": "address",
            "title": "Местоположение (адресное описание)",
            "valueType": "STRING"
        },
        {
            "name": "trade_type",
            "title": "Тип торгового объекта",
            "valueType": "CHOICE",
            "enumerations": [
                {
                    "title": "Иные нестационарные объекты",
                    "value": "Иные нестационарные объекты"
                },
                {
                    "title": "Киоск",
                    "value": "Киоск"
                },
                {
                    "title": "Конструкция для реализации кваса",
                    "value": "Конструкция для реализации кваса"
                },
                {
                    "title": "Конструкция для реализации напитков, мороженого",
                    "value": "Конструкция для реализации напитков, мороженого"
                },
                {
                    "title": "Летняя площадка",
                    "value": "Летняя площадка"
                },
                {
                    "title": "Металлическая конструкция",
                    "value": "Металлическая конструкция"
                },
                {
                    "title": "Палатка",
                    "value": "Палатка"
                },
                {
                    "title": "Специализированная автомашина",
                    "value": "Специализированная автомашина"
                },
                {
                    "title": "Торговый павильон",
                    "value": "Торговый павильон"
                },
                {
                    "title": "Торговый прицеп",
                    "value": "Торговый прицеп"
                },
                {
                    "title": "Трейлер",
                    "value": "Трейлер"
                }
            ]
        },
        {
            "name": "trade_seas",
            "title": "Период функционирования",
            "maxLength": 20,
            "valueType": "STRING"
        },
        {
            "name": "trade_area",
            "title": "Торговая площадь, кв. м",
            "valueType": "DOUBLE",
            "fractionDigits": 2
        },
        {
            "name": "time_work",
            "title": "Режим работы",
            "valueType": "STRING"
        },
        {
            "name": "doc_holder",
            "title": "Наименование юридического лица или индивидуального предпринимателя",
            "valueType": "STRING"
        },
        {
            "name": "document",
            "title": "Документ-основание",
            "valueType": "STRING"
        },
        {
            "name": "date_start",
            "title": "Дата выдачи лицензии",
            "valueType": "DATETIME"
        },
        {
            "name": "date_close",
            "title": "Дата окончания лицензии",
            "valueType": "DATETIME"
        },
        {
            "name": "phone",
            "title": "Контакты (телефон)",
            "maxLength": 10,
            "valueType": "STRING"
        },
        {
            "name": "notes",
            "title": "Примечания",
            "valueType": "TEXT"
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
            "title": "Фотоматериалы",
            "maxSize": 50000000,
            "multiple": true,
            "valueType": "FILE"
        },
        {
            "name": "shape",
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
            "valueType": "STRING"
        }
    ],
    "description": "Нестационарные торговые объекты города Симферополь",
    "geometryType": "Point"
}'
WHERE NOT EXISTS( SELECT id FROM data.schemas WHERE name = 'trading_point_simf_2022');

INSERT INTO data.schemas (name, class_rule)
SELECT 'trading_point_svstpl_2023',
    '{
    "tags": [
        "system",
        "НТО"
    ],
    "name": "trading_point_svstpl_2023",
    "title": "Нестационарные торговые объекты города Севастополь",
    "styleName": "trading_point_simf_2022",
    "tableName": "trading_point_svstpl_2023",
    "originName": "trading_point_svstpl_2023",
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
                },
                {
                    "title": "Яйцо",
                    "value": "311330000"
                }
            ]
        },
        {
            "name": "region",
            "title": "Районы Севастополя",
            "valueType": "CHOICE",
            "enumerations": [
                {
                    "title": "Нахимовский ВМО (Северная сторона)",
                    "value": "Нахимовский ВМО (Северная сторона)"
                },
                {
                    "title": "Гагаринский ВМО",
                    "value": "Гагаринский ВМО"
                },
                {
                    "title": "Ленинский ВМО",
                    "value": "Ленинский ВМО"
                },
                {
                    "title": "Балаклавский ВМО",
                    "value": "Балаклавский ВМО"
                },
                {
                    "title": "Орлиновский ВМО",
                    "value": "Орлиновский ВМО"
                },
                {
                    "title": "Терновский ВМО",
                    "value": "Терновский ВМО"
                },
                {
                    "title": "Верхнесадов-ский ВМО",
                    "value": "Верхнесадов-ский ВМО"
                },
                {
                    "title": "Качинский ВМО",
                    "value": "Качинский ВМО"
                },
                {
                    "title": "Андреевский ВМО",
                    "value": "Андреевский ВМО"
                },
                {
                    "title": "Инкерманский ВМО",
                    "value": "Инкерманский ВМО"
                },
                {
                    "title": "Нахимовский ВМО",
                    "value": "Нахимовский ВМО"
                }
            ]
        },
        {
            "name": "city",
            "title": "Населенный пункт",
            "valueType": "STRING"
        },
        {
            "name": "street",
            "title": "Улица",
            "valueType": "STRING"
        },
        {
            "name": "home",
            "title": "Номер дома",
            "valueType": "STRING"
        },
        {
            "name": "nto_type",
            "title": "Тип НТО",
            "asTitle": true,
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
                    "title": "презентацион-ная стойка",
                    "value": "презентацион-ная стойка"
                }
            ]
        },
        {
            "name": "specialisa",
            "title": "Специализация НТО",
            "valueType": "STRING"
        },
        {
            "name": "season",
            "title": "Период функционирования НТО",
            "maxLength": 20,
            "valueType": "STRING"
        },
        {
            "name": "area",
            "title": "Площадь места размещения НТО, кв. м",
            "hidden": true,
            "valueType": "DOUBLE",
            "fractionDigits": 2
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
            "title": "Фотоматериалы",
            "maxSize": 50000000,
            "multiple": true,
            "valueType": "FILE"
        },
        {
            "name": "doc_nto",
            "title": "Планируемый внешний вид НТО",
            "maxSize": 50000000,
            "multiple": true,
            "valueType": "FILE"
        },
        {
            "name": "nones",
            "title": "Примечание",
            "valueType": "TEXT"
        },
        {
            "name": "created_by",
            "title": "Создатель",
            "hidden": true,
            "maxLength": 50,
            "valueType": "STRING"
        },
        {
            "name": "created_at",
            "title": "Дата создания",
            "hidden": true,
            "valueType": "DATETIME"
        },
        {
            "name": "last_modified",
            "title": "Дата последней модификации",
            "valueType": "DATETIME"
        },
        {
            "name": "updated_by",
            "title": "Кто обновил",
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
                "Point"
            ]
        },
        {
            "name": "ruleid",
            "title": "Идентификатор стиля",
            "hidden": true,
            "valueType": "STRING"
        }
    ],
    "description": "Нестационарные торговые объекты города Симферополь",
    "geometryType": "Point"
}'
WHERE NOT EXISTS( SELECT id FROM data.schemas WHERE name = 'trading_point_svstpl_2023');

INSERT INTO data.schemas (name, class_rule)
SELECT 'trading_responsezone_dobrovskoe',
    '{
    "styleName": "trading_responsezone_dobrovskoe",
    "tags": [
        "system",
        "НТО"
    ],
    "name": "trading_responsezone_dobrovskoe",
    "title": "Зоны ответственности",
    "tableName": "trading_responsezone_dobrovskoe",
    "originName": "trading_responsezone_dobrovskoe",
    "properties": [
        {
            "name": "objectname",
            "title": "Наименование",
            "required": true,
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
            "required": true,
            "valueType": "STRING"
        },
        {
            "name": "area",
            "title": "Площадь, кв. м.",
            "valueType": "DOUBLE",
            "totalDigits": 38,
            "fractionDigits": 2,
            "calculatedValueWellKnownFormula": "st_area"
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
            "required": true,
            "valueType": "STRING"
        }
    ],
    "description": "Зоны ответственности",
    "geometryType": "MultiPolygon"
}'
WHERE NOT EXISTS( SELECT id FROM data.schemas WHERE name = 'trading_responsezone_dobrovskoe');

INSERT INTO data.schemas (name, class_rule)
SELECT 'trading_responsezone_simf_2022',
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
            "title": "shape",
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
WHERE NOT EXISTS( SELECT id FROM data.schemas WHERE name = 'trading_responsezone_simf_2022');