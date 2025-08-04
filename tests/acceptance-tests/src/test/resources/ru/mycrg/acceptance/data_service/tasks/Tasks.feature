#Тест нечестный. Ловим 400 потому что "некий пользователь" не подчинённый
#Возможно исправим в задаче 3312
#и вообще цифры то захардкожены. Где гарантия что юзеры id's=2,1 вообще в этой организации?
Feature: Проверка сущности task

  Background:
    Given Существует организация
      | name                | phone      | ownerSurname | ownerName | ownerEmail    | ownerPassword         | specializationId |
      | ООО ASSIGNABLE task | 1234567890 | Допустимые   | Значения  | task0entity@t | DEFAULT_TEST_PASSWORD | 1                |
    Given Владелец организации авторизован
    Given Существует некий пользователь

  Scenario Outline: Недопустимо создание задач, имеющих невалидный тип. <reason>
    When Отправляется запрос на создание задачи <assignedTo> <ownerId> "<type>" "<description>"
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | assignedTo | ownerId | type     | description | reason                                                       |
      | 2          | 1       | BAD_TYPE | test        | Допустимые значения поля type: ASSIGNABLE, SYSTEM или CUSTOM |