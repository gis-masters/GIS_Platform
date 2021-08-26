Feature: Действия с пользовательскими группами

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario Outline: Создание пользовательской группы c валидными данными
    When Администратор создает группу "<groupName>", "<groupDescription>"
    Then Сервер отвечает со статус-кодом 200
    Then Сервер передает ID созданный группы
    When Администратор делает запрос на указанную группу
    Then Сервер отвечает со статус-кодом 200
    Then Поля группы совпадают с переданными
    Examples:
      | groupName | groupDescription |
      | STRING_15 | STRING_15        |

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
    Then В ответе есть пункт "groups"
    Examples:
      | groupName | groupDescription |
      | STRING_15 | STRING_15        |

  Scenario Outline: Выборка всех пользовательских групп c сортировкой (<sorting factor> | <sorting direction>)
    Given Существуют пользовательские группы
      | STRING_15 | STRING_15 |
      | STRING_15 | STRING_15 |
      | STRING_15 | STRING_15 |
      | STRING_15 | STRING_15 |
      | STRING_15 | STRING_15 |
      | STRING_15 | STRING_15 |
    When Администратор делает запрос с сортировкой по "<sorting factor>" и "<sorting direction>" на все пользовательские группы
    Then В ответе есть пункт "groups"
    And Данные отсортированы по "<sorting factor>" и "<sorting direction>" в "groups"
    Examples:
      | sorting factor | sorting direction |
      | createdAt      | asc               |
      | name           | asc               |
      | description    | asc               |
      | createdAt      | desc              |
      | name           | desc              |
      | description    | desc              |

  Scenario Outline: Выборка всех пользовательских групп постранично (<groupsPerPage> page/pages)
    Given Существуют пользовательские группы
      | STRING_15 | STRING_15 |
      | STRING_15 | STRING_15 |
      | STRING_15 | STRING_15 |
      | STRING_15 | STRING_15 |
      | STRING_15 | STRING_15 |
      | STRING_15 | STRING_15 |
    When Администратор делает постраничный запрос на группы "groups"
    Then Сервер отвечает со статус-кодом 200
    And Количество страниц групп "groups" пропорционально "<groupsPerPage>"
    And На всех страницах групп "groups" есть "<groupsPerPage>"
    Examples:
      | groupsPerPage |
      | 1             |
      | 2             |
      | 3             |

  Scenario Outline:Обновление данных пользовательской группы
    Given Существует пользовательская группа "<groupName>", "<groupDescription>"
    When Администратор изменяет поля группы "<newGroupName>", "<newGroupDescription>"
    Then Сервер отвечает со статус-кодом 200
    When Администратор делает запрос на указанную группу
    Then Сервер отвечает со статус-кодом 200
    And Поля группы совпадают с переданными
    Examples:
      | groupName | groupDescription | newGroupName | newGroupDescription |
      | STRING_15 | STRING_15        | STRING_15    | STRING_15           |

  Scenario Outline: Добавление пользователя в пользовательскую группу
    Given Существует пользовательская группа "<groupName>", "<groupDescription>"
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Администратор добавляет пользователя в пользовательскую группу
    When Администратор делает запрос на указанную группу
    Then В пользовательской групппе присутствует указанный пользователь
    Examples:
      | groupName | groupDescription | userName     | userSurname     | userEmail | userPassword |
      | STRING_15 | STRING_15        | testUserName | testUserSurname | EMAIL_20  | testtestQ1   |

  Scenario Outline: Удаление пользователя из пользовательской группы
    Given Существует пользовательская группа "<groupName>", "<groupDescription>"
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Администратор удаляет пользователя из пользовательской группы
    When Администратор делает запрос на указанную группу
    Then Сервер отвечает со статус-кодом 200
    And В пользовательской групппе отсутствует указанный пользователь
    Examples:
      | groupName | groupDescription | userName      | userSurname      | userEmail | userPassword |
      | STRING_15 | STRING_15        | testUserNameD | testUserSurnameD | EMAIL_20  | testtestQ1   |

  Scenario Outline: Удаление пользовательской группы
    Given Существует пользовательская группа "<groupName>", "<groupDescription>"
    When Администратор организации удаляет пользовательскую группу
    When Администратор делает запрос на указанную группу
    Then Сервер отвечает со статус-кодом 404
    Examples:
      | groupName | groupDescription |
      | STRING_15 | STRING_15        |

  Scenario: При удалении пользовательской группы, удаляются и её разрешения.
    Given Существует пользовательская группа "STRING_15", "STRING_15"
    Given Существует проект "STRING_10"
    Given Администратор даёт доступ: "VIEWER" для текущей пользовательской группы на текущий проект
    Given Существуют заданное кол-во наборов: 1
    Given Администратор даёт доступ: "VIEWER" для текущей группы на текущий набор данных
    When Администратор организации удаляет пользовательскую группу
    Then Разрешения на наборы данных, выданные удаленной пользовательской группе, были удалены
    And Разрешения на текущий проект, выданные удаленной пользовательской группе, были удалены
