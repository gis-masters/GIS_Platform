Feature: API Документов
  Background: Корневой эндпоинт для документов "/api/data/schemas/{schemaName}/tables/{tableName}"
              Запросы выполняются от авторизированного пользователя, если потребуются специфичные права на отдельные
              эндпоинты - они будут указаны в сценарии.

  Scenario: Создание единичного документа
    Given У пользователя в системе есть файл veryImportantFile.pdf размер которого не превышает 50Mb
    When Отправляется POST запрос с multipart/form-data вида
         | "files" | veryImportantFile.pdf |
    Then сервер отвечает 200
    And параметр fileName и title должны быть: "veryImportantFile.pdf"

  Scenario: Импорт нескольких документов
    Given У пользователя в системе есть несколько файлов file_1.pdf, file_2.pdf, file_3.pdf общий размер которых
          не превышает 50Mb
    When Отправляется POST запрос с multipart/form-data вида
         | "files" | file_1.pdf |
         |         | file_2.pdf |
         |         | file_3.pdf |
    Then сервер отвечает 200 с телом: массив с тремя обьектами в которых есть только идентификатор

  Scenario: Максимальный размер файла 50Mb
    Given У пользователя в системе есть файл big100Mb.db размер которого превышает 50Mb
    When Отправляется POST запрос с multipart/form-data вида
         | "files" | big100Mb.db |
    Then сервер отвечает 400 Bad request. C детализацией: "Maximum upload size exceeded, configured maximum: 50MB"

  Scenario: Максимальный размер общего числа файлов так же 50Mb
    Given У пользователя в системе есть файлы f_10Mb.db, f_20Mb.db, f_30Mb.db общий размер которых превышает 50Mb
    When Отправляется POST запрос с multipart/form-data вида
         | "files" | f_10Mb.db |
         |         | f_20Mb.db |
         |         | f_30Mb.db |
    Then сервер отвечает 400 Bad request. C детализацией: "Maximum upload size exceeded, configured maximum: 50MB"

  Scenario: Нельзя создать документ не передавая файл, либо с файлом размером 0 байт
    When Отправляется POST запрос без файла/файлов
    Then сервер отвечает 400 Bad request. C детализацией: "File is empty"

  Scenario: Title будет обрезан до 255 символов
    When Отправляется POST запрос с multipart/form-data вида
         | "files" | someFile.pdf |
         | "title" | Very long title Very long title Very long title Very long title Very long title Very long title   |
         |         | Very long title Very long title Very long title Very long title Very long title Very long title   |
         |         | Very long title Very long title Very long  title Very long titl Дальнейшие символы будут обрезаны |
    Then сервер отвечает 200

  Scenario: Получить инфо о документе
    Given Существует документ с id: "c6969704-3c08-47e8-ae39-5713153efb3c"
    When Отправляется GET запрос "/api/data/schemas/data/tables/documents/c6969704-3c08-47e8-ae39-5713153efb3c"
    Then сервер отвечает 200 с телом сущности

  Scenario: Удаление
    Given Существует документ с id: "c6969704-3c08-47e8-ae39-5713153efb31"
    When Запросы DELETE на "/api/data/schemas/data/tables/documents/c6969704-3c08-47e8-ae39-5713153efb31"
    Then сервер отвечает 204

  Scenario: Выборка/Удаление не существующего документа
    Given Документа с id: "c6969704-3c08-47e8-ae39-5713153efb31" в базе нет
    When Отправляется GET запрос "/api/data/schemas/data/tables/documents/c6969704-3c08-47e8-ae39-5713153efb31"
    Then сервер отвечает 404
    When Отправляется DELETE запрос "/api/data/schemas/data/tables/documents/c6969704-3c08-47e8-ae39-5713153efb31"
    Then сервер отвечает 404
