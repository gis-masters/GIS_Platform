Feature: Создание слоев в проектах

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    Given Владелец организации авторизован

  Scenario Outline: Создание векторного слоя проекта
    Given Существует проект "STRING_10"
    Given Существует набор данных
    Given Существует таблица
    When Пользователь делает запрос на создание слоя проекта "<title>" "<styleName>" "<type>" "<schemaId>" "<nativeCRS>" "<dataSourceUri>" "<libraryId>" "<recordId>" "<mode>" "test_content_type" "<style>"
    Then Сервер отвечает со статус-кодом 201
    And Сервер передаёт ID слоя проекта в ответе
    When Пользователь делает запрос на текущий слой
    Then Сервер отвечает со статус-кодом 200
    And Поля векторного слоя совпадают с переданными
    Examples:
      | title                             | styleName    | type   | schemaId     | nativeCRS  | dataSourceUri | style    |
      | Искусственные дорожные сооружения | transportobj | vector | transportobj | EPSG:28406 | STRING_6      | STRING_6 |

  Scenario: Создание внешнего слоя
    Given Существует проект "STRING_10"
    When Пользователь делает запрос на создание внешнего слоя
    Then Пользователь делает запрос на текущий слой
    And Поля внешнего слоя совпадают с переданными

  Scenario: Допускается создание одинаковых векторных слоёв
    Given Существует проект "STRING_10"
    Given Существует набор данных
    Given Существует таблица
    Given Существует слой проекта
    When Пользователь делает повторный запрос на создание слоя проекта
    Then Сервер отвечает со статус-кодом 201

  Scenario: Допускается создание одинаковых внешних слоёв
    Given Существует проект "STRING_10"
    Given Пользователь делает запрос на создание внешнего слоя
    When Пользователь делает повторный запрос на создание слоя проекта
    Then Сервер отвечает со статус-кодом 201

  Scenario Outline: Создание слоя проекта c невалидными данными ("<reason>")
    Given Существует проект "STRING_10"
    Given Существует набор данных
    Given Существует таблица
    When Пользователь делает запрос на создание слоя проекта "<title>" "<styleName>" "<type>" "<schemaId>" "<nativeCRS>" "<dataSourceUri>" "<libraryId>" "<recordId>" "<mode>" "<content_type>" "style"
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | title      | styleName    | type     | schemaId     | nativeCRS  | dataSourceUri | content_type      | reason                          |
      | STRING_1   | transportobj | vector   | transportobj | EPSG:28406 | STRING_6      | test_content_type | Короткое название(vector)       |
      | STRING_257 | transportobj | vector   | transportobj | EPSG:28406 | STRING_6      | test_content_type | Длинное название (vector)       |
      | STRING_0   | transportobj | vector   | transportobj | EPSG:28406 | STRING_6      | test_content_type | Пустое название (vector)        |
      | STRING_5   | STRING_1     | vector   | transportobj | EPSG:28406 | STRING_6      | test_content_type | Короткое название стиля(vector) |
      | STRING_5   | STRING_0     | vector   | transportobj | EPSG:28406 | STRING_6      | test_content_type | Пустое название стиля(vector)   |
      | STRING_5   | STRING_257   | vector   | transportobj | EPSG:28406 | STRING_6      | test_content_type | Длинное название стиля(vector)  |
      | STRING_5   | transportobj | data     | transportobj | EPSG:28406 | STRING_6      | test_content_type | Неверный тип (vector)           |
      | STRING_5   | transportobj | STRING_0 | transportobj | EPSG:28406 | STRING_6      | test_content_type | Пустой тип (vector)             |
      | STRING_5   | transportobj | vector   | STRING_1     | EPSG:28406 | STRING_6      | test_content_type | Короткий id схемы(vector)       |
      | STRING_5   | transportobj | vector   | STRING_101   | EPSG:28406 | STRING_6      | test_content_type | Длинный id схемы (vector)       |
      | STRING_5   | transportobj | vector   | STRING_0     | EPSG:28406 | STRING_6      | test_content_type | Пустой id схемы (vector)        |
      | STRING_5   | transportobj | vector   | transportobj | STRING_1   | STRING_6      | test_content_type | Короткий nativeCRS(vector)      |
      | STRING_5   | transportobj | vector   | transportobj | STRING_52  | STRING_6      | test_content_type | Длинный nativeCRS(vector)       |
      | STRING_5   | transportobj | vector   | transportobj | STRING_0   | STRING_6      | test_content_type | Пустой nativeCRS (vector)       |
      | STRING_5   | transportobj | vector   | transportobj | EPSG:28406 | STRING_6      | STRING_55         | Длинный content_type            |
