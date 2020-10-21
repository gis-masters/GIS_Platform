Feature: Удаление подложки

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario Outline: Удаление существующей подложки
    When Существует подложка
      | <name> | <title> | <thumbnailUrn> | <type> |
    When Пользователь делает запрос на удаление подложки
    Then Сервер отвечает со статус-кодом 204
    When Пользователь делает запрос на указанную подложку
    Then Сервер отвечает со статус-кодом 404
    Examples:
      | name | title     | thumbnailUrn                     | type |
      | wmts | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS |
