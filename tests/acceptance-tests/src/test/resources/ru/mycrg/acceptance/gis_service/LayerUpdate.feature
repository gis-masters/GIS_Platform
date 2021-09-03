Feature: Обновление слоя проектов

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario Outline: Обновление слоя проекта администратором организации
    Given Существует проект "STRING_10"
    Given Существует набор
    Given Существует таблица
    Given Существует слой проекта
    When Авторизируемся владельцем организации
    When Владелец делает запрос на обновление полей слоя проекта
      | <newTitle> | <enabled> | <position> | <transparency> | <minZoom> | <maxZoom> | <newNativeCrs> |
    Then Сервер отвечает со статус-кодом 204
    When Пользователь делает запрос на текущий слой
    Then Обновленные поля слоя совпадают с переданными
    Examples:
      | newTitle | enabled | position | transparency | minZoom | maxZoom | newNativeCrs |
      | newTitle | false   | NUMBER_3 | NUMBER_2     | 15      | 30      | EPSG:28410   |

  Scenario: Добавление слою проекта папки-родителя администратором организации
    Given Существует проект "STRING_10"
    Given Существует группа слоев проекта "STRING_10", "NUMBER_2"
    Given Существует набор
    Given Существует таблица
    Given Существует слой проекта
    When Авторизируемся владельцем организации
    When Пользователь делает запрос на добавление слоя в папку-родитель
    Then Сервер отвечает со статус-кодом 204
    When Пользователь делает запрос на текущий слой
    Then В полях слоя есть упоминание папки родителя

  Scenario Outline: Обновление слоёв проекта недоступно пользователям с уровнем доступа "VIEWER"
    Given Существует проект "STRING_10"
    Given Существует набор
    Given Существует таблица
    Given Существует пользователь
      | <userName> | <userSurname> | <userEmail> | <userPassword> |
    When Администратор даёт доступ: "VIEWER" для текущего пользователя на текущий проект
    When Пользователь делает запрос на обновление полей слоя проекта
      | <newTitle> | <enabled> | <position> | <transparency> | <minZoom> | <maxZoom> | <newNativeCrs> |
    Then Сервер отвечает со статус-кодом 403
    Examples:
      | userName  | userSurname | userEmail | userPassword | newTitle | enabled | position | transparency | minZoom | maxZoom | newNativeCrs |
      | STRING_10 | STRING_10   | EMAIL_10  | testtestQ1   | newTitle | false   | NUMBER_3 | NUMBER_2     | 15      | 30      | EPSG:28410   |
