Feature: Создание подложки

  Background:
    Given Существует любая организация
    *     Владелец организации авторизован

  Scenario Outline: Создание подложки с валидными данными
    When Пользователь делает запрос на создание подложки
      | <name> | <title> | <thumbnailUrn> | <type> | <url> | <layerName> | <style> | <projection> | <format> | <size> | <resolution> | <matrixIDs> | <position> | <pluggableToNewProject> |
    Then Сервер отвечает со статус-кодом 201
    And Сервер передает ID созданной подложки
    When Пользователь делает запрос на указанную подложку источник
    Then Сервер отвечает со статус-кодом 200
    And Поля подложки совпадают с переданными
    Examples:
      | name  | title     | thumbnailUrn                     | type | url                                              | layerName  | style   | projection  | format    | size | resolution | matrixIDs | position | pluggableToNewProject |
      | wmts' | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layer>Name | ras<ter | EPSG:900913 | image/png | 256  | 21         | 21        | 1        | true                  |

  Scenario Outline: Создание подложки с невалидными данными (<reason>)
    When Пользователь делает запрос на создание подложки
      | <name> | <title> | <thumbnailUrn> | <type> | <url> | <layerName> | <style> | <projection> | <format> | <size> | <resolution> | <matrixIDs> |
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | name     | title      | thumbnailUrn                     | type     | url                                              | layerName  | style      | projection  | format     | size | resolution | matrixIDs | reason                            |
      | STRING_0 | Ялте топо  | /assets/images/thumbnail-our.jpg | WMTS     | http://localhost:8100/geoserver/gwc/service/wmts | layerName  | raster     | EPSG:900913 | image/png  | 256  | 21         | 21        | Пустое имя                        |
      | wmts     | STRING_256 | /assets/images/thumbnail-our.jpg | WMTS     | http://localhost:8100/geoserver/gwc/service/wmts | layerName  | raster     | EPSG:900913 | image/png  | 256  | 21         | 21        | Длинное имя                       |
      | wmts     | STRING_0   | /assets/images/thumbnail-our.jpg | WMTS     | http://localhost:8100/geoserver/gwc/service/wmts | layerName  | raster     | EPSG:900913 | image/png  | 256  | 21         | 21        | Пустое описание                   |
      | wmts     | STRING_2   | /assets/images/thumbnail-our.jpg | WMTS     | http://localhost:8100/geoserver/gwc/service/wmts | layerName  | raster     | EPSG:900913 | image/png  | 256  | 21         | 21        | Короткое описание                 |
      | wmts     | STRING_256 | /assets/images/thumbnail-our.jpg | WMTS     | http://localhost:8100/geoserver/gwc/service/wmts | layerName  | raster     | EPSG:900913 | image/png  | 256  | 21         | 21        | Длинное описание                  |
      | wmts     | Ялте топо  | STRING_0                         | WMTS     | http://localhost:8100/geoserver/gwc/service/wmts | layerName  | raster     | EPSG:900913 | image/png  | 256  | 21         | 21        | Пустой путь к картинке подложки   |
      | wmts     | Ялте топо  | STRING_2                         | WMTS     | http://localhost:8100/geoserver/gwc/service/wmts | layerName  | raster     | EPSG:900913 | image/png  | 256  | 21         | 21        | Короткий путь к картинке подложки |
      | wmts     | Ялте топо  | STRING_256                       | WMTS     | http://localhost:8100/geoserver/gwc/service/wmts | layerName  | raster     | EPSG:900913 | image/png  | 256  | 21         | 21        | Длинный путь к картинке подложки  |
      | wmts     | Ялте топо  | /assets/images/thumbnail-our.jpg | STRING_0 | http://localhost:8100/geoserver/gwc/service/wmts | layerName  | raster     | EPSG:900913 | image/png  | 256  | 21         | 21        | Пустой тип                        |
      | wmts     | Ялте топо  | /assets/images/thumbnail-our.jpg | WMTS     | STRING_256                                       | layerName  | raster     | EPSG:900913 | image/png  | 256  | 21         | 21        | Длинный путь к подложке           |
      | wmts     | Ялте топо  | /assets/images/thumbnail-our.jpg | WMTS     | http://localhost:8100/geoserver/gwc/service/wmts | STRING_256 | raster     | EPSG:900913 | image/png  | 256  | 21         | 21        | Длинное название слоя             |
      | wmts     | Ялте топо  | /assets/images/thumbnail-our.jpg | WMTS     | http://localhost:8100/geoserver/gwc/service/wmts | layerName  | STRING_256 | EPSG:900913 | image/png  | 256  | 21         | 21        | Длинное название стиля            |
      | wmts     | Ялте топо  | /assets/images/thumbnail-our.jpg | WMTS     | http://localhost:8100/geoserver/gwc/service/wmts | layerName  | raster     | STRING_256  | image/png  | 256  | 21         | 21        | Длинное название проекции         |
      | wmts     | Ялте топо  | /assets/images/thumbnail-our.jpg | WMTS     | http://localhost:8100/geoserver/gwc/service/wmts | layerName  | raster     | EPSG:900913 | STRING_256 | 256  | 21         | 21        | Длинный формат                    |
      | wmts     | Ялте топо  | /assets/images/thumbnail-our.jpg | WMTS     | http://localhost:8100/geoserver/gwc/service/wmts | layerName  | raster     | EPSG:900913 | image/png  | -1   | 21         | 21        | Размер менее 1                    |
      | wmts     | Ялте топо  | /assets/images/thumbnail-our.jpg | WMTS     | http://localhost:8100/geoserver/gwc/service/wmts | layerName  | raster     | EPSG:900913 | image/png  | 256  | -1         | 21        | Разрешение менее 1                |
      | wmts     | Ялте топо  | /assets/images/thumbnail-our.jpg | WMTS     | http://localhost:8100/geoserver/gwc/service/wmts | layerName  | raster     | EPSG:900913 | image/png  | 256  | 21         | -1        | ID матрицы менее 1                |
