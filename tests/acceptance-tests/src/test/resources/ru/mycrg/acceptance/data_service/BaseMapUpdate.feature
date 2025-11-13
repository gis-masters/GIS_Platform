Feature: Обновление подложек

  Background:
    Given Существует любая организация
    *     Владелец организации авторизован

  Scenario Outline: Обновление полей подложки
    When Существует подложка источник
      | <name> | <title> | <thumbnailUrn> | <type> |
    When Пользователь делает запрос на обновление полей подложки
      | <newName> | <newTitle> | <newThumbnailUrn> | <newType> |
    Then Сервер отвечает со статус-кодом 204
    When Пользователь делает запрос на указанную подложку источник
    And Поля подложки совпадают с переданными "<newName>", "<newTitle>", "<newThumbnailUrn>", "<newType>"
    Examples:
      | name | title     | thumbnailUrn                     | type | newName | newTitle  | newThumbnailUrn           | newType |
      | wmts | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | wmtsUP  | Симф Топо | /assets/thumbnail-our.jpg | OSM     |
