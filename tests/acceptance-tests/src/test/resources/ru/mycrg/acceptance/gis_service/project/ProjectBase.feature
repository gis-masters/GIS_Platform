Feature: Выборка проектов

  Background:
    Given Существует любая организация
    Given я авторизован как "Владелец организации"
    Given удалены все существующие проекты

  Scenario: Представление списка проектов корректно и имеет стандартное тело с пагинацией
    Given Существует и авторизован некий пользователь
    When  Пользователь делает запрос на все проекты организации
    Then  Ответ имеет стандартное тело с пагинацией

  Scenario: Проверка представления созданного проекта
    Given я создал проект "Мой проект"
    When  я делаю запрос на текущий проект
    Then  Представление проекта корректно

  Scenario Outline: Проверка сортировки проектов (<sorting factor>|<sorting direction>)
    Given я создал проект с именем "A-Project" и описанием "First project"
    Given я создал проект с именем "B-Project" и описанием "Second project"
    Given я создал проект с именем "C-Project" и описанием "Third project"
    When  Администратор делает запрос с сортировкой по "<sorting factor>" и "<sorting direction>" на все проекты
    Then  Сервер отвечает со статус-кодом 200
    And   В ответе есть контент
    And   Данные отсортированы по "<sorting factor>" и "<sorting direction>"
    And   Порядок проектов соответствует сортировке по "<sorting factor>" в направлении "<sorting direction>"
    Examples:
      | sorting factor | sorting direction |
      | createdAt      | asc               |
      | createdAt      | desc              |
      | name           | asc               |
      | name           | desc              |
      | id             | asc               |
      | id             | desc              |

  Scenario Outline: Проверка постраничной выборки проектов (<projectsPerPage> page/pages)
    Given я создал проект с именем "Project-1" и описанием "First project"
    Given я создал проект с именем "Project-2" и описанием "Second project"
    Given я создал проект с именем "Project-3" и описанием "Third project"
    When  Администратор делает постраничный запрос на проекты
    Then  Сервер отвечает со статус-кодом 200
    And   Количество страниц проектов пропорционально "<projectsPerPage>"
    And   На всех страницах проектов есть "<projectsPerPage>"
    Examples:
      | projectsPerPage |
      | 1               |
      | 2               |
      | 3               |

  Scenario Outline: Фильтрация по названию проекта должна быть не чувствительна к регистру
    Given я создал проект с именем "ProjectNameWithSomeUpperLiterals" и описанием "Project with upper case"
    Given я создал проект с именем "project_name" и описанием "Project with lower case"
    Given я создал проект с именем "otherName" и описанием "Project with different name"
    When  Администратор делает запрос на выборку проектов с фильтрацией по полю "<filterKey>" и значению "<filterValue>"
    Then  В выборке присутствуют определённое кол-во элементов: 2
    And   В результатах фильтрации присутствуют проекты "ProjectNameWithSomeUpperLiterals" и "project_name"
    Examples:
      | filterKey | filterValue |
      | name      | PROJECT     |
