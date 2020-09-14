Feature: Регистрация новой организации

  Scenario Outline: Успешное создание организации при отправке валидных данных
    When Создается организация
      | <orgName> | <orgPhone> | <adminName> | <adminSurname> | <adminEmail> | <adminPassword> |
    Then Сервер отвечает со статус-кодом 202
    And в заголовке Location передает ID созданной организации
    When Пользователь пытается авторизоваться
      | <adminEmail> | <adminPassword> |
    Then Сервер авторизует пользователя
    When Пользователь проверяет создана ли организация
    Then Сервер отвечает со статус-кодом 200
    And  Сервер отвечает с полем status = PROVISIONED и поля совпадают с переданными
      | <orgName> | <orgPhone> | <adminName> | <adminSurname> | <adminEmail> |
    Examples:
      | orgName         | orgPhone   | adminName | adminSurname | adminEmail    | adminPassword |
      | ООО БыкиИКоровы | 1234567890 | Иванов    | Иван         | test@email.ru | testPassword1 |

  Scenario Outline: Безуспешное создание организации при отправке повторных данных
    Given Существует организация
      | <orgName> | <orgPhone> | <adminName> | <adminSurname> | <adminEmail> | <adminPassword> |
    When Создается организация
      | <orgName> | <orgPhone> | <adminName> | <adminSurname> | <adminEmail> | <adminPassword> |
    Then Сервер отвечает со статус-кодом 409
    Examples:
      | orgName         | orgPhone   | adminName | adminSurname | adminEmail    | adminPassword |
      | ООО БыкиИКоровы | 1234567890 | Иванов    | Иван         | test@email.ru | testPassword1 |

  Scenario Outline: Безуспешное создание организации при отправке невалидных данных (<reason>)
    When Создается организация
      | <orgName> | <orgPhone> | <adminName> | <adminSurname> | <adminEmail> | <adminPassword> |
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | orgName         | orgPhone       | adminName      | adminSurname    | adminEmail          | adminPassword | reason                             |
      | testOrg         | 123456789      | testName       | testSurname     | email               | testtestQ1    | Невалидный email                   |
      | te              | 1234567890     | testName       | testSurname     | email@email.com     | testtestQ1    | Короткое название организации      |
      | LONG_STRING_500 | 1234567890     | testName       | testSurname     | email@email.com     | testtestQ1    | Длинное название организации       |
      | testOrg         | LONG_NUMBER_20 | testName       | testSurname     | email@email.com     | testtestQ1    | Длинный номер телефона организации |
      | testOrg         | 1234567890     |                | testSurname     | email@email.com     | testtestQ1    | Пустое имя админа                  |
      | testOrg         | 1234567890     | te             | testSurname     | email@email.com     | testtestQ1    | Короткое имя админа                |
      | testOrg         | 1234567890     | LONG_STRING_60 | testSurname     | email@email.com     | testtestQ1    | Длинное имя админа                 |
      | testOrg         | 1234567890     | testName       |                 | email@email.com     | testtestQ1    | Пустая фамилия админа              |
      | testOrg         | 1234567890     | testName       | LONG_STRING_100 | email@email.com     | testtestQ1    | Длинная фамилия админа             |
      | testOrg         | 1234567890     | testName       | testSurname     |                     | testtestQ1    | Нет email админа                   |
      | testOrg         | 1234567890     | testName       | testSurname     | LONG_ADMIN_EMAIL_60 | testtestQ1    | Длинный email админа               |
      | testOrg         | 1234567890     | testName       | testSurname     | email@email.com     | testtest      | Простой пароль                     |
