Feature: Выборка проектов

  Background:
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario: Проверка паджинированной выборки проектов
    When Пользователь делает запрос на все проекты организации
    Then Ответ имеет стандартное тело с паджинацией

  Scenario: Проверка представления созданного проекта
    When Существует проект "STRING_6"
    When Администратор делает запрос на текущий проект
    And Представление проекта корректно

  Scenario Outline: Проверка сортировки проектов (<sorting factor>|<sorting direction>)
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

  Scenario Outline: Проверка постраничной выборки проектов (<projectsPerPage> page/pages)
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

  Scenario Outline: Фильтрация по названию проекта должна быть не чувствительна к регистру
    When Существуют проекты
      | ProjectNameWithSomeUpperLiterals |
      | project_name                     |
      | otherName                        |
    When Администратор делает запрос на выборку проектов с фильтрацией по полю "<filterKey>" и значению "<filterValue>"
    Then В выборке присутствуют определённое кол-во элементов: "2"
    Examples:
      | filterKey | filterValue |
      | name      | PROJECT     |
