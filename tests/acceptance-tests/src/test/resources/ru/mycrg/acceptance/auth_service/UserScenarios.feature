Feature: Действия с пользователями

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario Outline: Создание пользователя c валидными данными
    When Администратор создает пользователя
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    Then Сервер отвечает со статус-кодом 202
    And в заголовке Location передает ID созданного пользователя
    When Администратор делает запрос на созданного пользователя
    Then Поля пользователя совпадают с переданными
    And Пользователю присвоена роль = "USER"
    When Авторизируемся пользователем
    Examples:
      | userName     | userSurname     | userEmail | userPassword |
      | testUserName | testUserSurname | EMAIL_20  | testtestQ1   |

  Scenario Outline: Повторное создание пользователя c валидными данными
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Администратор повторно создает пользователя
    Then Сервер отвечает со статус-кодом 409
    Examples:
      | userName     | userSurname     | userEmail | userPassword |
      | testUserName | testUserSurname | EMAIL_20  | testtestQ1   |

  Scenario Outline: Создание пользователя c невалидными данными (<reason>)
    When Администратор создает пользователя
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | userName     | userSurname     | userEmail      | userPassword | reason                        |
      | testUserName | testUserSurname | user1          | testtestQ1   | Невалидный email пользователя |
      | STRING_0     | testUserSurname | user2@user.com | testtestQ1   | Пустое имя пользователя       |
      | STRING_2     | testUserSurname | user3@user.com | testtestQ1   | Короткое имя пользователя     |
      | STRING_61    | testUserSurname | user4@user.com | testtestQ1   | Длинное имя пользователя      |
      | testUserName | STRING_101      | user5@user.com | testtestQ1   | Длинная фамилия пользователя  |
      | testUserName | STRING_0        | user6@user.com | testtestQ1   | Пустая фамилия пользователя   |
      | testUserName | testUserSurname | STRING_0       | testtestQ1   | Нет email пользователя        |
      | testUserName | testUserSurname | EMAIL_61       | testtestQ1   | Длинный email пользователя    |
      | testUserName | testUserSurname | user9@user.com | STRING_2     | Простой пароль пользователя   |

  Scenario Outline: Выборка всех пользователей
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Администратор делает запрос на всех пользователей
    Then Сервер отвечает со статус-кодом 200
    And В ответе есть пункт "users"
    Examples:
      | userName     | userSurname     | userEmail | userPassword |
      | testUserName | testUserSurname | EMAIL_20  | testtestQ1   |

  Scenario Outline: Выборка всех пользователей c сортировкой (<sorting factor>|<sorting direction>)
    Given Существуют пользователи
      | STRING_15 | STRING_15 | EMAIL_20 | testtestQ1 |
      | STRING_15 | STRING_15 | EMAIL_20 | testtestQ1 |
      | STRING_15 | STRING_15 | EMAIL_20 | testtestQ1 |
      | STRING_15 | STRING_15 | EMAIL_20 | testtestQ1 |
      | STRING_15 | STRING_15 | EMAIL_20 | testtestQ1 |
      | STRING_15 | STRING_15 | EMAIL_20 | testtestQ1 |
    When Администратор делает запрос с сортировкой по "<sorting factor>" и "<sorting direction>" на всех пользователей
    Then Сервер отвечает со статус-кодом 200
    And В ответе есть пункт "users"
    And Данные отсортированы по "<sorting factor>" и "<sorting direction>" в "users"
    Examples:
      | sorting factor | sorting direction |
      | email          | asc               |
      | username       | asc               |
      | surName        | asc               |
      | createdAt      | asc               |
      | email          | desc              |
      | username       | desc              |
      | surName        | desc              |
      | createdAt      | desc              |

  Scenario Outline: Выборка всех пользователей постранично (<usersPerPage> page/pages)
    Given Существуют пользователи
      | STRING_15 | STRING_15 | EMAIL_20 | testtestQ1 |
      | STRING_15 | STRING_15 | EMAIL_20 | testtestQ1 |
      | STRING_15 | STRING_15 | EMAIL_20 | testtestQ1 |
      | STRING_15 | STRING_15 | EMAIL_20 | testtestQ1 |
      | STRING_15 | STRING_15 | EMAIL_20 | testtestQ1 |
      | STRING_15 | STRING_15 | EMAIL_20 | testtestQ1 |
      | STRING_15 | STRING_15 | EMAIL_20 | testtestQ1 |
      | STRING_15 | STRING_15 | EMAIL_20 | testtestQ1 |
    When Администратор делает постраничный запрос на пользователей "users"
    Then Сервер отвечает со статус-кодом 200
    And Количество страниц пользователей "users" пропорционально "<usersPerPage>"
    And На всех страницах пользователей "users" есть "<usersPerPage>"
    Examples:
      | usersPerPage |
      | 1            |
      | 2            |
      | 3            |

  Scenario Outline: Удаление пользователя
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Администратор организации удаляет пользователя
    Then Сервер отвечает со статус-кодом 204
    And Пользователь не может авторизоваться
    Examples:
      | userName     | userSurname     | userEmail | userPassword |
      | testUserName | testUserSurname | EMAIL_20  | testtestQ1   |
