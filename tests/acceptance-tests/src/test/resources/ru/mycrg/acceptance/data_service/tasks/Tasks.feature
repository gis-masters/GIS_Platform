Feature: Проверка сущности task

  Background:
    Given Существует организация
      | ООО НаборыДанных | 1234567890 | Наборов | Набор | EMAIL_13 | testPassword1 |
    Given Авторизируемся владельцем организации
    Given Существует некий пользователь

  Scenario Outline: Создание задач, имеющих разные валидные типы, происходит успешно
    When Отправляется запрос на создание задачи "<assignedTo>" "<ownerId>" "<type>" "<description>"
    Then Сервер отвечает со статус-кодом 201
    Examples:
      | assignedTo | ownerId | type       | description | reason                   |
      | 2          | 1       | CUSTOM     | test        | Проверка типа CUSTOM     |
      | 2          | 1       | ASSIGNABLE | test        | Проверка типа ASSIGNABLE |
      | 2          | 1       | SYSTEM     | test        | Проверка типа SYSTEM     |

  Scenario Outline: Недопустимо создание задач, имеющих невалидный тип
    When Отправляется запрос на создание задачи "<assignedTo>" "<ownerId>" "<type>" "<description>"
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | assignedTo | ownerId | type       | description | reason                                                       |
      | 2          | 1       | CUSTOMTest | test        | Допустимые значения поля type: ASSIGNABLE, SYSTEM или CUSTOM |

  Scenario: При запросе на изменение статуса текущей задачи на "Выполнена", статус успешно изменён
    Given Существует задача
    When Переведение текущей задачи в статус DONE
    And Задача имеет статус "DONE"

  Scenario: При запросе на изменение статуса текущей задачи на "В работе", статус успешно изменён
    Given Существует задача
    When Переведение текущей задачи в статус IN_PROGRESS
    And Задача имеет статус "IN_PROGRESS"

  Scenario: При запросе на изменение статуса текущей задачи на "Отменена", статус успешно изменён
    Given Существует задача
    When Переведение текущей задачи в статус CANCEL
    And Задача имеет статус "CANCELED"
