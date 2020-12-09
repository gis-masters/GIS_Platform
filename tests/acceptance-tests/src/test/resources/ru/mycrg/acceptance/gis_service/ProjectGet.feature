Feature: Выборка проектов

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario Outline: Получение всех проектов, когда проектов нет
    When Отправляется запрос на создание организации
      | <orgName> | <orgPhone> | <adminName> | <adminSurname> | <adminEmail> | <adminPassword> |
    And в заголовке Location передает ID созданной организации
    When Пользователь делает запрос на все проекты организации
    Then Сервер отвечает со статус-кодом 200
    And В ответе сервера для сущности "projects" отсутствует пункт "_embedded"
    Examples:
      | orgName         | orgPhone   | adminName | adminSurname | adminEmail | adminPassword |
      | ООО БыкиИКоровы | 1234567890 | Иванов    | Иван         | EMAIL_20   | testPassword1 |

  Scenario: Проверка представления всех проектов организации
    When Пользователь делает запрос на все проекты организации
    Then Ответ имеет стандартное тело с паджинацией

  Scenario Outline: Проверка представления созданного проекта
    When Существует проект "<projectName>"
    When Администратор делает запрос на текущий проект
    And Представление проекта корректно
    Examples:
      | projectName |
      | STRING_15   |

  Scenario Outline: Выборка всех проектов c сортировкой (<sorting factor>|<sorting direction>)
    When Существуют проекты
      | STRING_10 |
      | STRING_10 |
      | STRING_10 |
    When Администратор делает запрос с сортировкой по "<sorting factor>" и "<sorting direction>" на все проекты
    Then Сервер отвечает со статус-кодом 200
    And В ответе есть пункт "projects"
    And Данные отсортированы по "<sorting factor>" и "<sorting direction>" в "projects"
    Examples:
      | sorting factor | sorting direction |
      | internalName   | asc               |
      | internalName   | desc              |
      | baseMaps       | asc               |
      | baseMaps       | desc              |
      | organizationId | asc               |
      | organizationId | desc              |
      | createdAt      | asc               |
      | createdAt      | desc              |
      | name           | asc               |
      | name           | desc              |
      | id             | asc               |
      | id             | desc              |


  Scenario Outline: Выборка всех проектов постранично (<projectsPerPage> page/pages)
    When Существуют проекты
      | STRING_10 |
      | STRING_10 |
      | STRING_10 |
    When Администратор делает постраничный запрос на проекты "projects"
    Then Сервер отвечает со статус-кодом 200
    And Количество страниц проектов "projects" пропорционально "<projectsPerPage>"
    And На всех страницах проектов "projects" есть "<projectsPerPage>"
    Examples:
      | projectsPerPage |
      | 1               |
      | 2               |
      | 3               |
