Feature: Регистрация новой организации

  Scenario Outline: Создание организации с указанием валидных данных
    When Создается организация
      | <orgName> | <orgPhone> | <adminName> | <adminSurname> | <adminEmail> | <adminPassword> |
    Then Сервер отвечает со статус-кодом 202
    And в заголовке Location передает ID созданной организации
    When Администратор пытается авторизоваться
      | <adminEmail> | <adminPassword> |
    Then Сервер авторизует администратора
    When Администратор проверяет создана ли организация
    Then Сервер отвечает со статус-кодом 200
    And  Сервер отвечает с полем status = PROVISIONED и поля совпадают с переданными
      | <orgName> | <orgPhone> | <adminName> | <adminSurname> | <adminEmail> |
    Examples:
      | orgName         | orgPhone   | adminName | adminSurname | adminEmail     | adminPassword |
      | ООО БыкиИКоровы | 1234567890 | Иванов    | Иван         | admin@email.ru | testPassword1 |

  Scenario Outline: Создание огранизации, которая уже существует
    Given Существует организация
      | <orgName> | <orgPhone> | <adminName> | <adminSurname> | <adminEmail> | <adminPassword> |
    When Создается организация
      | <orgName> | <orgPhone> | <adminName> | <adminSurname> | <adminEmail> | <adminPassword> |
    Then Сервер отвечает со статус-кодом 409
    Examples:
      | orgName         | orgPhone   | adminName | adminSurname | adminEmail     | adminPassword |
      | ООО БыкиИКоровы | 1234567890 | Иванов    | Иван         | admin@email.ru | testPassword1 |

  Scenario Outline: Создание организации с указанием невалидных данных (<reason>)
    When Создается организация
      | <orgName> | <orgPhone> | <adminName> | <adminSurname> | <adminEmail> | <adminPassword> |
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | orgName         | orgPhone       | adminName      | adminSurname    | adminEmail          | adminPassword | reason                             |
      | testOrg         | 123456789      | testName       | testSurname     | admin1              | testtestQ1    | Невалидный email                   |
      | te              | 1234567890     | testName       | testSurname     | admin2@email.com    | testtestQ1    | Короткое название организации      |
      | LONG_STRING_500 | 1234567890     | testName       | testSurname     | admin3@email.com    | testtestQ1    | Длинное название организации       |
      | testOrg         | LONG_NUMBER_20 | testName       | testSurname     | admin4@email.com    | testtestQ1    | Длинный номер телефона организации |
      | testOrg         | 1234567890     |                | testSurname     | admin5@email.com    | testtestQ1    | Пустое имя админа                  |
      | testOrg         | 1234567890     | te             | testSurname     | admin6@email.com    | testtestQ1    | Короткое имя админа                |
      | testOrg         | 1234567890     | LONG_STRING_60 | testSurname     | admin7@email.com    | testtestQ1    | Длинное имя админа                 |
      | testOrg         | 1234567890     | testName       |                 | admin8@email.com    | testtestQ1    | Пустая фамилия админа              |
      | testOrg         | 1234567890     | testName       | LONG_STRING_100 | admin9@email.com    | testtestQ1    | Длинная фамилия админа             |
      | testOrg         | 1234567890     | testName       | testSurname     |                     | testtestQ1    | Нет email админа                   |
      | testOrg         | 1234567890     | testName       | testSurname     | LONG_ADMIN_EMAIL_60 | testtestQ1    | Длинный email админа               |
      | testOrg         | 1234567890     | testName       | testSurname     | admin12@email.com   | testtest      | Простой пароль                     |
