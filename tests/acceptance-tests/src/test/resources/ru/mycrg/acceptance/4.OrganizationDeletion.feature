Feature: Удаление организации

  @deletion
  Scenario Outline: Удаление с валидными учетными данными
    Given Существует организация
      | <orgName> | <orgPhone> | <adminName> | <adminSurname> | <adminEmail> | <adminPassword> |
    Then Авторизируемся под рутом
    When Посылается запрос на удаление текущей организации
    Then Ждем окончания процесса удаления организации
    And Удалена БД организации
    And На Геосервере отсутствует scratch рабочая область
    And На Геосервере отсутствует пользователь "<adminEmail>"
    And На Геосервере отсутствует роль
    Then Авторизируемся под рутом
    And На Геосервере доступ к слоям. Роль пользователя отсутствует в списке
    And На Геосервере дан доступ к сервисам. Роль пользователя отсутствует в списке
    And На Геосервере дан доступ к rest. Роль пользователя отсутствует в списке
    Examples:
      | orgName         | orgPhone   | adminName | adminSurname | adminEmail    | adminPassword |
      | ООО БыкиИКоровы | 1234567890 | Иванов    | Иван         | try3@delete.me | testPassword1 |

  @deletion
  Scenario: Удаление от имени владельца другой организации
    Given Существует организация
      | ООО Быки    | 1111111111 | Иванов | Иван | bull@org.ru | testPassword1 |
    And Существует организация
      | ООО Медведи | 2222222222 | Иванов | Петр | bear@org.ru | testPassword1 |
    And Авторизируемся пользователем "bear@org.ru" "testPassword1"
    When Посылается запрос на удаление организации "bull@org.ru"
    Then Сервер отвечает со статус-кодом 403

  @deletion
  Scenario Outline: Удаление организации в процессе создания
    Given Отправляется запрос на создание организации
      | <orgName> | <orgPhone> | <adminName> | <adminSurname> | <adminEmail> | <adminPassword> |
    And Сервер отвечает со статус-кодом 202
    And в заголовке Location передает ID созданной организации
    When Авторизируемся под рутом
    Then Посылается запрос на удаление текущей организации
    And Сервер отвечает со статус-кодом 400
    When Ждем окончания процесса создания организации
    Then Посылается запрос на удаление текущей организации
    And Сервер отвечает со статус-кодом 204
    Examples:
      | orgName          | orgPhone   | adminName | adminSurname | adminEmail   | adminPassword |
      | ООО TestDeletion | 1234567890 | Иванов    | Иван         | admin@del.me | testPassword1 |
