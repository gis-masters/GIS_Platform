Feature: Обновление слоя проектов

  Background:
    Given Существует любая организация
    *     Владелец организации авторизован

  Scenario Outline: Обновление слоя проекта администратором организации
    Given Существует проект "STRING_10"
    Given Существует набор данных
    Given Существует таблица
    Given Существует слой проекта
    Given Владелец организации авторизован
    When Владелец делает запрос на обновление полей слоя проекта
      | <newTitle> | <enabled> | <position> | <transparency> | <minZoom> | <maxZoom> | <newNativeCrs> | <newContentType> | <style> |
    Then Сервер отвечает со статус-кодом 204
    When Пользователь делает запрос на текущий слой
    Then Обновленные поля слоя совпадают с переданными
    Examples:
      | newTitle | enabled | position | transparency | minZoom | maxZoom | newNativeCrs | newContentType    | style      |
      | newTitle | false   | NUMBER_3 | 20           | 15      | 30      | EPSG:28410   | test_content_type | some_style |

  Scenario: Добавление слою проекта папки-родителя администратором организации
    Given Существует проект "STRING_10"
    Given Существует группа слоев проекта "STRING_10", "NUMBER_2"
    Given Существует набор данных
    Given Существует таблица
    Given Существует слой проекта
    Given Владелец организации авторизован
    When Пользователь делает запрос на добавление слоя в папку-родитель
    Then Сервер отвечает со статус-кодом 204
    When Пользователь делает запрос на текущий слой
    Then В полях слоя есть упоминание папки родителя

  Scenario Outline: При обновлении слоя проекта можно менять произвольные поля в произвольном сочетании
    Given Существует проект "STRING_10"
    Given Существует набор данных
    Given Существует таблица
    Given Существует слой проекта
    When Администратор делает запрос на обновление полей слоя "<json>"
    Then Сервер отвечает со статус-кодом 204
    Examples:
      | json                                     |
      | {\"position\":50}                        |
      | {\"enabled\":true}                       |
      | {\"enabled\":true,\"transparency\":7}    |
      | {\"title\":\"NewTitle\",\"position\":50} |
