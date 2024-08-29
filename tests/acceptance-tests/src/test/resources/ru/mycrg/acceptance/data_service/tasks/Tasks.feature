Feature: Проверка сущности task

  Background:
    Given Существует организация
      | ООО НаборыДанных | 1234567890 | Наборов | Набор | EMAIL_13 |
    Given Владелец организации авторизован
    Given Существует некий пользователь

  Scenario Outline: Недопустимо создание задач, имеющих невалидный тип. <reason>
    When Отправляется запрос на создание задачи <assignedTo> <ownerId> "<type>" "<description>"
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | assignedTo | ownerId | type     | description | reason                                                       |
      | 2          | 1       | BAD_TYPE | test        | Допустимые значения поля type: ASSIGNABLE, SYSTEM или CUSTOM |
