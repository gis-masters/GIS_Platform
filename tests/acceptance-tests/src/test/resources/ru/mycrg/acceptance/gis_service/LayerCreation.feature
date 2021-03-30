Feature: Создание слоев в проектах

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario Outline: Создание слоя проекта с валидными данными без родительской группы
    Given Существует проект "STRING_10"
    When Пользователь делает запрос на создание слоя проекта
      | <title> | <dataset> | <tableName> | <styleName> | <type> | <schemaId> | <dataStoreName> | <nativeCRS> | <dataSourceUri> |
    Then Сервер отвечает со статус-кодом 201
    And Сервер передаёт ID слоя проекта в ответе
    When Пользователь делает запрос на текущий слой
    Then Сервер отвечает со статус-кодом 200
    And Поля слоя проекта совпадают с переданными
    Examples:
      | title    | dataset  | tableName | styleName | type   | schemaId | dataStoreName | nativeCRS  | dataSourceUri |
      | STRING_5 | STRING_5 | STRING_5  | STRING_5  | vector | STRING_5 | STRING_5      | EPSG:28406 | STRING_6      |
      | STRING_5 | STRING_5 | STRING_5  | STRING_5  | raster | STRING_5 | STRING_5      | EPSG:28406 | STRING_6      |

  Scenario Outline: Повторное создание слоя проекта c валидными данными
    Given Существует проект "STRING_10"
    Given Существует слой проекта
      | <title> | <dataset> | <tableName> | <styleName> | <type> | <schemaId> | <dataStoreName> | <nativeCRS> | <dataSourceUri> |
    When Пользователь делает повторный запрос на создание слоя проекта
    Then Сервер отвечает со статус-кодом 409
    Examples:
      | title    | dataset  | tableName | styleName | type   | schemaId | dataStoreName | nativeCRS  | dataSourceUri |
      | STRING_5 | STRING_5 | STRING_5  | STRING_5  | vector | STRING_5 | STRING_5      | EPSG:28406 | STRING_6      |

  Scenario Outline: Создание слоя проекта c невалидными данными ("<reason>")
    Given Существует проект "STRING_10"
    When Пользователь делает запрос на создание слоя проекта
      | <title> | <dataset> | <tableName> | <styleName> | <type> | <schemaId> | <dataStoreName> | <nativeCRS> | <dataSourceUri> |
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | title      | dataset    | tableName  | styleName  | type     | schemaId   | dataStoreName | nativeCRS  | dataSourceUri | reason                                   |
      | STRING_1   | STRING_5   | STRING_5   | STRING_5   | vector   | STRING_5   | STRING_5      | EPSG:28406 | STRING_6      | Короткое название (vector)               |
      | STRING_257 | STRING_5   | STRING_5   | STRING_5   | vector   | STRING_5   | STRING_5      | EPSG:28406 | STRING_6      | Длинное название (vector)                |
      | STRING_0   | STRING_5   | STRING_5   | STRING_5   | vector   | STRING_5   | STRING_5      | EPSG:28406 | STRING_6      | Пустое название (vector)                 |
      | STRING_5   | STRING_1   | STRING_5   | STRING_5   | vector   | STRING_5   | STRING_5      | EPSG:28406 | STRING_6      | Короткое название датасета (vector)      |
      | STRING_5   | STRING_257 | STRING_5   | STRING_5   | vector   | STRING_5   | STRING_5      | EPSG:28406 | STRING_6      | Длинное название датасета (vector)       |
      | STRING_5   | STRING_0   | STRING_5   | STRING_5   | vector   | STRING_5   | STRING_5      | EPSG:28406 | STRING_6      | Пустое название датасета (vector)        |
      | STRING_5   | STRING_5   | STRING_1   | STRING_5   | vector   | STRING_5   | STRING_5      | EPSG:28406 | STRING_6      | Короткое внутреннее название (vector)    |
      | STRING_5   | STRING_5   | STRING_257 | STRING_5   | vector   | STRING_5   | STRING_5      | EPSG:28406 | STRING_6      | Длинное внутреннее название (vector)     |
      | STRING_5   | STRING_5   | STRING_0   | STRING_5   | vector   | STRING_5   | STRING_5      | EPSG:28406 | STRING_6      | Пустое внутреннее название (vector)      |
      | STRING_5   | STRING_5   | STRING_5   | STRING_1   | vector   | STRING_5   | STRING_5      | EPSG:28406 | STRING_6      | Короткое название стиля (vector)         |
      | STRING_5   | STRING_5   | STRING_5   | STRING_0   | vector   | STRING_5   | STRING_5      | EPSG:28406 | STRING_6      | Пустое название стиля (vector)           |
      | STRING_5   | STRING_5   | STRING_5   | STRING_257 | vector   | STRING_5   | STRING_5      | EPSG:28406 | STRING_6      | Длинное название стиля (vector)          |
      | STRING_5   | STRING_5   | STRING_5   | STRING_5   | data     | STRING_5   | STRING_5      | EPSG:28406 | STRING_6      | Неверный тип (vector)                    |
      | STRING_5   | STRING_5   | STRING_5   | STRING_5   | STRING_0 | STRING_5   | STRING_5      | EPSG:28406 | STRING_6      | Пустой тип (vector)                      |
      | STRING_5   | STRING_5   | STRING_5   | STRING_5   | vector   | STRING_1   | STRING_5      | EPSG:28406 | STRING_6      | Короткий id схемы (vector)               |
      | STRING_5   | STRING_5   | STRING_5   | STRING_5   | vector   | STRING_101 | STRING_5      | EPSG:28406 | STRING_6      | Длинный id схемы (vector)                |
      | STRING_5   | STRING_5   | STRING_5   | STRING_5   | vector   | STRING_0   | STRING_5      | EPSG:28406 | STRING_6      | Пустой id схемы (vector)                 |
      | STRING_5   | STRING_5   | STRING_5   | STRING_5   | vector   | STRING_5   | STRING_1      | EPSG:28406 | STRING_6      | Короткое название dataStoreName (vector) |
      | STRING_5   | STRING_5   | STRING_5   | STRING_5   | vector   | STRING_5   | STRING_101    | EPSG:28406 | STRING_6      | Длинное название dataStoreName (vector)  |
      | STRING_5   | STRING_5   | STRING_5   | STRING_5   | vector   | STRING_5   | STRING_0      | EPSG:28406 | STRING_6      | Пустое название dataStoreName (vector)   |
      | STRING_5   | STRING_5   | STRING_5   | STRING_5   | vector   | STRING_5   | STRING_5      | EPSG:28406 | STRING_0      | Пустое название dataSourceUri (vector)   |
      | STRING_5   | STRING_5   | STRING_5   | STRING_5   | vector   | STRING_5   | STRING_5      | EPSG:28406 | STRING_257    | Длинное название dataSourceUri (vector)  |
      | STRING_5   | STRING_5   | STRING_5   | STRING_5   | vector   | STRING_5   | STRING_5      | EPSG:28406 | STRING_1      | Короткое название dataSourceUri (vector) |
      | STRING_5   | STRING_5   | STRING_5   | STRING_5   | vector   | STRING_5   | STRING_5      | STRING_1   | STRING_6      | Короткий nativeCRS (vector)              |
      | STRING_5   | STRING_5   | STRING_5   | STRING_5   | vector   | STRING_5   | STRING_5      | STRING_52  | STRING_6      | Длинный nativeCRS (vector)               |
      | STRING_5   | STRING_5   | STRING_5   | STRING_5   | vector   | STRING_5   | STRING_5      | STRING_0   | STRING_6      | Пустой nativeCRS (vector)                |
      | STRING_5   | STRING_5   | STRING_5   | STRING_5   | raster   | STRING_5   | STRING_5      | STRING_0   | STRING_6      | Пустой nativeCRS (raster)                |
      | STRING_5   | STRING_5   | STRING_5   | STRING_5   | raster   | STRING_5   | STRING_0      | EPSG:28406 | STRING_6      | Пустое название dataStoreName (raster)   |
      | STRING_5   | STRING_5   | STRING_5   | STRING_5   | raster   | STRING_5   | STRING_5      | EPSG:28406 | STRING_0      | Пустое название dataSourceUri (raster)   |
