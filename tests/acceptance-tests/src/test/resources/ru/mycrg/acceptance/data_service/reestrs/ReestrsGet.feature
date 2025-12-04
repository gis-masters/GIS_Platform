Feature: Управление реестрами

  Background:
    Given Существует организация
      | name           | phone      | ownerSurname | ownerName | ownerEmail |
      | ООО РеестрыИКо | 1234567890 | Реестрович   | Реестр    | EMAIL_20   |
    Given Владелец организации авторизован

  Scenario: Выборка существующих реестров
    When Пользователь делает запрос на все реестры
    Then Сервер отвечает постраничным списком существующих реестров

  Scenario Outline: Проверка выборки данных с сортировкой из реестров (<field>|<direction>)
    Given В реестре "reestr_incoming" существуют записи
      | System 1 | fiz | NEW         | some majestic body   |
      | System 2 | baz | NEW         | some awesome body    |
      | System 3 | foo | DONE        | some real body       |
      | System 3 | goo | IN_PROGRESS | some impossible body |
      | System 1 | fiz | ERROR       | some incredible body |
      | System 1 | fiz | IN_PROGRESS | some available body  |
    When Администратор делает запрос на выборку из реестра входящих с сортировкой по "<field>" и "<direction>"
    Then Данные отсортированы по "<field>" и "<direction>"
    Examples:
      | field       | direction |
      | system      | asc       |
      | system      | desc      |
      | user_from   | asc       |
      | user_from   | desc      |
      | date_in     | asc       |
      | date_in     | desc      |
      | date_out    | asc       |
      | date_out    | desc      |
      | status      | asc       |
      | status      | desc      |
      | response_to | asc       |
      | response_to | desc      |

  Scenario Outline: Доступна фильтрация по ECQL фильтру
    Given В реестре "reestr_incoming" существуют записи
      | System 314 | foo | DONE       | some real body       |
      | System 314 | goo | SOME_OTHER | some impossible body |
      | System 1   | fiz | SOME_OTHER | some yellow body     |
    When Администратор делает запрос на выборку из реестра входящих с фильтрацией по полю "<filterKey>" и значению "<filterValue>"
    Then В выборке присутствуют определённое кол-во элементов: <expected>
    Examples:
      | filterKey | filterValue | expected |
      | system    | System 314  | 2        |
      | status    | SOME_OTHER  | 4        |
