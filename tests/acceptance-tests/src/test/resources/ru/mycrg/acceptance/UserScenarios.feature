Feature: Добавление нового пользователя

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | admin@email.ru | testPassword1 |
    When Авторизируемся владельцем организации "admin@email.ru" "testPassword1"

  Scenario Outline: Создание пользователя c валидными данными
    When Администратор создает пользователя
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    Then Сервер отвечает со статус-кодом 202
    And в заголовке Location передает ID созданного пользователя
    When Администратор делает запрос на указанного пользователя
    Then Поля пользователя совпадают с переданными "<userName>", "<userSurname>", "<userEmail>"
    And Пользователю присвоена роль = "USER"
    When Авторизируемся пользователем "<userEmail>" "<userPassword>"
    Then Сервер авторизует пользователя
    Examples:
      | userName     | userSurname     | userEmail     | userPassword |
      | testUserName | testUserSurname | user@user.com | testtestQ1   |

  Scenario Outline: Повторное создание пользователя c валидными данными
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Администратор создает пользователя
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    Then Сервер отвечает со статус-кодом 409
    Examples:
      | userName     | userSurname     | userEmail     | userPassword |
      | testUserName | testUserSurname | user@user.com | testtestQ1   |

  Scenario Outline: Создание пользователя c невалидными данными (<reason>)
    When Администратор создает пользователя
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | userName       | userSurname     | userEmail          | userPassword | reason                        |
      | testUserName   | testUserSurname | user1              | testtestQ1   | Невалидный email пользователя |
      |                | testUserSurname | user2@user.com     | testtestQ1   | Пустое имя пользователя       |
      | te             | testUserSurname | user3@user.com     | testtestQ1   | Короткое имя пользователя     |
      | LONG_STRING_60 | testUserSurname | user4@user.com     | testtestQ1   | Длинное имя пользователя      |
      | testUserName   | LONG_STRING_100 | user5@user.com     | testtestQ1   | Длинная фамилия пользователя  |
      | testUserName   |                 | user6@user.com     | testtestQ1   | Пустая фамилия пользователя   |
      | testUserName   | testUserSurname |                    | testtestQ1   | Нет email пользователя        |
      | testUserName   | testUserSurname | LONG_USER_EMAIL_60 | testtestQ1   | Длинный email пользователя    |
      | testUserName   | testUserSurname | user9@user.com     | testtest     | Простой пароль пользователя   |

  Scenario Outline: Выборка всех пользователей
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Администратор делает запрос на всех пользователей
    Then Сервер отвечает со статус-кодом 200
    And В ответе есть пункт users
    Examples:
      | userName     | userSurname     | userEmail     | userPassword |
      | testUserName | testUserSurname | user@user.com | testtestQ1   |

  Scenario Outline: Выборка всех пользователей c сортировкой (<sorting factor>|<sorting direction>)
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Администратор делает запрос с сортировкой по "<sorting factor>" и "<sorting direction>" на всех пользователей
    Then Сервер отвечает со статус-кодом 200
    And В ответе есть пункт users
    And Данные отсортированы по "<sorting factor>" и "<sorting direction>"
    Examples:
      | userName     | userSurname     | userEmail     | userPassword | sorting factor | sorting direction |
      | testUserName | testUserSurname | user@user.com | testtestQ1   | email          | asc               |
      | testUserName | testUserSurname | user@user.com | testtestQ1   | username       | asc               |
      | testUserName | testUserSurname | user@user.com | testtestQ1   | surName        | asc               |
      | testUserName | testUserSurname | user@user.com | testtestQ1   | createdAt      | asc               |
      | testUserName | testUserSurname | user@user.com | testtestQ1   | email          | desc              |
      | testUserName | testUserSurname | user@user.com | testtestQ1   | username       | desc              |
      | testUserName | testUserSurname | user@user.com | testtestQ1   | surName        | desc              |
      | testUserName | testUserSurname | user@user.com | testtestQ1   | createdAt      | desc              |

  Scenario Outline: Выборка всех пользователей постранично (<usersPerPage> page/pages)
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Администратор делает постраничный запрос на всех пользователей "<usersPerPage>"
    Then Сервер отвечает со статус-кодом 200
    And Количество страниц пропорционально "<usersPerPage>"
    And На всех страницах есть пользователи "<usersPerPage>"
    Examples:
      | userName     | userSurname     | userEmail     | userPassword | usersPerPage |
      | testUserName | testUserSurname | user@user.com | testtestQ1   | 1            |
      | testUserName | testUserSurname | user@user.com | testtestQ1   | 2            |
      | testUserName | testUserSurname | user@user.com | testtestQ1   | 3            |

  Scenario Outline: Удаление пользователя
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Администратор организации удаляет пользователя
    Then Сервер отвечает со статус-кодом 204
    When Пытаемся авторизоваться пользователем "<userEmail>" "<userPassword>"
    Then Сервер отвечает со статус-кодом 401
    Examples:
      | userName     | userSurname     | userEmail     | userPassword |
      | testUserName | testUserSurname | user@user.com | testtestQ1   |
