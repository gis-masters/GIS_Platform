Feature: При изменении слоя, осуществляется запись об этом событии

  Background:
    Given Существует организация
      | ООО НетБыкамИКоровамLayer | 32145688 | Петров | Петр | EMAIL_20 | testPassword9 |
    Given Авторизируемся владельцем организации

  Scenario Outline: Создание слоя заносится в аудит лог
    Given Существует проект "STRING_10"
    When Пользователь делает запрос на создание слоя проекта
      | <title> | <dataset> | <tableName> | <styleName> | <type> | <schemaId> | <dataStoreName> | <nativeCRS> | <dataSourceUri> |
    Then Создан аудит лог о создании слоя
    And Записано корректное тело слоя
    Examples:
      | title    | dataset  | tableName | styleName | type   | schemaId | dataStoreName | nativeCRS  | dataSourceUri |
      | STRING_5 | STRING_5 | STRING_5  | STRING_5  | vector | STRING_5 | STRING_5      | EPSG:28406 | STRING_6      |

  Scenario Outline: Изменение слоя заносится в аудит лог
    Given Существует проект "STRING_10"
    Given Существует слой проекта
      | <title> | <dataset> | <tableName> | <styleName> | <type> | <schemaId> | <dataStoreName> | <nativeCRS> | <dataSourceUri> |
    When Владелец делает запрос на обновление полей слоя проекта
      | <newTitle> | <newDataset> | <enabled> | <position> | <transparency> | <minZoom> | <maxZoom> | <newNativeCrs> |
    And Создан аудит лог об изменении слоя
    And Записано корректное тело слоя
    Examples:
      | title    | dataset  | tableName | styleName | type   | schemaId | dataStoreName | nativeCRS  | dataSourceUri | newTitle | newDataset | enabled | position | transparency | minZoom | maxZoom | newNativeCrs |
      | STRING_5 | STRING_5 | STRING_5  | STRING_5  | vector | STRING_5 | STRING_5      | EPSG:28406 | STRING_6      | newTitle | newDataset | false   | NUMBER_3 | NUMBER_2     | 15      | 30      | EPSG:28410   |

  Scenario Outline: Удаление слоя заносится в аудит лог
    Given Существует проект "STRING_10"
    Given Существует слой проекта
      | <title> | <dataset> | <tableName> | <styleName> | <type> | <schemaId> | <dataStoreName> | <nativeCRS> | <dataSourceUri> |
    When Владелец делает запрос на удаление слоя
    And Создан аудит лог об удалении слоя
    Examples:
      | title    | dataset  | tableName | styleName | type   | schemaId | dataStoreName | nativeCRS  | dataSourceUri |
      | STRING_5 | STRING_5 | STRING_5  | STRING_5  | vector | STRING_5 | STRING_5      | EPSG:28406 | STRING_6      |
