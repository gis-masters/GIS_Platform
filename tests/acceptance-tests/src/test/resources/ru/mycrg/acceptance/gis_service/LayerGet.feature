Feature: Выборка слоев проекта

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario Outline: Получение всех слоев, когда слоев нет
    When Отправляется запрос на создание организации
      | <orgName> | <orgPhone> | <adminName> | <adminSurname> | <adminEmail> | <adminPassword> |
    And В заголовке Location передается ID созданной организации
    Given Существует проект "STRING_10"
    When Пользователь делает запрос на все слои организации
    Then Сервер отвечает со статус-кодом 200
    And Сервер отвечает с пустым телом
    Examples:
      | orgName         | orgPhone   | adminName | adminSurname | adminEmail | adminPassword |
      | ООО БыкиИКоровы | 1234567890 | Иванов    | Иван         | EMAIL_20   | testPassword1 |

  Scenario: Проверка представления созданного слоя проекта
    Given Существует проект "STRING_10"
    Given Существует набор
    Given Существует таблица
    Given Существует слой проекта
    When Пользователь делает запрос на текущий слой
    And Представление слоя проекта корректно
