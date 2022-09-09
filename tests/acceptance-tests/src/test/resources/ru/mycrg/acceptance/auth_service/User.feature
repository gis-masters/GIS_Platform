Feature: Действия с пользователями

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario Outline: Создание пользователя c валидными данными
    When Администратор создает некого пользователя "<userName>" "<userSurname>" "<userEmail>" "<userPassword>" "<middleName>" "<job>" "<phone>" "<department>"
    Then Сервер отвечает со статус-кодом 202
    And в заголовке Location передает ID созданного пользователя
    When Администратор делает запрос на созданного пользователя
    Then Поля пользователя совпадают с переданными
    And Пользователю присвоена роль = "USER"
    When Авторизируемся пользователем
    Then Сервер отвечает со статус-кодом 200
    Examples:
      | userName         | userSurname | userEmail | userPassword | middleName | job       | phone     | department |
      | BaseUserName     | STRING_10   | EMAIL_20  | testtestQ1   | STRING_10  |           |           |            |
      | ExtendedUserName | STRING_10   | EMAIL_20  | testtestQ1   | STRING_10  | STRING_10 | NUMBER_10 | STRING_10  |

  Scenario Outline: Нельзя создать пользователя c одинаковым email
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Администратор повторно создает пользователя
    Then Сервер отвечает со статус-кодом 409
    Examples:
      | userName     | userSurname     | userEmail | userPassword |
      | testUserName | testUserSurname | EMAIL_20  | testtestQ1   |

  Scenario Outline: Создание пользователя c невалидными данными (<reason>)
    When Администратор создает пользователя
      | <userName> | <userSurname> | <userEmail> | <userPassword> | <middleName> | <job> | <phone> | <department> |
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | userName     | userSurname     | userEmail              | userPassword | middleName | job        | phone     | department | reason                        |
      | testUserName | testUserSurname | invalidUser1           | testtestQ1   |            |            |           |            | Невалидный email пользователя |
      | STRING_0     | testUserSurname | invalidUser2@user.com  | testtestQ1   |            |            |           |            | Пустое имя пользователя       |
      | STRING_2     | testUserSurname | invalidUser3@user.com  | testtestQ1   |            |            |           |            | Короткое имя пользователя     |
      | STRING_61    | testUserSurname | invalidUser4@user.com  | testtestQ1   |            |            |           |            | Длинное имя пользователя      |
      | testUserName | STRING_101      | invalidUser5@user.com  | testtestQ1   |            |            |           |            | Длинная фамилия пользователя  |
      | testUserName | STRING_0        | invalidUser6@user.com  | testtestQ1   |            |            |           |            | Пустая фамилия пользователя   |
      | testUserName | testUserSurname | STRING_0               | testtestQ1   |            |            |           |            | Нет email пользователя        |
      | testUserName | testUserSurname | EMAIL_61               | testtestQ1   |            |            |           |            | Длинный email пользователя    |
      | testUserName | testUserSurname | invalidUser9@user.com  | STRING_2     |            |            |           |            | Простой пароль пользователя   |
      | testUserName | testUserSurname | invalidUser10@user.com | testtestQ1   | STRING_2   | STRING_10  | NUMBER_10 | geoplan    | Короткое отчество             |
      | testUserName | testUserSurname | invalidUser11@user.com | testtestQ1   | STRING_52  | STRING_10  | NUMBER_10 | geoplan    | Длинное отчество              |
      | testUserName | testUserSurname | invalidUser12@user.com | testtestQ1   | STRING_10  | STRING_252 | NUMBER_10 | geoplan    | Длинная должность             |
      | testUserName | testUserSurname | invalidUser13@user.com | testtestQ1   | STRING_10  | STRING_10  | NUMBER_22 | geoplan    | Длинный телефон               |
      | testUserName | testUserSurname | invalidUser13@user.com | testtestQ1   | STRING_10  | STRING_10  | NUMBER_10 | STRING_201 | Длинное название организации  |

  Scenario: Активация/деактивация пользователя
    Given Существует пользователь
      | enableUser | enableUser | EMAIL_10 | testtestQ1 |
    Given Администратор делает запрос на изменение статуса пользователя на "false"
    Then Статус пользователя равен "false"
    And Пользователь не может авторизоваться
    When Администратор делает запрос на изменение статуса пользователя на "true"
    Then Статус пользователя равен "true"
    Then Авторизируемся пользователем
    And Сервер отвечает со статус-кодом 200

  Scenario Outline: Выборка детальной инфы текущего пользователя
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Авторизируемся пользователем
    Then Эндпоинт на выборку инфы текущего пользователя доступен и тело имеет корректное представление
    Examples:
      | userName | userSurname | userEmail | userPassword |
      | fizname  | fizsurname  | EMAIL_10  | aA111111     |

  Scenario Outline: Выборка всех пользователей доступна авторизованным пользователям с любыми ролями
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    Given Авторизируемся пользователем
    When Отправляется запрос на выборку всех пользователей
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

  Scenario Outline: Обновление полей пользователя администратором организации
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Пользователь делает запрос на обновление пользователя
      | <newUserName> | <newUserSurname> | <newUserPassword> | <newUserIsEnabled> |
    Then Сервер отвечает со статус-кодом 200
    When Администратор делает запрос на созданного пользователя
    Then Поля пользователя обновлены
      | <newUserName> | <newUserSurname> | <newUserIsEnabled> |
    When Авторизируемся пользователем
    Then Сервер отвечает со статус-кодом 200
    Examples:
      | userName  | userSurname | userEmail | userPassword | newUserName | newUserSurname | newUserPassword | newUserIsEnabled |
      | STRING_10 | STRING_10   | EMAIL_20  | testtestQ1   | UpdUserName | UpdUserSurname | testtestQ2      | true             |

  Scenario Outline: Обновление полей пользователя чужим администратором организации
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Отправляется запрос на создание организации
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации
    When Пользователь делает запрос на обновление пользователя
      | <newUserName> | <newUserSurname> | <newUserPassword> |
    Then Сервер отвечает со статус-кодом 404
    Examples:
      | userName  | userSurname | userEmail | userPassword | newUserName | newUserSurname | newUserPassword |
      | STRING_10 | STRING_10   | EMAIL_20  | testtestQ1   | UpdUserName | UpdUserSurname | testtestQ2      |

  Scenario Outline: Обновление полей пользователя самим пользователем
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    Given Авторизируемся пользователем
    When Пользователь делает запрос на обновление пользователя
      | <newUserName> | <newUserSurname> | <newUserPassword> |
    Then Сервер отвечает со статус-кодом 200
    When Пользователь делает запрос на самого себя
    Then Поля пользователя обновлены
      | <newUserName> | <newUserSurname> |
    When Авторизируемся пользователем
    Then Сервер отвечает со статус-кодом 200
    Examples:
      | userName  | userSurname | userEmail | userPassword | newUserName | newUserSurname | newUserPassword |
      | STRING_10 | STRING_10   | EMAIL_20  | testtestQ1   | UpdUserName | UpdUserSurname | testtestQ2      |

  Scenario Outline: Обновление полей пользователя другим пользователем
    Given Существует пользователь
      | STRING_15 | STRING_15 | EMAIL_10 | testtestQ1 |
    Given Существует пользователь
      | STRING_15 | STRING_15 | EMAIL_10 | testtestQ1 |
    Given Авторизируемся пользователем
    When Пользователь делает запрос на обновление чужого пользователя
      | <newUserName> | <newUserSurname> | <newUserPassword> |
    Then Сервер отвечает со статус-кодом 404
    Examples:
      | newUserName | newUserSurname | newUserPassword |
      | UpdUserName | UpdUserSurname | testtestQ2      |

  Scenario Outline: Удаление пользователя
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Администратор организации удаляет пользователя
    Then Сервер отвечает со статус-кодом 204
    And Пользователь не может авторизоваться
    Examples:
      | userName     | userSurname     | userEmail | userPassword |
      | testUserName | testUserSurname | EMAIL_20  | testtestQ1   |

  Scenario: При удалении пользователя, удаляются все его разрешения.
    Given Существует некий пользователь
    Given Существует проект "STRING_10"
    Given Администратор даёт доступ: "VIEWER" для текущего пользователя на текущий проект
    Given Существуют заданное кол-во наборов: 1
    Given Администратор даёт доступ: "VIEWER" для текущего пользователя на текущий набор данных
    When Администратор организации удаляет пользователя
    Then Разрешения на наборы данных, выданные удаленному пользователю, были удалены
    And Разрешения на текущий проект, выданные удаленному пользователю, были удалены

  Scenario: При удалении пользователя на геосервере должна удалиться и роль связанная с ним
    Given Существует некий пользователь
    When Администратор организации удаляет пользователя
    Then На геосервере удалилась роль, связанная с пользователем

  Scenario: Пользователь в email которого присутствуют спецсимволы успешно сохраняется на геосервере
    When Существует пользователь у которого email содержит спецсимволы
    Then Администратор делает запрос на созданного пользователя
    And На Геосервере создан пользователь
    And Роль пользователя существует на геосервере
