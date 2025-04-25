Feature: Проверка xml импорта

  Background:
    Given Существует любая организация
    *     Владелец организации авторизован

  Scenario Outline: Осуществляется импорт корректного xml файла : "<additional>"
    Given Существует набор данных
    Given Существует таблица
    When Пользователь делает запрос на импорт xml файла "<importType>" "<fileName>"
    Then Сервер отвечает со статус-кодом 200
    Examples:
      | importType | fileName                  | additional                                     |
      | mp         | gpzu.xml                  |                                                |
      | mp         | namespace_test.xml        | файл имеет разные namespace                    |
      | mp         | another_geometry_tags.xml | файл имеет разные теги для геометрии           |
      | mp         | another_spatial_tags.xml  | файл имеет не корректно названные spatial теги |

  Scenario Outline: Импорт некорректного файла отклоняется сервером: "<reason>"
    When Пользователь делает запрос на импорт xml файла "<importType>" "<fileName>"
    Then Сервер отвечает со статус-кодом 400
    And В ответе пункт "message" имеет значение "<responseMessage>"
    Examples:
      | importType | fileName  | responseMessage         | reason                  |
      | mp         | test.txt  | Тип файла не XML        | некорректное расширение |
      | mp         | empty.xml | Загружаемый файл пустой | файл пустой             |
