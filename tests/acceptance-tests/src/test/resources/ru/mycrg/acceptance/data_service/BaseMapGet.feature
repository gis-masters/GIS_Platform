Feature: Выборка подложек

  Background:
    Given Существует любая организация
    *     Владелец организации авторизован

  Scenario: Проверка представления всех подложек организации
    When Пользователь делает запрос на все подложки организации
    Then Ответ имеет стандартное тело с пагинацией

  Scenario: Проверка представления созданной подложки
    Given Существует подложка источник
      | wmts | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS |
    *     Сервер передает ID созданной подложки
    When  Пользователь делает запрос на указанную подложку источник
    Then  Представление подложки корректно

  Scenario Outline: Выборка всех подложек c сортировкой (<sorting factor>|<sorting direction>)
    When Существует подложка источник
      | <name> | <title> | <thumbnailUrn> | <type> | <url> | <layerName> | <style> | <projection> | <format> | <size> | <resolution> | <matrixIDs> |
    When Администратор делает запрос с сортировкой по "<sorting factor>" и "<sorting direction>" на все подложки
    Then Сервер отвечает со статус-кодом 200
    And  В ответе есть контент
    And  Данные отсортированы по "<sorting factor>" и "<sorting direction>"
    Examples:
      | name   | title     | thumbnailUrn                     | type | url                                              | layerName | style  | projection  | format    | size | resolution | matrixIDs | sorting factor | sorting direction |
      | wmts1  | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | name           | asc               |
      | wmts14 | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | name           | desc              |
      | wmts2  | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | title          | asc               |
      | wmts15 | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | title          | desc              |
      | wmts3  | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | thumbnailUrn   | asc               |
      | wmts16 | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | thumbnailUrn   | desc              |
      | wmts4  | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | type           | asc               |
      | wmts17 | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | type           | desc              |
      | wmts5  | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | url            | asc               |
      | wmts18 | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | url            | desc              |
      | wmts6  | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | layerName      | asc               |
      | wmts19 | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | layerName      | desc              |
      | wmts7  | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | style          | asc               |
      | wmts20 | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | style          | desc              |
      | wmts8  | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | projection     | asc               |
      | wmts21 | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | projection     | desc              |
      | wmts9  | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | format         | asc               |
      | wmts22 | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | format         | desc              |
      | wmts10 | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | resolution     | asc               |
      | wmts23 | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | resolution     | desc              |
      | wmts11 | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | matrixIds      | asc               |
      | wmts24 | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | matrixIds      | desc              |
      | wmts12 | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | createdAt      | asc               |
      | wmts25 | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | createdAt      | desc              |
      | wmts13 | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | lastModified   | asc               |
      | wmts26 | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | lastModified   | desc              |

  Scenario Outline: Выборка всех подложек постранично (<baseMapsPerPage> page/pages)
    When Существует подложка источник
      | <name> | <title> | <thumbnailUrn> | <type> | <url> | <layerName> | <style> | <projection> | <format> | <size> | <resolution> | <matrixIDs> |
    And Количество страниц подложек пропорционально "<baseMapsPerPage>"
    And На всех страницах подложек есть "<baseMapsPerPage>"
    Examples:
      | name  | title     | thumbnailUrn                     | type | url                                              | layerName | style  | projection  | format    | size | resolution | matrixIDs | baseMapsPerPage |
      | wmts1 | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | 1               |
      | wmts2 | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | 2               |
      | wmts3 | Ялте топо | /assets/images/thumbnail-our.jpg | WMTS | http://localhost:8100/geoserver/gwc/service/wmts | layerName | raster | EPSG:900913 | image/png | 256  | 21         | 21        | 3               |
