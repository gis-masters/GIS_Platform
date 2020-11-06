Feature: Создание проектов

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario Outline: Создание проекта с валидными данными
    When Пользователь делает запрос на создание проекта "<projectName>"
    Then Сервер отвечает со статус-кодом 201
    And Сервер передает ID проекта в ответе
    When Пользователь делает запрос на текущий проект
    Then Сервер отвечает со статус-кодом 200
    And Поля проекта совпадают с переданными
    Examples:
      | projectName |
      | STRING_15   |

  Scenario Outline: Повторное создание проекта c валидными данными
    Given Существует проект "<projectName>"
    When Пользователь делает повторный запрос на создание проекта
    Then Сервер отвечает со статус-кодом 409
    Examples:
      | projectName |
      | STRING_15   |

  Scenario Outline: Создание проекта с невалидными данными ("<reason>")
    When Пользователь делает запрос на создание проекта "<projectName>"
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | projectName   | reason                     |
      | STRING_0      | Пустое название проекта    |
      | STRING_51     | Длинное название проекта   |
      | STRING_2      | Короткое название проекта  |
      | /INVALID_NAME | Невалидный символ в начале |
      | NUMBER_5      | Цифра в начале             |

  Scenario Outline: Создание проекта пользователем организации
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | testtestQ1 |
    When Авторизируемся пользователем
    When Пользователь делает запрос на создание проекта "<projectName>"
    Then Сервер отвечает со статус-кодом 403
    Examples:
      | userName  | userSurname | userEmail | projectName |
      | STRING_15 | STRING_15   | EMAIL_15  | STRING_15   |
