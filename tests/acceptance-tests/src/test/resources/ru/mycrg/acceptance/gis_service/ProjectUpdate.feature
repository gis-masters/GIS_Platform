Feature: Обновление проектов

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario Outline: Обновление проекта администратором организации
    Given Существует проект "<projectName>"
    When Авторизируемся владельцем организации
    When Пользователь делает запрос на обновление полей проекта "<newProjectName>"
    Then Сервер отвечает со статус-кодом 200
    Examples:
      | projectName | newProjectName |
      | STRING_10   | newProjectName |

  Scenario Outline: Обновление проекта пользователем организации
    Given Существует проект "<projectName>"
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Администратор делает запрос на создание правила на текущего пользователя
    When Авторизируемся пользователем
    When Пользователь делает запрос на обновление полей проекта "<newProjectName>"
    Then Сервер отвечает со статус-кодом 403
    Examples:
      | projectName | newProjectName | userName  | userSurname | userEmail | userPassword |
      | STRING_10   | newProjectName | STRING_15 | STRING_15   | EMAIL_15  | testtestQ1   |
