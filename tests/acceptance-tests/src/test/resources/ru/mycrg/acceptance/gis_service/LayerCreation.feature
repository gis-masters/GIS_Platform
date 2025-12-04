Feature: Создание слоев в проектах

  Background:
    Given Существует любая организация
    *     Владелец организации авторизован

  Scenario Outline: Создание векторного слоя выполняется по заданным правилам
    Given Существует проект "STRING_10"
    Given Существует набор данных
    Given Существует таблица
    When  Пользователь делает запрос на создание слоя проекта "<title>" "<styleName>" "<type>" "<nativeCRS>" "<dataSourceUri>" "<libraryId>" "<recordId>" "<mode>" "test_content_type" "<style>"
    Then  Сервер отвечает со статус-кодом 201
    And   Сервер передаёт ID слоя проекта в ответе
    When  Пользователь делает запрос на текущий слой
    Then  Сервер отвечает со статус-кодом 200
    And   Поля векторного слоя совпадают с переданными
    Examples:
      | title                             | styleName    | type   | nativeCRS  | dataSourceUri | style    |
      | Искусственные дорожные сооружения | transportobj | vector | EPSG:28406 | STRING_6      | STRING_6 |
      | Искусственные дорожные сооружения | transportobj | vector | EPSG:28407 | STRING_6      | STRING_6 |

  Scenario: Создание внешнего слоя
    Given Существует проект "STRING_10"
    When  Пользователь делает запрос на создание внешнего слоя
    Then  Пользователь делает запрос на текущий слой
    And   Поля внешнего слоя совпадают с переданными

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
    When Пользователь делает запрос на создание слоя проекта "<title>" "<styleName>" "<type>" "<nativeCRS>" "<dataSourceUri>" "<libraryId>" "<recordId>" "<mode>" "<content_type>" "style"
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | title      | styleName    | type     | nativeCRS  | dataSourceUri | content_type      | reason                          |
      | STRING_257 | transportobj | vector   | EPSG:28406 | STRING_6      | test_content_type | Длинное название (vector)       |
      | STRING_0   | transportobj | vector   | EPSG:28406 | STRING_6      | test_content_type | Пустое название (vector)        |
      | STRING_5   | STRING_0     | vector   | EPSG:28406 | STRING_6      | test_content_type | Пустое название стиля(vector)   |
      | STRING_5   | STRING_257   | vector   | EPSG:28406 | STRING_6      | test_content_type | Длинное название стиля(vector)  |
      | STRING_5   | transportobj | data     | EPSG:28406 | STRING_6      | test_content_type | Неверный тип (vector)           |
      | STRING_5   | transportobj | STRING_0 | EPSG:28406 | STRING_6      | test_content_type | Пустой тип (vector)             |
      | STRING_5   | transportobj | vector   | STRING_1   | STRING_6      | test_content_type | Короткий nativeCRS(vector)      |
      | STRING_5   | transportobj | vector   | STRING_52  | STRING_6      | test_content_type | Длинный nativeCRS(vector)       |
      | STRING_5   | transportobj | vector   | STRING_0   | STRING_6      | test_content_type | Пустой nativeCRS (vector)       |
      | STRING_5   | transportobj | vector   | EPSG:28406 | STRING_6      | STRING_55         | Длинный content_type            |
