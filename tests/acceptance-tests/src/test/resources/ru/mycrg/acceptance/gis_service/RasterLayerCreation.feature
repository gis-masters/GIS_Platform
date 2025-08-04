Feature: Создание растровых слоёв

  Background:
    Given Существует любая организация
    *     Владелец организации авторизован

  Scenario Outline: Создание растрового слоя на гис-сервисе
    Given Существует схема "Тестовая схема dl_default"
    *     Существует библиотека документов, созданная по схеме "Тестовая схема dl_default"
    *     Существует проект "STRING_10"
    *     Существует запись в библиотеке на основе растрового файла "raster test"
    When  Пользователь делает запрос на создание слоя проекта "<title>" "<styleName>" "<type>" "<nativeCRS>" "<dataSourceUri>" "<libraryId>" "<recordId>" "<mode>" "test_content_type" "style"
    Then  Сервер отвечает со статус-кодом 201
    And   Сервер передаёт ID слоя проекта в ответе
    When  Пользователь делает запрос на текущий слой
    Then  Сервер отвечает со статус-кодом 200
    Examples:
      | type   | nativeCRS  | libraryId  | mode        |
      | raster | EPSG:28406 | dl_default | gis-service |

  Scenario Outline: Создание слоя проекта c невалидными данными ("<reason>")
    Given Существует проект "STRING_10"
    *     Существует набор данных
    *     Существует таблица
    When  Пользователь делает запрос на создание слоя проекта "<title>" "<styleName>" "<type>" "<nativeCRS>" "<dataSourceUri>" "<libraryId>" "<recordId>" "<mode>" "test_content_type" "style"
    Then  Сервер отвечает со статус-кодом 400
    Examples:
      | type   | nativeCRS  | libraryId  | recordId | mode        | reason                     |
      | raster | STRING_1   | dl_default | 1        | gis-service | Короткий nativeCRS(vector) |
      | raster | STRING_52  | dl_default | 1        | gis-service | Длинный nativeCRS(vector)  |
      | raster | STRING_0   | dl_default | 1        | gis-service | Пустой nativeCRS (raster)  |
      | raster | EPSG:28406 |            | 1        | gis-service | Пустое поле libraryId      |
      | raster | EPSG:28406 | dl_default | 1        | gis         | Некорректное поле mode     |
