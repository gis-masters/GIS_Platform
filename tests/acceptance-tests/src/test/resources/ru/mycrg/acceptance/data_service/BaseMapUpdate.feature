Feature: Обновление подложек

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario Outline: Обновление полей подложки
    When Существует подложка
      | <name> | <title> | <thumbnailUrn> | <type> |
    When Пользователь делает запрос на обновление полей подложки
      | <newName> | <newTitle> | <newThumbnailUrn> | <newType> |
    Then Сервер отвечает со статус-кодом 200
    When Пользователь делает запрос на указанную подложку
    And Поля подложки совпадают с переданными "<newName>", "<newTitle>", "<newThumbnailUrn>", "<newType>"
    Examples:
      | name | title     | thumbnailUrn                     | type | newName | newTitle  | newThumbnailUrn           | newType |
      | wmts | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | wmtsUP  | Симф Топо | /assets/thumbnail-our.jpg | OSM     |
