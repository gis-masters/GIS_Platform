Feature: Создание слоёв проекта

  Background: Проверка организации
    Given Существует организация
    When Авторизируемся владельцем организации

  Scenario: Создание растрового слоя
    Given Существует проект
    When Пользователь делает POST запрос на эндпоинт: '/projects/{projectId}/layers'.
         Тело запроса:
         {
           "type": "raster",
           "title": "Kurortnoe_title_7",
           "dataStoreName": "store_g_7",
           "tableName": "layer_g_7",
           "nativeCRS": "EPSG:28406",
           "dataSourceUri": "file:///opt/spatial_data/Peny_PZZ_2019_5k_P.tif"
         }
    Then Слой успешно создан
    And Поля слоя совпадают с переданными
