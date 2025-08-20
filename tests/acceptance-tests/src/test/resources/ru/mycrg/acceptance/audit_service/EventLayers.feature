Feature: Аудит работы со слоями

  Background:
    Given Существует любая организация
    *     Владелец организации авторизован

  Scenario Outline: Создание слоя заносится в аудит лог
    Given Существует проект "STRING_10"
    Given Существует набор данных
    Given Существует таблица
    When  Пользователь делает запрос на создание слоя проекта "<title>" "<styleName>" "<type>" "<nativeCRS>" "<dataSourceUri>" "<libraryId>" "<recordId>" "<mode>" "test_content_type" "style"
    And   Создан аудит лог о создании слоя, с корректным телом
    Examples:
      | title                             | styleName    | type   | nativeCRS  | dataSourceUri |
      | Искусственные дорожные сооружения | transportobj | vector | EPSG:28406 | STRING_6      |

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
    When  Владелец организации делает запрос на удаление слоя
    And   Создан аудит лог об удалении слоя, с корректным телом
