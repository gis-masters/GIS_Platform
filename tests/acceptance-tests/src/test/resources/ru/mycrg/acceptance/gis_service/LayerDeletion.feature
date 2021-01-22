Feature: Удаление слоев проектов

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario Outline: Удаление слоя проекта администратором организации
    Given Существует проект "STRING_10"
    Given Существует слой проекта
      | <title> | <dataset> | <tableName> | <styleName> | <type> | <schemaId> | <dataStoreName> | <nativeCRS> | <dataSourceUri> |
    When Пользователь делает запрос на удаление слоя
    Then Сервер отвечает со статус-кодом 204
    When Пользователь делает запрос на текущий слой
    Then Сервер отвечает со статус-кодом 404
    And В ответе на удаление слоя проекта есть упоминание ID
    Examples:
      | title    | dataset  | tableName | styleName | type   | schemaId | dataStoreName | nativeCRS  | dataSourceUri |
      | STRING_5 | STRING_5 | STRING_5     | STRING_5  | vector | STRING_5 | STRING_5      | EPSG:28406 | STRING_6      |

  Scenario Outline: Удаление слоя проекта пользователем организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    Given Существует проект "STRING_15"
    Given Существует слой проекта
      | <title> | <dataset> | <tableName> | <styleName> | <type> | <schemaId> | <dataStoreName> | <nativeCRS> | <dataSourceUri> |
    Given Существует пользователь
      | STRING_15 | STRING_15 | EMAIL_10 | testtestQ1 |
    When Авторизируемся пользователем
    When Пользователь делает запрос на удаление слоя
    Then Сервер отвечает со статус-кодом 403
    Examples:
      | title    | dataset  | tableName | styleName | type   | schemaId | dataStoreName | nativeCRS  | dataSourceUri |
      | STRING_5 | STRING_5 | STRING_5     | STRING_5  | vector | STRING_5 | STRING_5      | EPSG:28406 | STRING_6      |
