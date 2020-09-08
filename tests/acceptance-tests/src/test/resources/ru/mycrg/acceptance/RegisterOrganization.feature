Feature: Регистрация новой организации

  Scenario: Успешное создание организации при отправке валидных данных
    When Пользователь вводит корректные данные
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | test@email.ru | testPassword1 |
    Then Сервер отвечает со статус-кодом 202
    And в заголовке Location передает ID созданной организации
    When Пользователь пытается авторизоваться
      | test@email.ru | testPassword1 | password |
    Then Сервер авторизует пользователя
    When Пользователь проверяет создана ли организация
    Then Сервер отвечает со статус-кодом 200
    And  Сервер отвечает с полем status = PROVISIONED

  Scenario: Неуспешное создание организации при отправке повторных данных
    When Пользователь вводит корректные данные
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | test@email.ru | testPassword1 |
    Then Сервер отвечает со статус-кодом 409

  Scenario Outline: Неуспешное создание организации при отправке невалидных данных (<reason>)
    When Пользователь вводит некорректные данные
      | <orgName> | <orgPhone> | <adminName> | <adminSurname> | <adminEmail> | <adminPassword> |
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | orgName       | orgPhone       | adminName       | adminSurname       | adminEmail       | adminPassword | reason                             |
      | testOrg       | 123456789      | testName        | testSurname        | email            | testtestQ1    | Невалидный email                   |
      | te            | 1234567890     | testName        | testSurname        | email@email.com  | testtestQ1    | Короткое название организации      |
      | LONG_ORG_NAME | 1234567890     | testName        | testSurname        | email@email.com  | testtestQ1    | Длинное название организации       |
      | testOrg       | LONG_ORG_PHONE | testName        | testSurname        | email@email.com  | testtestQ1    | Длинный номер телефона организации |
      | testOrg       | 1234567890     |                 | testSurname        | email@email.com  | testtestQ1    | Пустое имя админа                  |
      | testOrg       | 1234567890     | te              | testSurname        | email@email.com  | testtestQ1    | Короткое имя админа                |
      | testOrg       | 1234567890     | LONG_ADMIN_NAME | testSurname        | email@email.com  | testtestQ1    | Длинное имя админа                 |
      | testOrg       | 1234567890     | testName        |                    | email@email.com  | testtestQ1    | Пустая фамилия админа              |
      | testOrg       | 1234567890     | testName        | LONG_ADMIN_SURNAME | email@email.com  | testtestQ1    | Длинная фамилия админа             |
      | testOrg       | 1234567890     | testName        | testSurname        |                  | testtestQ1    | Нет email админа                   |
      | testOrg       | 1234567890     | testName        | testSurname        | LONG_ADMIN_EMAIL | testtestQ1    | Длинный email админа               |
      | testOrg       | 1234567890     | testName        | testSurname        | email@email.com  | testtest      | Простой пароль                     |