Feature: Datasets

  Background:
    Given Существует организация
      | ООО НаборыДанных | 1234567890 | Наборов | Набор | EMAIL_13 | testPassword1 |
    And Авторизируемся владельцем организации
    And Отправляется запрос на создание набора "STRING_10" "STRING_10" "STRING_10"

  @OnlyThis
  Scenario Outline: Установка прав на набор данных
    And Отправляется запрос на создание правила для текущего набора данных "<role>" "<principalId>" "<principalType>"
    Then Сервер отвечает со статус-кодом 201
    And Сервер передает Location созданного правила
    Examples:
      | role        | principalId | principalType |
      | VIEWER      | NUMBER_3    | user          |
      | CONTRIBUTOR | NUMBER_3    | user          |
      | OWNER       | NUMBER_3    | user          |
