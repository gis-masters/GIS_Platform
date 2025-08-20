Feature: Обновление групп слоев проектов

  Background:
    Given Существует любая организация
    *     Владелец организации авторизован

  Scenario Outline: Обновление групп слоев проекта администратором организации
    Given Существует проект "STRING_10"
    Given Существует группа слоев проекта "<title>", "<position>"
    Given Владелец организации авторизован
    When Владелец делает запрос на обновление полей групп слоев проекта "<newTitle>", "<newPosition>"
    Then Сервер отвечает со статус-кодом 204
    When Пользователь делает запрос на текущую группу слоев проекта
    Then Поля группы слоев проекта совпадают с переданными "<newTitle>", <newPosition>
    Examples:
      | title     | position | newTitle | newPosition |
      | STRING_10 | NUMBER_2 | newTitle | 33          |

  Scenario Outline: Обновление групп слоев проекта пользователем организации
    Given Существует проект "STRING_10"
    Given Существует группа слоев проекта "<title>", "<position>"
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Администратор даёт доступ: "VIEWER" для текущего пользователя на текущий проект
    When Пользователь делает запрос на обновление полей групп слоев проекта "<newTitle>", "<newPosition>"
    Then Сервер отвечает со статус-кодом 403
    Examples:
      | title     | position | newTitle | newPosition | userName  | userSurname | userEmail | userPassword |
      | STRING_10 | NUMBER_2 | newTitle | 33          | STRING_15 | STRING_15   | EMAIL_15  | testtestQ1   |
