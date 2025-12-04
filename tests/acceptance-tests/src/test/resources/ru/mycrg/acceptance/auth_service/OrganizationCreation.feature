Feature: Регистрация новой организации

  Scenario: Создание организации с указанием валидных данных
    When Отправляется запрос на создание организации
      | name          | phone      | ownerSurname | ownerName | ownerEmail | ownerPassword | specializationId | description |
      | ООО БыкиИКовы | 1234567890 | Иванов       | Иван      | EMAIL_9    | testPassword1 | 1                | MUSTACHE    |
    Then Сервер отвечает со статус-кодом 202
    *    В заголовке Location передается ID созданной организации
    *    Ждем окончания процесса создания организации
    *    Авторизуемся владельцем организации
    *    Проверяем создана ли организация
    *    Сервер отвечает со статус-кодом 200
    *    Статус организации соответствует "PROVISIONED"
    *    Поля совпадают с переданными
    *    Настройки организации включены в зависимости от выбранной специализации "1"
    *    Существует база данных
    *    Согласно специализации 1 созданы: набор данных, таблица с данными, библиотека документов, проект и слои
    *    Согласно специализации 1 создана схема задач
    *    Согласно специализации 1 создана таблица задач
    *    На Геосервере существует scratch рабочая область и хранилище
    *    На Геосервере создан пользователь
    *    На Геосервере создана роль
    *    На Геосервере пользователь имеет роль
    *    Администратор системы авторизован
    *    На Геосервере дан доступ к слоям
    *    На Геосервере дан доступ к сервисам
    *    На Геосервере дан доступ к rest

  Scenario: Создание организации, которая уже существует
    Given Существует любая организация
    When  я отправляю запрос на создание организации используя email уже созданной организации
    Then  Сервер отвечает со статус-кодом 409

  Scenario Outline: Создание организации с указанием невалидных данных (<reason>)
    When Отправляется запрос на создание организации
      | name      | phone      | ownerSurname   | ownerName   | ownerEmail   | ownerPassword   |
      | <orgName> | <orgPhone> | <adminSurname> | <adminName> | <adminEmail> | <adminPassword> |
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | orgName    | orgPhone   | adminName | adminSurname | adminEmail        | adminPassword | reason                             |
      | testOrg    | 123456789  | testName  | testSurname  | admin1            |               | Невалидный email                   |
      | STRING_2   | 1234567890 | testName  | testSurname  | admin2@email.com  |               | Короткое название организации      |
      | STRING_501 | 1234567890 | testName  | testSurname  | admin3@email.com  |               | Длинное название организации       |
      | testOrg    | NUMBER_21  | testName  | testSurname  | admin4@email.com  |               | Длинный номер телефона организации |
      | testOrg    | 1234567890 | STRING_0  | testSurname  | admin5@email.com  |               | Пустое имя админа                  |
      | testOrg    | 1234567890 | STRING_61 | testSurname  | admin7@email.com  |               | Длинное имя админа                 |
      | testOrg    | 1234567890 | testName  | STRING_0     | admin8@email.com  |               | Пустая фамилия админа              |
      | testOrg    | 1234567890 | testName  | STRING_101   | admin9@email.com  |               | Длинная фамилия админа             |
      | testOrg    | 1234567890 | testName  | testSurname  | STRING_0          |               | Нет email админа                   |
      | testOrg    | 1234567890 | testName  | testSurname  | EMAIL_61          |               | Длинный email админа               |
      | testOrg    | 1234567890 | testName  | testSurname  | admin12@email.com | STRING_2      | Простой пароль                     |

  Scenario: Одновременное создание нескольких организаций не ломает сервис
    When я отправляю запрос на создание 1 организаций одновременно
    *    я дождался окончания процесса создания для всех организаций
    Then все организации созданы корректно и имеют статус "PROVISIONED" [auth-service]
    *    для всех организаций корректно созданы зависимости в данных [data-service]
    *    на геосервере создано всё необходимое и даны права [geoserver]
