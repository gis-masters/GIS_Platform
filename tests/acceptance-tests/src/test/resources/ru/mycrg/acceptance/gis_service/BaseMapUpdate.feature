@Shard
Feature: Обновление подложек в проектах

  Background:
    Given Существует любая организация
    *     Владелец организации авторизован

  Scenario Outline: Обновление полей подложки проекта (baseMapId)
    Given Существует проект "STRING_10"
    *     Существует подложкa проекта "<baseMapId>", "<title>", "<position>"
    When  Пользователь делает запрос на обновление полей подложки проекта "<newBaseMapId>", "<newTitle>", "<newPosition>"
    Then  Сервер отвечает со статус-кодом 204
    When  Пользователь делает запрос на текущую подложку проекта
    And   Поля подложки проекта совпадают с переданными <newBaseMapId>, "<newTitle>", <newPosition>
    Examples:
      | baseMapId | title    | position | newBaseMapId | newTitle | newPosition |
      | NUMBER_5  | STRING_5 | NUMBER_2 | 33           | newTitle | 33          |

  Scenario Outline: Владелец проекта может обновить подложку
    Given Существует и авторизован некий пользователь
    *     Существует проект "STRING_10"
    *     Существует подложкa проекта "<baseMapId>", "<title>", "<position>"
    When  Пользователь делает запрос на обновление полей подложки проекта "<newBaseMapId>", "<newTitle>", "<newPosition>"
    Then  Сервер отвечает со статус-кодом 204
    When  Пользователь делает запрос на текущую подложку проекта
    And   Поля подложки проекта совпадают с переданными <newBaseMapId>, "<newTitle>", <newPosition>
    Examples:
      | baseMapId | title    | position | newBaseMapId | newTitle | newPosition |
      | NUMBER_5  | STRING_5 | NUMBER_2 | 33           | newTitle | 33          |

  Scenario Outline: Право обновлять подложку проекта зависит от роли пользователя в проекте
    Given Существует пользователь
      | baseMapProjUser | baseMapProjUser | base@mapProj | testPassword1 |
    *     Существует проект "STRING_10"
    *     Существует подложкa проекта "NUMBER_5", "STRING_5", "NUMBER_2"
    *     Администратор даёт доступ: "<role>" для текущего пользователя на текущий проект
    *     я авторизован как "baseMapProjUser"
    *     Пользователь делает запрос на текущую подложку проекта
    When  Пользователь делает запрос на обновление полей подложки проекта "8", "new8title", "8"
    Then  Сервер отвечает со статус-кодом <code>
    Examples:
      | role        | code |
      | OWNER       | 204  |
      | CONTRIBUTOR | 204  |
      | VIEWER      | 403  |
