Feature: Действия с пользовательскими группами

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | admin@email.ru | testPassword1 |
    When Авторизируемся владельцем организации "admin@email.ru" "testPassword1"

  Scenario Outline: Создание пользовательской группы c валидными данными
    When Администратор создает группу "<groupName>", "<groupDescription>"
    Then Сервер отвечает со статус-кодом 200
    Then Сервер передает ID созданный группы
    When Администратор делает запрос на указанную группу
    Then Сервер отвечает со статус-кодом 200
    Then Поля группы совпадают с переданными "<groupName>", "<groupDescription>"
    Examples:
      | groupName     | groupDescription     |
      | testGroupName | testGroupDescription |

#    TODO: Повторное создание пользовательской группы c валидными данными
#  Scenario Outline: Повторное создание пользовательской группы c валидными данными
#    Given Существует пользовательская группа "<groupName>", "<groupDescription>"
#    When Администратор создает группу "<groupName>", "<groupDescription>"
#    Then Сервер отвечает со статус-кодом 409
#    Examples:
#      | groupName     | groupDescription     |
#      | testGroupName | testGroupDescription |

  Scenario Outline:Создание пользовательской группы c  невалидными данными (<reason>)
    When Администратор создает группу "<groupName>", "<groupDescription>"
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | groupName     | groupDescription     | reason                                    |
      | STRING_0      | testGroupDescription | Пустое имя пользовательской группы        |
      | STRING_500    | testGroupDescription | Длинное имя пользовательской группы       |
      | testGroupName | STRING_500           | Длинное описание пользовательской группы  |
      | STRING_2      | testGroupDescription | Короткое имя пользовательской группы      |
      | testGroupName | STRING_2             | Короткое описание пользовательской группы |

  Scenario Outline:Выборка всех пользовательских групп
    Given Существует пользовательская группа "<groupName>", "<groupDescription>"
    When Администратор делает запрос на все группы
    Then В ответе есть пункт groups
    Examples:
      | groupName     | groupDescription     |
      | testGroupName | testGroupDescription |

  Scenario Outline: Выборка всех пользовательских групп c сортировкой (<sorting factor>|<sorting direction>)
    Given Существует пользовательская группа "<groupName>", "<groupDescription>"
    When Администратор делает запрос с сортировкой по "<sorting factor>" и "<sorting direction>" на все пользовательские группы
    Then В ответе есть пункт groups
    And Данные групп отсортированы по "<sorting factor>" и "<sorting direction>"
    Examples:
      | groupName     | groupDescription     | sorting factor | sorting direction |
      | testGroupName | testGroupDescription | createdAt      | asc               |
      | testGroupName | testGroupDescription | name           | asc               |
      | testGroupName | testGroupDescription | description    | asc               |
      | testGroupName | testGroupDescription | createdAt      | desc              |
      | testGroupName | testGroupDescription | name           | desc              |
      | testGroupName | testGroupDescription | description    | desc              |

  Scenario Outline: Выборка всех пользовательских групп постранично (<groupsPerPage> page/pages)
    Given Существует пользовательская группа "<groupName>", "<groupDescription>"
    When Администратор делает постраничный запрос на все пользовательские группы
    Then Сервер отвечает со статус-кодом 200
    And Количество страниц пропорционально количеству групп "<groupsPerPage>"
    And На всех страницах есть группы "<groupsPerPage>"
    Examples:
      | groupName     | groupDescription     | groupsPerPage |
      | testGroupName | testGroupDescription | 1             |
      | testGroupName | testGroupDescription | 2             |
      | testGroupName | testGroupDescription | 3             |

  Scenario Outline:Обновление данных пользовательской группы
    Given Существует пользовательская группа "<groupName>", "<groupDescription>"
    When Администратор изменяет поля группы "<newGroupName>", "<newGroupDescription>"
    Then Сервер отвечает со статус-кодом 200
    When Администратор делает запрос на указанную группу
    Then Сервер отвечает со статус-кодом 200
    And Поля группы совпадают с переданными "<newGroupName>", "<newGroupDescription>"
    Examples:
      | groupName     | groupDescription     | newGroupName    | newGroupDescription    |
      | testGroupName | testGroupDescription | upTestGroupName | upTestGroupDescription |

  Scenario Outline: Добавление пользователя в пользовательскую группу
    Given Существует пользовательская группа "<groupName>", "<groupDescription>"
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Администратор добавляет пользователя в пользовательскую группу
    When Администратор делает запрос на указанную группу
    Then В пользовательской групппе присутствует указанный пользователь
    Examples:
      | groupName     | groupDescription     | userName     | userSurname     | userEmail     | userPassword |
      | testGroupName | testGroupDescription | testUserName | testUserSurname | user@user.com | testtestQ1   |

  Scenario Outline: Удаление пользователя из пользовательской группы
    Given Существует пользовательская группа "<groupName>", "<groupDescription>"
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Администратор удаляет пользователя из пользовательской группы
    When Администратор делает запрос на указанную группу
    Then Сервер отвечает со статус-кодом 200
    And В пользовательской групппе отсутствует указанный пользователь
    Examples:
      | groupName      | groupDescription      | userName      | userSurname      | userEmail      | userPassword |
      | testGroupNameD | testGroupDescriptionD | testUserNameD | testUserSurnameD | userD@user.com | testtestQ1   |

  Scenario Outline: Удаление пользовательской группы
    Given Существует пользовательская группа "<groupName>", "<groupDescription>"
    When Администратор организации удаляет пользовательскую группу
    When Администратор делает запрос на указанную группу
    Then Сервер отвечает со статус-кодом 404
    Examples:
      | groupName     | groupDescription     |
      | testGroupName | testGroupDescription |
