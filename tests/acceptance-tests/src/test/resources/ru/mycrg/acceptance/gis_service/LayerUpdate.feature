Feature: Обновление слоя проектов

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario Outline: Обновление слоя проекта администратором организации
    Given Существует проект "STRING_10"
    Given Существует слой проекта
      | <title> | <dataset> | <tableName> | <styleName> | <type> | <schemaId> | <dataStoreName> | <nativeCRS> | <dataSourceUri> |
    When Авторизируемся владельцем организации
    When Пользователь делает запрос на обновление полей слоя проекта
      | <newTitle> | <newDataset> | <enabled> | <position> | <transparency> | <minZoom> | <maxZoom> | <newNativeCrs> |
    Then Сервер отвечает со статус-кодом 204
    When Пользователь делает запрос на текущий слой
    Then Обновленные поля слоя совпадают с переданными
    Examples:
      | title    | dataset  | tableName | styleName | type   | schemaId | dataStoreName | nativeCRS  | dataSourceUri | newTitle | newDataset | enabled | position | transparency | minZoom | maxZoom | newNativeCrs |
      | STRING_5 | STRING_5 | STRING_5  | STRING_5  | vector | STRING_5 | STRING_5      | EPSG:28406 | STRING_6      | newTitle | newDataset | false   | NUMBER_3 | NUMBER_2     | 15      | 30      | EPSG:28410   |

  Scenario Outline: Добавление слою проекта папку-родителя администратором организации
    Given Существует проект "STRING_10"
    Given Существует группа слоев проекта "STRING_10", "NUMBER_2"
    Given Существует слой проекта
      | <title> | <dataset> | <tableName> | <styleName> | <type> | <schemaId> | <dataStoreName> | <nativeCRS> | <dataSourceUri> |
    When Авторизируемся владельцем организации
    When Пользователь делает запрос на добавление слоя в папку-родитель
    Then Сервер отвечает со статус-кодом 204
    When Пользователь делает запрос на текущий слой
    Then В полях слоя есть упоминание папки родителя
    Examples:
      | title    | dataset  | tableName | styleName | type   | schemaId | dataStoreName | nativeCRS  | dataSourceUri |
      | STRING_5 | STRING_5 | STRING_5  | STRING_5  | vector | STRING_5 | STRING_5      | EPSG:28406 | STRING_6      |

  Scenario Outline: Обновление слоя проекта пользователем организации
    Given Существует проект "STRING_10"
    Given Существует слой проекта
      | <title> | <dataset> | <tableName> | <styleName> | <type> | <schemaId> | <dataStoreName> | <nativeCRS> | <dataSourceUri> |
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Администратор делает запрос на создание правила на текущего пользователя
    When Авторизируемся пользователем
    When Пользователь делает запрос на обновление полей слоя проекта
      | <newTitle> | <newDataset> | <enabled> | <position> | <transparency> | <minZoom> | <maxZoom> | <newNativeCrs> |
    Then Сервер отвечает со статус-кодом 403
    Examples:
      | userName  | userSurname | userEmail | userPassword | title    | dataset  | tableName | styleName | type   | schemaId | dataStoreName | nativeCRS  | dataSourceUri | newTitle | newDataset | enabled | position | transparency | minZoom | maxZoom | newNativeCrs |
      | STRING_10 | STRING_10   | EMAIL_10  | testtestQ1   | STRING_5 | STRING_5 | STRING_5  | STRING_5  | vector | STRING_5 | STRING_5      | EPSG:28406 | STRING_6      | newTitle | newDataset | false   | NUMBER_3 | NUMBER_2     | 15      | 30      | EPSG:28410   |
