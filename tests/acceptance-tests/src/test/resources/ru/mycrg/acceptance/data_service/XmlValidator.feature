Feature: Импорт xml файла межевого плана

  Background:
    Given Существует любая организация
    *     Владелец организации авторизован

  Scenario Outline: Импорт пустого xml файла. Должен возвращаться статус 400
    When Пользователь делает запрос на импорт файла
      | <fileName> | <datasetId> | <tableId> |
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | fileName  | datasetId | tableId |
      | empty.xml | test      | test    |

  Scenario Outline: Импорт файла, имеющего другое расширение. Должен возвращаться статус 400
    When Пользователь делает запрос на импорт файла
      | <fileName> | <datasetId> | <tableId> |
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | fileName | datasetId | tableId |
      | test.txt | test      | test    |

  Scenario Outline: Импорт xml файла в несуществующий слой. Должен возвращаться статус 400
    When Пользователь делает запрос на импорт файла
      | <fileName> | <datasetId> | <tableId> |
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | fileName       | datasetId | tableId |
      | correct_mp.xml | test      | test    |

  Scenario Outline: Импорт некорректного xml файла в существующий слой. Должен возвращаться статус 400
    When Пользователь делает запрос на импорт файла
      | <fileName> | <datasetId> | <tableId> |
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | fileName         | datasetId | tableId |
      | incorrect_mp.xml | test      | test    |
