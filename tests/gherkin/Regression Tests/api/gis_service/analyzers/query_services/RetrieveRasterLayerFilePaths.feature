Feature: Получение файловых путей, которые используются в расстровых файлах

  Scenario: Получение файловых путей
    When Пользователь запрашивает у "crg-gis-service" ресурс типа "FilePathToRasterLayer"
#    resources/FilePathToRasterLayer/entities
    Then Сервер отвечает со статус-кодом 200
    And Сервер отдает список ресурсов типа "FilePathToRasterLayer"
    And Каждый ресурс имеет поля
      | title              |
      | id                 |
      | resourceDefinition |
      | resourceProperties |
    And Поле "resourceProperties" имеет поля
      | path |
    And Ответ имеет стандартное тело
