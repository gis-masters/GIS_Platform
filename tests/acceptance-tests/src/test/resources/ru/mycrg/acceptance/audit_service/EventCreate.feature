Feature: Создание событий аудита

  Background:
    Given Существует любая организация
    Given Владелец организации авторизован

  Scenario Outline: Создание события аудита с валидными данными: (<reason>)
    When Пользователь делает запрос на создание события аудита "<eventDateTime>" "<actionType>" "<entityName>" "<entityType>" "<entityId>" "<entityStateAfter>"
    Then Сервер отвечает со статус-кодом 201
    Examples:
      | eventDateTime | actionType | entityName | entityType | entityId | entityStateAfter | reason          |
      | CURRENT_TIME  | SIGN_IN    |            |            |          |                  | Required fields |
      | CURRENT_TIME  | CREATE     | STRING_5   | PROJECT    | 43       | JSON             | Success case 1  |
      | CURRENT_TIME  | CREATE     | STRING_700 | PROJECT    | 1        | JSON             | Success case 2  |
      | CURRENT_TIME  | CREATE     | sdf\'sdf'e | PROJECT    | 1        | JSON             | Spacial symbols |

  Scenario Outline: Создание события аудита c невалидными данными ("<reason>")
    When Пользователь делает запрос на создание события аудита "<eventDateTime>" "<actionType>" "<entityName>" "<entityType>" "<entityId>" "<entityStateAfter>"
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | eventDateTime | actionType | entityName | entityType | entityId | entityStateAfter | reason                                                           |
      | CURRENT_TIME  | STRING_0   | STRING_5   | PROJECT    | 325      | JSON             | actionType: пустое значение не допускается                       |
      | CURRENT_TIME  | CREATE     | STRING_10  | STRING_0   | 1        | JSON             | entityType: пустое значение не допускается                       |
      | CURRENT_TIME  | CREATE     | STRING_701 | PROJECT    | 555      | JSON             | entityName: значение, длинной более 700 символов, не допускается |
      | CURRENT_TIME  | CREATE     | STRING_257 | PROJECT    | -2       | JSON             | entityId: отрицательные значения и 0 не допускаются              |
      |               | CREATE     | STRING_0   | PROJECT    | 1        | JSON             | eventDateTime: пустое значение не допускается                    |
