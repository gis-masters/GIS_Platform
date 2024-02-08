Feature: Регистрация новой организации

  Scenario Outline: Создание организации с указанием валидных данных
    When Отправляется запрос на создание организации
      | <orgName> | <orgPhone> | <adminName> | <adminSurname> | <adminEmail> | <adminPassword> |
    Then Сервер отвечает со статус-кодом 202
    And В заголовке Location передается ID созданной организации
    When Авторизуемся владельцем организации
    When Проверяем создана ли организация
    Then Сервер отвечает со статус-кодом 200
    And Статус организации соответствует "PROVISIONED"
    And Поля совпадают с переданными
    And Существует база данных
    And На Геосервере существует scratch рабочая область и хранилище
    And На Геосервере создан пользователь
    And На Геосервере создана роль
    And На Геосервере пользователь имеет роль
    Then Администратор системы авторизован
    And На Геосервере дан доступ к слоям
    And На Геосервере дан доступ к сервисам
    And На Геосервере дан доступ к rest
    Examples:
      | orgName            | orgPhone   | adminName | adminSurname | adminEmail | adminPassword |
      | ООО БыкиИКоровы    | 1234567890 | Иванов    | Иван         | EMAIL_20   | testPassword1 |
      | ООО 'Бараны&Козлы' | 1234567890 | M'Kyne    | Ivan         | EMAIL_20   | testPassword2 |

  Scenario Outline: Создание огранизации, которая уже существует
    Given Существует организация
      | <orgName> | <orgPhone> | <adminName> | <adminSurname> | <adminEmail> | <adminPassword> |
    When Отправляется повторный запрос на создание организации
    Then Сервер отвечает со статус-кодом 409
    Examples:
      | orgName         | orgPhone   | adminName | adminSurname | adminEmail | adminPassword |
      | ООО БыкиИКоровы | 1234567890 | Иванов    | Иван         | EMAIL_20   | testPassword1 |

  Scenario Outline: Создание организации с указанием невалидных данных (<reason>)
    When Отправляется запрос на создание организации
      | <orgName> | <orgPhone> | <adminName> | <adminSurname> | <adminEmail> | <adminPassword> |
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | orgName    | orgPhone   | adminName | adminSurname | adminEmail        | adminPassword | reason                             |
      | testOrg    | 123456789  | testName  | testSurname  | admin1            | testtestQ1    | Невалидный email                   |
      | STRING_2   | 1234567890 | testName  | testSurname  | admin2@email.com  | testtestQ1    | Короткое название организации      |
      | STRING_501 | 1234567890 | testName  | testSurname  | admin3@email.com  | testtestQ1    | Длинное название организации       |
      | testOrg    | NUMBER_21  | testName  | testSurname  | admin4@email.com  | testtestQ1    | Длинный номер телефона организации |
      | testOrg    | 1234567890 | STRING_0  | testSurname  | admin5@email.com  | testtestQ1    | Пустое имя админа                  |
      | testOrg    | 1234567890 | STRING_61 | testSurname  | admin7@email.com  | testtestQ1    | Длинное имя админа                 |
      | testOrg    | 1234567890 | testName  | STRING_0     | admin8@email.com  | testtestQ1    | Пустая фамилия админа              |
      | testOrg    | 1234567890 | testName  | STRING_101   | admin9@email.com  | testtestQ1    | Длинная фамилия админа             |
      | testOrg    | 1234567890 | testName  | testSurname  | STRING_0          | testtestQ1    | Нет email админа                   |
      | testOrg    | 1234567890 | testName  | testSurname  | EMAIL_61          | testtestQ1    | Длинный email админа               |
      | testOrg    | 1234567890 | testName  | testSurname  | admin12@email.com | STRING_2      | Простой пароль                     |

  Scenario: Одновременное создание нескольких организаций не ломает сервис
    When я отправляю запрос на создание 1 организаций одновременно
    *    я дождался окончания процесса создания для всех организаций
    Then все организации созданы корректно и имеют статус "PROVISIONED" [auth-service]
    *    для всех организаций корректно созданы зависимости в данных [data-service]
    *    на геосервере создано всё необходимое и даны права [geoserver]
