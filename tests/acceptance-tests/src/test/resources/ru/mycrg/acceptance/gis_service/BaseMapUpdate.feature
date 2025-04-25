Feature: Обновление подложек

  Background:
    Given Существует любая организация
    *     Владелец организации авторизован

  Scenario Outline: Обновление полей подложки проекта (baseMapId)
    Given Существует проект "STRING_10"
    Given Существует подложкa проекта "<baseMapId>", "<title>", "<position>"
    When Пользователь делает запрос на обновление полей подложки проекта "<newBaseMapId>", "<newTitle>", "<newPosition>"
    Then Сервер отвечает со статус-кодом 204
    When Пользователь делает запрос на текущую подложку проекта
    And Поля подложки проекта совпадают с переданными <newBaseMapId>, "<newTitle>", <newPosition>
    Examples:
      | baseMapId | title    | position | newBaseMapId | newTitle | newPosition |
      | NUMBER_5  | STRING_5 | NUMBER_2 | 33           | newTitle | 33          |

  Scenario Outline: Владелец проекта может обновить подложку
    Given Существует и авторизован некий пользователь
    Given Существует проект "STRING_10"
    Given Существует подложкa проекта "<baseMapId>", "<title>", "<position>"
    When Пользователь делает запрос на обновление полей подложки проекта "<newBaseMapId>", "<newTitle>", "<newPosition>"
    Then Сервер отвечает со статус-кодом 204
    When Пользователь делает запрос на текущую подложку проекта
    And Поля подложки проекта совпадают с переданными <newBaseMapId>, "<newTitle>", <newPosition>
    Examples:
      | baseMapId | title    | position | newBaseMapId | newTitle | newPosition |
      | NUMBER_5  | STRING_5 | NUMBER_2 | 33           | newTitle | 33          |
