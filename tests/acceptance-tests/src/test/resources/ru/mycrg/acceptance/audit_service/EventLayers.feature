Feature: При изменении слоя, осуществляется запись об этом событии

  Background:
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    Given Авторизируемся владельцем организации

  Scenario Outline: Создание слоя заносится в аудит лог
    Given Существует проект "STRING_10"
    Given Существует набор данных
    Given Существует таблица
    When Пользователь делает запрос на создание слоя проекта "<title>" "<styleName>" "<type>" "<schemaId>" "<nativeCRS>" "<dataSourceUri>" "<libraryId>" "<recordId>" "<mode>" "test_content_type"
    And Создан аудит лог о создании слоя, с корректным телом
    Examples:
      | title                             | styleName    | type   | schemaId     | nativeCRS  | dataSourceUri |
      | Искусственные дорожные сооружения | transportobj | vector | transportobj | EPSG:28406 | STRING_6      |

#  Тест очень часто даёт ложное срабатывание
#  Scenario Outline: Изменение слоя заносится в аудит лог
#    Given Существует проект "STRING_10"
#    Given Существует набор данных
#    Given Существует таблица
#    Given Существует слой проекта
#    When Владелец делает запрос на обновление полей слоя проекта
#      | <newTitle> | <enabled> | <position> | <transparency> | <minZoom> | <maxZoom> | <newNativeCrs> | <newContentType> |
#    And Создан аудит лог об изменении слоя, с корректным телом
#    Examples:
#      | newTitle | enabled | position | transparency | minZoom | maxZoom | newNativeCrs | newContentType    |
#      | newTitle | false   | NUMBER_3 | NUMBER_2     | 15      | 30      | EPSG:28410   | test_content_type |

  Scenario: Удаление слоя заносится в аудит лог
    Given Существует проект "STRING_10"
    Given Существует набор данных
    Given Существует таблица
    Given Существует слой проекта
    When Владелец делает запрос на удаление слоя
    And Создан аудит лог об удалении слоя, с корректным телом
