Feature: Создание слоев в проектах

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario Outline: Создание векторного слоя проекта
    Given Существует проект "STRING_10"
    Given Существует набор
    Given Существует таблица
    When Пользователь делает запрос на создание слоя проекта "<title>" "<styleName>" "<type>" "<schemaId>" "<nativeCRS>" "<dataSourceUri>"
    Then Сервер отвечает со статус-кодом 201
    And Сервер передаёт ID слоя проекта в ответе
    When Пользователь делает запрос на текущий слой
    Then Сервер отвечает со статус-кодом 200
    And Поля векторного слоя совпадают с переданными
    Examples:
      | title                             | styleName    | type   | schemaId     | nativeCRS  | dataSourceUri |
      | Искусственные дорожные сооружения | transportobj | vector | transportobj | EPSG:28406 | STRING_6      |

  Scenario: Создание внешнего слоя
    Given Существует проект "STRING_10"
    When Пользователь делает запрос на создание внешнего слоя
    Then Пользователь делает запрос на текущий слой
    And Поля внешнего слоя совпадают с переданными

  Scenario: Создание одинакового векторного слоя в проекте отклоняется сервером с 409 статус-кодом
    Given Существует проект "STRING_10"
    Given Существует набор
    Given Существует таблица
    Given Существует слой проекта
    When Пользователь делает повторный запрос на создание слоя проекта
    Then Сервер отвечает со статус-кодом 409

  Scenario: Создание одинакового внешнего слоя в проекте отклоняется сервером с 409 статус-кодом
    Given Существует проект "STRING_10"
    Given Пользователь делает запрос на создание внешнего слоя
    When Пользователь делает повторный запрос на создание слоя проекта
    Then Сервер отвечает со статус-кодом 409

  Scenario Outline: Создание слоя проекта c невалидными данными ("<reason>")
    Given Существует проект "STRING_10"
    Given Существует набор
    Given Существует таблица
    When Пользователь делает запрос на создание слоя проекта "<title>" "<styleName>" "<type>" "<schemaId>" "<nativeCRS>" "<dataSourceUri>"
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | title      | styleName    | type     | schemaId     | nativeCRS  | dataSourceUri | reason                                 |
      | STRING_1   | transportobj | vector   | transportobj | EPSG:28406 | STRING_6      | Короткое название (vector)             |
      | STRING_257 | transportobj | vector   | transportobj | EPSG:28406 | STRING_6      | Длинное название (vector)              |
      | STRING_0   | transportobj | vector   | transportobj | EPSG:28406 | STRING_6      | Пустое название (vector)               |
      | STRING_5   | STRING_1     | vector   | transportobj | EPSG:28406 | STRING_6      | Короткое название стиля (vector)       |
      | STRING_5   | STRING_0     | vector   | transportobj | EPSG:28406 | STRING_6      | Пустое название стиля (vector)         |
      | STRING_5   | STRING_257   | vector   | transportobj | EPSG:28406 | STRING_6      | Длинное название стиля (vector)        |
      | STRING_5   | transportobj | data     | transportobj | EPSG:28406 | STRING_6      | Неверный тип (vector)                  |
      | STRING_5   | transportobj | STRING_0 | transportobj | EPSG:28406 | STRING_6      | Пустой тип (vector)                    |
      | STRING_5   | transportobj | vector   | STRING_1     | EPSG:28406 | STRING_6      | Короткий id схемы (vector)             |
      | STRING_5   | transportobj | vector   | STRING_101   | EPSG:28406 | STRING_6      | Длинный id схемы (vector)              |
      | STRING_5   | transportobj | vector   | STRING_0     | EPSG:28406 | STRING_6      | Пустой id схемы (vector)               |
      | STRING_5   | transportobj | vector   | transportobj | STRING_1   | STRING_6      | Короткий nativeCRS (vector)            |
      | STRING_5   | transportobj | vector   | transportobj | STRING_52  | STRING_6      | Длинный nativeCRS (vector)             |
      | STRING_5   | transportobj | vector   | transportobj | STRING_0   | STRING_6      | Пустой nativeCRS (vector)              |
      | STRING_5   | transportobj | raster   | transportobj | STRING_0   | STRING_6      | Пустой nativeCRS (raster)              |
      | STRING_5   | STRING_5     | raster   | transportobj | EPSG:28406 | STRING_0      | Пустое название dataSourceUri (raster) |
