Feature: Проверка сущности task

  Background:
    Given Существует организация
      | ООО НаборыДанных | 1234567890 | Наборов | Набор | EMAIL_13 | testPassword1 |
    Given Авторизируемся владельцем организации
    Given Существует некий пользователь

  Scenario Outline: Проверка создания задач, имеющих разные типы
    When Отправляется запрос на создание задачи "<assignedTo>" "<ownerId>" "<type>" "<description>"
    Then Сервер отвечает со статус-кодом 201
    Examples:
      | assignedTo | ownerId | type       | description | reason                   |
      | 2          | 1       | CUSTOM     | test        | Проверка типа CUSTOM     |
      | 2          | 1       | ASSIGNABLE | test        | Проверка типа ASSIGNABLE |
      | 2          | 1       | SYSTEM     | test        | Проверка типа SYSTEM     |

  Scenario Outline: Проверка создания задач, имеющих невалидный тип
    When Отправляется запрос на создание задачи "<assignedTo>" "<ownerId>" "<type>" "<description>"
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | assignedTo | ownerId | type       | description | reason                                                       |
      | 2          | 1       | CUSTOMTest | test        | Допустимые значения поля type: ASSIGNABLE, SYSTEM или CUSTOM |
