Feature: Проверка Excel импорта

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario: Импорт excel файла осуществляется успешно
    When Пользователь делает запрос на импорт excel файла "dl_zu" "excel_test.xlsx" "excel"
    Then Сервер отвечает со статус-кодом 201
    And Тело ответа содержит отчет об успешном импорте всех записей

  Scenario Outline: Импорт некорректного файла отклоняется сервером: "<reason>"
    When Пользователь делает запрос на импорт excel файла "<libraryId>" "<fileName>" "<importType>"
    Then Сервер отвечает со статус-кодом 400
    And В ответе пункт "message" имеет значение "<responseMessage>"
    Examples:
      | libraryId | fileName    | importType | responseMessage         | reason                  |
      | dl_zu     | correct.gml | excel      | Тип файла не Excel      | некорректное расширение |
      | dl_zu     | empty.xlsx  | excel      | Загружаемый файл пустой | файл пустой             |
