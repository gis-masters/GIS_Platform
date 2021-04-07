Feature: Создание подложек в проектах

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario Outline: Создание подложки проекта с валидными данными
    Given Существует проект "STRING_10"
    When Пользователь делает запрос на создание подложки проекта "<baseMapId>", "<title>", "<position>"
    Then Сервер отвечает со статус-кодом 201
    And Сервер передает ID подложки проекта в ответе
    When Пользователь делает запрос на текущую подложку проекта
    Then Сервер отвечает со статус-кодом 200
    And Поля подложки проекта совпадают с переданными
    Examples:
      | baseMapId | title    | position |
      | NUMBER_5  | STRING_5 | NUMBER_2 |

  Scenario Outline: Повторное создание подложки проекта c валидными данными
    Given Существует проект "STRING_10"
    Given Существует подложкa проекта "<baseMapId>", "<title>", "<position>"
    When Пользователь делает повторный запрос на создание подложки проекта
    Then Сервер отвечает со статус-кодом 409
    Examples:
      | baseMapId | title    | position |
      | NUMBER_5  | STRING_5 | 1        |

  Scenario Outline: Создание подложки проекта c невалидными данными ("<reason>")
    When Пользователь делает запрос на создание подложки проекта "<baseMapId>", "<title>", "<position>"
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | baseMapId | title      | position | reason            |
      | 0         | STRING_5   | 1        | Ноль в baseMapId  |
      | NUMBER_5  | STRING_0   | 1        | Пустое описание   |
      | NUMBER_5  | STRING_2   | 1        | Короткое описание |
      | NUMBER_5  | STRING_257 | 1        | Длинное описание  |
