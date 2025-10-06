Feature: Импорт GeoPackage

  Background:
    Given Существует любая организация
    *     Владелец организации авторизован

  Scenario: Пользователь БЕЗ ПРАВ на ПРОЕКТ НЕ МОЖЕТ импортировать в него GeoPackage
    Given Существует проект "geoPackage will never be in me"
    *     Существует и авторизован некий пользователь
    *     Загружены файлы "onePolygonAllTypesWithoutGenerated.gpkg"
    When  Текущий пользователь импортирует GeoPackage в текущий проект без указания набора данных
    Then  Сервер отвечает со статус-кодом 400

  Scenario Outline: Пользователь МОЖЕТ импортировать GeoPackage в проект, только С ПРАВОМ БОЛЬШЕ ЧТЕНИЯ проекта
    Given Существует проект "geoPackage will import if not project VIEWER"
    *     Существует пользователь
      | <email> | Проверка прав проекта при импорте gpkg | <email> | testPassword1 |
    *     Владелец организации авторизован
    *     Текущий пользователь устанавливает роль "<role>" для пользователя "<email>", для текущего проекта
    *     я авторизован как "<email>"
    *     Загружены файлы "onePolygonAllTypesWithoutGenerated.gpkg"
    When  Текущий пользователь импортирует GeoPackage в текущий проект без указания набора данных
    Then  Сервер отвечает со статус-кодом <code>
    Examples:
      | role        | code | email                   |
      | VIEWER      | 400  | gpkg_project_v@mycrg.ru |
      | CONTRIBUTOR | 202  | gpkg_project_c@mycrg.ru |
      | OWNER       | 202  | gpkg_project_o@mycrg.ru |

  Scenario Outline: Пользователь МОЖЕТ импортировать GeoPackage в НАБОР ДАННЫХ, если его права БОЛЬШЕ ЧТЕНИЯ
    Given Существует проект "geoPackage will import if u not VIEWER to dataset"
    *     Существует набор данных
    *     Существует пользователь
      | <email> | Проверка прав набора данных при импорте gpkg | <email> | testPassword1 |
    *     Текущий пользователь устанавливает роль "OWNER" для пользователя "<email>", для текущего проекта
    *     Текущий пользователь устанавливает роль "<role>" для пользователя "<email>", для текущего набора данных
    *     я авторизован как "<email>"
    *     Загружены файлы "onePolygonAllTypesWithoutGenerated.gpkg"
    When  Текущий пользователь импортирует GeoPackage в текущий проект
    Then  Сервер отвечает со статус-кодом <code>
    Examples:
      | role        | code | email                   |
      | VIEWER      | 400  | gpkg_dataset_v@mycrg.ru |
      | CONTRIBUTOR | 202  | gpkg_dataset_c@mycrg.ru |
      | OWNER       | 202  | gpkg_dataset_o@mycrg.ru |

  Scenario: Импорт GeoPackage со схемой без генерируемых атрибутов в СУЩЕСТВУЮЩИЙ набор данных проходит успешно
    Given Существует проект "I need to IMPORT geoPackage with dataset"
    *     Существует набор данных
    *     Загружены файлы "onePolygonAllTypesWithoutGenerated.gpkg"
    When  Текущий пользователь импортирует GeoPackage в текущий проект
    Then  Сервер отвечает со статус-кодом 202
    *     процесс завершается успешно
    *     в текущий проект подключен 1 слой
    *     количество объектов в слое равно 1
    And   атрибуты объекта с полем "objectid" равным 1 такие
      | field_int           | 12                                                                                                                                                                                                                                                                                                                                                                                                                   |
      | field_double        | 12.12000000                                                                                                                                                                                                                                                                                                                                                                                                          |
      | field_string        | Новая стринга                                                                                                                                                                                                                                                                                                                                                                                                        |
      | field_date          | 2025-09-03 00:00:00                                                                                                                                                                                                                                                                                                                                                                                                  |
      | field_boolean       | true                                                                                                                                                                                                                                                                                                                                                                                                                 |
      | field_choice_string | 1111                                                                                                                                                                                                                                                                                                                                                                                                                 |
      | field_choice_int    | 55                                                                                                                                                                                                                                                                                                                                                                                                                   |
      | field_url           | [{"url":"https://blank.com","text":"gt"}]                                                                                                                                                                                                                                                                                                                                                                            |
      | field_fias          |                                                                                                                                                                                                                                                                                                                                                                                                                      |
      | field_fias__oktmo   | 58                                                                                                                                                                                                                                                                                                                                                                                                                   |
      | field_fias__address | Радуемся                                                                                                                                                                                                                                                                                                                                                                                                             |
      | field_fias__id      | 85                                                                                                                                                                                                                                                                                                                                                                                                                   |
      | ruleid              | 96                                                                                                                                                                                                                                                                                                                                                                                                                   |
      | field_file          | [{id=fd24ecfc-bdbd-4438-b4fe-ccc20ee23678, title=empty.xlsx, size=4336}]                                                                                                                                                                                                                                                                                                                                             |
      | field_document      | [{"id":1,"title":"dw","libraryTableName":"dl_data_kpt"}]                                                                                                                                                                                                                                                                                                                                                             |
      | field_uuid          | cfbde192-08a8-4f0b-bd09-a0e417ec11ef                                                                                                                                                                                                                                                                                                                                                                                 |
      | field_user_id       | 2                                                                                                                                                                                                                                                                                                                                                                                                                    |
      | field_user          | [{"id":2,"email":"orgOwner@any.ru","name":"Владелец","surname":"orgOwner","middleName":""}]                                                                                                                                                                                                                                                                                                                          |
#Починить в 3104
#      | shape               | 0106000020F66E0000010000000103000000010000000B000000B7D100DA056559418CB96B119A1253411C7C6176FD6459413FC6DCED99125341BB270F77FD645941933A01FD8B125341075F98C8FF64594154E3A50B8C1253414FAF94B5FF645941D8F0F4D291125341BDE3145904655941ABCFD5DE91125341EA043449046559417446946294125341FED478C9FF645941A69BC434941253410F0BB5FAFF645941E4839E7997125341DE718AC605655941EBE2369E97125341B7D100DA056559418CB96B119A125341 |

  Scenario: Импорт GeoPackage со схемой без генерируемых атрибутов БЕЗ УКАЗАНИЯ набора данных проходит успешно
    Given Существует и авторизован некий пользователь
    *     Существует проект "I need to IMPORT geoPackage without dataset"
    *     Загружены файлы "onePolygonAllTypesWithoutGenerated.gpkg"
    When  Текущий пользователь импортирует GeoPackage в текущий проект без указания набора данных
    Then  Сервер отвечает со статус-кодом 202
    *     процесс завершается успешно
    *     в текущий проект подключен 1 слой
    *     количество объектов в слое равно 1
    And   атрибуты объекта с полем "objectid" равным 1 такие
      | field_int           | 12                                                                                                                                                                                                                                                                                                                                                                                                                   |
      | field_double        | 12.12000000                                                                                                                                                                                                                                                                                                                                                                                                          |
      | field_string        | Новая стринга                                                                                                                                                                                                                                                                                                                                                                                                        |
      | field_date          | 2025-09-03 00:00:00                                                                                                                                                                                                                                                                                                                                                                                                  |
      | field_boolean       | true                                                                                                                                                                                                                                                                                                                                                                                                                 |
      | field_choice_string | 1111                                                                                                                                                                                                                                                                                                                                                                                                                 |
      | field_choice_int    | 55                                                                                                                                                                                                                                                                                                                                                                                                                   |
      | field_url           | [{"url":"https://blank.com","text":"gt"}]                                                                                                                                                                                                                                                                                                                                                                            |
      | field_fias          |                                                                                                                                                                                                                                                                                                                                                                                                                      |
      | field_fias__oktmo   | 58                                                                                                                                                                                                                                                                                                                                                                                                                   |
      | field_fias__address | Радуемся                                                                                                                                                                                                                                                                                                                                                                                                             |
      | field_fias__id      | 85                                                                                                                                                                                                                                                                                                                                                                                                                   |
      | ruleid              | 96                                                                                                                                                                                                                                                                                                                                                                                                                   |
      | field_file          | [{id=fd24ecfc-bdbd-4438-b4fe-ccc20ee23678, title=empty.xlsx, size=4336}]                                                                                                                                                                                                                                                                                                                                             |
      | field_document      | [{"id":1,"title":"dw","libraryTableName":"dl_data_kpt"}]                                                                                                                                                                                                                                                                                                                                                             |
      | field_uuid          | cfbde192-08a8-4f0b-bd09-a0e417ec11ef                                                                                                                                                                                                                                                                                                                                                                                 |
      | field_user_id       | 2                                                                                                                                                                                                                                                                                                                                                                                                                    |
      | field_user          | [{"id":2,"email":"orgOwner@any.ru","name":"Владелец","surname":"orgOwner","middleName":""}]                                                                                                                                                                                                                                                                                                                          |
#Починить в 3104
#      | shape               | 0106000020F66E0000010000000103000000010000000B000000B7D100DA056559418CB96B119A1253411C7C6176FD6459413FC6DCED99125341BB270F77FD645941933A01FD8B125341075F98C8FF64594154E3A50B8C1253414FAF94B5FF645941D8F0F4D291125341BDE3145904655941ABCFD5DE91125341EA043449046559417446946294125341FED478C9FF645941A69BC434941253410F0BB5FAFF645941E4839E7997125341DE718AC605655941EBE2369E97125341B7D100DA056559418CB96B119A125341 |
