Feature: Выборка групп слоев проекта

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario Outline: Получение всех групп слоев, когда групп слоев нет
    When Отправляется запрос на создание организации
      | <orgName> | <orgPhone> | <adminName> | <adminSurname> | <adminEmail> | <adminPassword> |
    And в заголовке Location передает ID созданной организации
    Given Существует проект "STRING_10"
    When Пользователь делает запрос на все группы слоев организации
    Then Сервер отвечает со статус-кодом 200
    And Сервер отвечает с пустым телом
    Examples:
      | orgName         | orgPhone   | adminName | adminSurname | adminEmail | adminPassword |
      | ООО БыкиИКоровы | 1234567890 | Иванов    | Иван         | EMAIL_20   | testPassword1 |

  Scenario Outline: Проверка представления созданной группы слоев проекта
    Given Существует проект "STRING_10"
    Given Существует группа слоев проекта "<title>", "<position>"
    When Пользователь делает запрос на текущую группу слоев проекта
    And Представление группы слоев проекта корректно
    Examples:
      | title    | position |
      | STRING_5 | NUMBER_2 |
