Feature: Создание растровых слоёв

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario Outline: Создание растрового слоя на гис-сервисе
    Given Существует проект "STRING_10"
    Given Существует запись в библиотеке на основе растрового файла "raster test"
    When Пользователь делает запрос на создание слоя проекта "<title>" "<styleName>" "<type>" "<schemaId>" "<nativeCRS>" "<dataSourceUri>" "<libraryId>" "<recordId>" "<mode>" "test_content_type"
    Then Сервер отвечает со статус-кодом 201
    And Сервер передаёт ID слоя проекта в ответе
    When Пользователь делает запрос на текущий слой
    Then Сервер отвечает со статус-кодом 200
    Examples:
      | type   | nativeCRS  | libraryId  | mode        |
      | raster | EPSG:28406 | dl_default | gis-service |

  Scenario Outline: Создание слоя проекта c невалидными данными ("<reason>")
    Given Существует проект "STRING_10"
    Given Существует набор данных
    Given Существует таблица
    When Пользователь делает запрос на создание слоя проекта "<title>" "<styleName>" "<type>" "<schemaId>" "<nativeCRS>" "<dataSourceUri>" "<libraryId>" "<recordId>" "<mode>" "test_content_type"
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | type   | nativeCRS  | libraryId  | recordId | mode        | reason                     |
      | raster | STRING_1   | dl_default | 1        | gis-service | Короткий nativeCRS(vector) |
      | raster | STRING_52  | dl_default | 1        | gis-service | Длинный nativeCRS(vector)  |
      | raster | STRING_0   | dl_default | 1        | gis-service | Пустой nativeCRS (raster)  |
      | raster | EPSG:28406 |            | 1        | gis-service | Пустое поле libraryId      |
      | raster | EPSG:28406 | dl_default | 1        | gis         | Некорректное поле mode     |

#  Ждём принятия решения: нужно ли по-умолчанию ставить белый цвет или нет
#  Scenario: При создании растрового слоя параметр transparent color по умолчанию чёрный
#    Given Существует проект "STRING_10"
#    Given Существует файл "zolotopolenskoe_sp.tif"
#    Given Существует запись в библиотеке на основе растрового файла "raster transparent test"
#    When Пользователь делает запрос на размещение растрового слоя в проекте
#    Then Параметр transparent color по умолчанию чёрный
