Feature: Выборка подложек

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario Outline: Проверка представления созданной подложки проекта
    Given Существует проект "STRING_10"
    Given Существует подложкa проекта "<baseMapId>", "<title>", "<position>"
    And Сервер передает ID подложки проекта в ответе
    When Пользователь делает запрос на текущую подложку
    And Представление подложки проекта корректно
    Examples:
      | baseMapId | title    | position |
      | NUMBER_5  | STRING_5 | NUMBER_2 |

  Scenario Outline: Выборка всех подложек проектов c сортировкой (<sorting factor>|<sorting direction>)
    Given Существует проект "STRING_10"
    Given Существуют подложки проектов
      | NUMBER_5 | STRING_5 | NUMBER_2 |
      | NUMBER_5 | STRING_5 | NUMBER_2 |
      | NUMBER_5 | STRING_5 | NUMBER_2 |
    When Администратор делает запрос с сортировкой по "<sorting factor>" и "<sorting direction>" на все подложки проекта
    Then Сервер отвечает со статус-кодом 200
    And Данные отсортированы по "<sorting factor>" и "<sorting direction>" в "basemaps"
    Examples:
      | sorting factor | sorting direction |
      | baseMapId      | asc               |
      | baseMapId      | desc              |
      | title          | asc               |
      | title          | desc              |
      | position       | asc               |
      | position       | desc              |

  Scenario Outline: Выборка всех подложек проектов постранично (<baseMapsPerPage> page/pages)
    Given Существуют подложки проектов
      | NUMBER_5 | STRING_5 | NUMBER_2 |
      | NUMBER_5 | STRING_5 | NUMBER_2 |
      | NUMBER_5 | STRING_5 | NUMBER_2 |
    And Количество страниц подложек "basemaps" пропорционально "<baseMapsPerPage>"
    And На всех страницах подложек "basemaps" есть "<baseMapsPerPage>"
    Examples:
      | baseMapsPerPage |
      | 1               |
      | 2               |
      | 3               |
