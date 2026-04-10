Feature: Импорт GeoPackage с файлами внутри

  Background:
    Given Существует любая организация
    *     Существует и авторизован некий пользователь

  Scenario Outline: Файлы, созданные импортом gpkg, скачиваются c ожидаемым размером ("<reason>")
    Given я загрузил на сервер файл "<fileName>"
    *     Существует проект "<projectName>"
    *     текущий файл успешно импортирован в текущий проект как geoPackage
    *     среди слоёв текущего проекта, найден слой по имени "<tableTitle>"
    *     найдена фича по фильтру "<fieldName>" = "<filter>" в текущем слое
    When  я скачиваю файл из поля "<fileField>"
    Then  размер скаченного файла равен <size>
    Examples:
      | fileName              | projectName        | tableTitle    | fieldName    | filter        | fileField   | size  | reason           |
      | includeOneFile.gpkg   | GPKG im one file   | Выгрузка gpkg | field_string | Новая стринга | field_file  | 4336  | 1 файл в  gpkg   |
      | includeManyFiles.gpkg | GPKG im many files | ФайлыФайлы    | ruleid       | 357           | field_file2 | 49381 | 5 файлов в  gpkg |


