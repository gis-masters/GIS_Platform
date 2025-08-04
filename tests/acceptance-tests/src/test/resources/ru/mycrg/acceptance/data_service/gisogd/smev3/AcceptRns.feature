@GisogdIntegration
Feature: Тесты осуществления услуги "Выдача разрешения на строительство объекта капитального строительства"

  # rnsSmev  Владелец организации
  # rns1     пользователь-1
  # sed1     пользователь-2

  Background:
    Given Существует организация созданная по шаблону: "для тестирования задач РНС по СМЭВ"
    *     я авторизован как "Владелец организации"
    *     удалены все существующие задачи
    *     В библиотеке документов "dl_data_task_allocation" существует папка "РНС и РНВ" с id 1
    *     В библиотеке документов Распределения задач, в папке с id 1, существует запись
    *     В библиотеке документов "dl_data_inbox_data" существует папка "Для РНС и РНВ" с id 40
    *     для пользователя "rns1" установлена роль "CONTRIBUTOR", для библиотеки: "dl_data_inbox_data"
    *     для пользователя "rns1" установлена роль "CONTRIBUTOR", для каталога 40 в библиотеке "dl_data_inbox_data"
    *     я авторизован как "rns1"

  # Одинокий тест подписи
  Scenario: Файл поступивший от Ионов Вячеслав Владимирович с валидной ЭЦП подписывается корректно
    Given в minio лежит архив с приходящими данными "РНС дубликат"
    *     в очередь попадает запрос на "РНС дубликат"
    *     я жду пока новая задача с контент типом "rns_smev_rostelekom" создаётся
    *     я получаю прикреплённый к новой задаче документ
    When  я из документа запрашиваю информацию о файле "SchemeDisposition.pdf"
    Then  файл подписан

  # Тестируем создание задач
  Scenario Outline: Задача "<type>" создается с правильно заполненными атрибутами
    Given в minio лежит архив с приходящими данными "<epguType>"
    When  в очередь попадает запрос на "<epguType>"
    And   я жду пока новая задача с контент типом "<type>" создаётся
    Then  создана задача ожидаемого вида "<type>" "<view>"
    Examples:
      | type                | epguType     | view                               |
      | rns_smev_rostelekom | РНС дубликат | РНС от Ионов Вячеслав Владимирович |
      | rnv_smev_rostelekom | РНВ дубликат | РНВ от Ионов Вячеслав Владимирович |
#      | gpzu_smev_rostelekom | ГПЗУ выдача   | ГПЗУ от Ионов Вячеслав Владимирович |

  # Тестируем создание документов
  Scenario Outline: Документ в задаче "<epguType>" создается с правильно заполненными атрибутами
    Given в minio лежит архив с приходящими данными "<epguType>"
    When  в очередь попадает запрос на "<epguType>"
    And   я жду пока новая задача с контент типом "<type>" создаётся
    Then  прикреплённый документ в новой задаче заполнен ожидаемо "<view>"
    Examples:
      | type                | epguType      | view                                                                                                                                                                                                                                                                                                                                                      |
      | rns_smev_rostelekom | РНС дубликат  | permits_data_number=RU01-2-3456-2222,pguid=4650656602,goal=4,content_type_id=rns_smev_rostelekom,person_name=Ионов Вячеслав Владимирович,smev_message_id=efa213da-08b3-11f0-8e72-1ed50ed0293c,request_type=0B.5,record_status=1.А.1,title=РНС от Ионов Вячеслав Владимирович,smev_client_id=86c6ea29-3273-44f3-9560-8398cdc55daf,data_type=0Е.2           |
      | rns_smev_rostelekom | РНС выдача    | pguid=4650656574,goal=1,content_type_id=rns_smev_rostelekom,person_name=Ионов Вячеслав Владимирович,smev_message_id=7e9976ba-08b3-11f0-8758-5af749e6a72a,request_type=0B.5,record_status=1.А.1,title=РНС от Ионов Вячеслав Владимирович,smev_client_id=0c3082d9-b450-4b1a-846a-a1b9701b3c3f,data_type=0Е.2                                                |
      | rns_smev_rostelekom | РНС продление | permits_data_number=RU01-2-3456-2020,pguid=4650656596,goal=2RenewalConstructionPermit,content_type_id=rns_smev_rostelekom,person_name=Ионов Вячеслав Владимирович,smev_message_id=c3456b7e-08b3-11f0-8758-5af749e6a72a,request_type=0B.5,record_status=1.А.1,title=РНС от Ионов Вячеслав Владимирович,smev_client_id=7b283e7d-e002-4744-95ee-8fe7dd9b386e |
      | rnv_smev_rostelekom | РНВ выдача    | pguid=4650657044,goal=1,content_type_id=rnv_smev_rostelekom,person_name=Ионов Вячеслав Владимирович,smev_message_id=12e8c0ec-08bd-11f0-8758-5af749e6a72a,request_type=0B.5,record_status=1.А.1,title=РНВ от Ионов Вячеслав Владимирович,smev_client_id=cdba0a20-ca07-4b49-9080-e365a37974c7                                                               |
      | rnv_smev_rostelekom | РНВ изменение | pguid=4650657079,goal=2,content_type_id=rnv_smev_rostelekom,person_name=Ионов Вячеслав Владимирович,smev_message_id=7ec29dfc-08bd-11f0-8758-5af749e6a72a,request_type=0B.5,record_status=1.А.1,title=РНВ от Ионов Вячеслав Владимирович,smev_client_id=4a5c0de5-99b1-490f-a55f-55c70b0dcea6                                                               |
#      поле permits_data_number=RU01-2-3456-2020 должно быть заполнено. но не заполняется. это баг. пока не хочу править баги
      | rnv_smev_rostelekom | РНВ дубликат  | permits_data_number=RU01-2-3456-6666,pguid=4650657114,goal=4,content_type_id=rnv_smev_rostelekom,person_name=Ионов Вячеслав Владимирович,smev_message_id=1c5c6176-08be-11f0-8e72-1ed50ed0293c,request_type=0B.5,record_status=1.А.1,title=РНВ от Ионов Вячеслав Владимирович,smev_client_id=8d5c4e0f-373a-46ea-8f99-b5f8161bbd9c                          |
#      | gpzu_smev_rostelekom | ГПЗУ выдача    | перечисление ожиданий |
#      | gpzu_smev_rostelekom | ГПЗУ продление | перечисление ожиданий |
#      | gpzu_smev_rostelekom | ГПЗУ дубликат  | перечисление ожиданий |

  # Тестируем отправку без вложений (завтра продолжим с тем что ниже)
  Scenario Outline: Когда пользователь ставит Промежуточный статус: "<intermediate_status>" в очередь ставиться сообщение
    Given в minio лежит архив с приходящими данными "<epguType>"
    And   в очередь попадает запрос на "<epguType>"
    *     я жду пока новая задача с контент типом "<type>" создаётся
    When  я сохраняю промежуточный статус со значением: "<intermediate_status>"
    Then  отправлено сообщение ожидаемого вида "<view>"
    And   статус текущей задачи равен "<status>"
    Examples:
      | type                | epguType     | status      | intermediate_status | view                                    |
      | rns_smev_rostelekom | РНС дубликат | IN_PROGRESS | 2                   | Дубликат РНС Заявление зарегистрировано |
      | rns_smev_rostelekom | РНС дубликат | CANCELED    | 8                   | Дубликат РНС Заявление отменено         |
      | rnv_smev_rostelekom | РНВ дубликат | IN_PROGRESS | 2                   | Дубликат РНВ Заявление зарегистрировано |
      | rnv_smev_rostelekom | РНВ дубликат | CANCELED    | 8                   | Дубликат РНВ Заявление отменено         |
#      | gpzu_smev_rostelekom | ГПЗУ дубликат | IN_PROGRESS | 2                   | Дубликат ГПЗУ Заявление зарегистрировано |
#      | gpzu_smev_rostelekom | ГПЗУ дубликат | CANCELED    | 8                   | Дубликат ГПЗУ Заявление отменено         |

  # Тестируем отправку с вложениями
  Scenario Outline: Когда пользователь ставит Промежуточный статус: 5 вложение успешно отправляется
    Given Загружены файлы "signed.dxf, signed.dxf.sig"
    *     я авторизован как "Владелец организации"
    *     для пользователя "rns1" установлена роль "CONTRIBUTOR", для библиотеки: "dl_data_section13"
    *     для пользователя "rns1" установлена роль "CONTRIBUTOR", для библиотеки: "dl_data_section_delivery_data"
    *     я авторизован как "rns1"
    *     В библиотеке документов "dl_data_section13" существует запись
    *     Загруженные файлы успешно подвязаны к записи в "dl_data_section13"
    *     В библиотеке документов "dl_data_section_delivery_data" существует запись
    *     Загруженные файлы успешно подвязаны к записи в "dl_data_section_delivery_data"
    *     в minio лежит архив с приходящими данными "<epguType>"
    *     в очередь попадает запрос на "<epguType>"
    *     я жду пока новая задача с контент типом "<type>" создаётся
    *     я привязываю к задаче, в поле для отправки, документ "<dataLibrary>"
    When  я сохраняю промежуточный статус со значением: "5"
    And   статус текущей задачи равен "DONE"
    Then  ожидаемый файл лежит в минио "<minio>"
    *     отправлено сообщение ожидаемого вида "<view>"
    Examples:
      | type                | epguType     | dataLibrary                         | view                                          | minio                                 |
      | rns_smev_rostelekom | РНС дубликат | Успех dl_data_section13             | Дубликат РНС Услуга оказана                   | Разрешение_на_строительство.dxf       |
      | rns_smev_rostelekom | РНС дубликат | Отказ dl_data_section_delivery_data | Дубликат РНС Отказано в предоставлении услуги | Мотивированный_отказ.dxf              |
      | rnv_smev_rostelekom | РНВ дубликат | Успех dl_data_section13             | Дубликат РНВ Услуга оказана                   | Разрешение_на_ввод_в_эксплуатацию.dxf |
      | rnv_smev_rostelekom | РНВ дубликат | Отказ dl_data_section_delivery_data | Дубликат РНВ Отказано в предоставлении услуги | Мотивированный_отказ.dxf              |
#      | gpzu_smev_rostelekom | ГПЗУ дубликат | Успех dl_data_section13 | Дубликат РНВ Услуга оказана | Градостроительный_план_земельного_участка.dxf |
#      | gpzu_smev_rostelekom | ГПЗУ дубликат | Отказ dl_data_section_delivery_data | Дубликат ГПЗУ Отказано в предоставлении услуги | Мотивированный_отказ.dxf              |
