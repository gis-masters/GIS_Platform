Feature: Создание событий аудита

  Background: Проверка организации
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario Outline: Создание события аудита с валидными данными
    When Пользователь делает запрос на создание события аудита "<eventDateTime>" "<actionType>" "<entityName>" "<entityId>" "<entityStateAfter>"
    Then Сервер отвечает со статус-кодом 201
    Examples:
      | eventDateTime | actionType | entityName | entityId | entityStateAfter |
      | CURRENT_TIME  | SIGN_IN    |            |          |                  |
      | CURRENT_TIME  | CREATE     | STRING_5   | 43       | JSON             |
      | CURRENT_TIME  | CREATE     | STRING_20  | 43       | JSON             |
      | CURRENT_TIME  | CREATE     | STRING_100 | 1        | JSON             |

  Scenario Outline: Создание события аудита c невалидными данными ("<reason>")
    When Пользователь делает запрос на создание события аудита "<eventDateTime>" "<actionType>" "<entityName>" "<entityId>" "<entityStateAfter>"
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | eventDateTime | actionType | entityName | entityId | entityStateAfter | reason                                                                                    |
      | CURRENT_TIME  | STRING_4   | STRING_5   | 2        | JSON             | actionType: не допускаются значения, кроме- CREATE,  UPDATE,  DELETE,  SIGN_IN,  SIGN_OUT |
      | CURRENT_TIME  | STRING_0   | STRING_5   | 325      | JSON             | actionType: пустое значение  не  допускается                                              |
      | CURRENT_TIME  | CREATE     | STRING_101 | 555      | JSON             | entityName: значение, длинной более 100 символов, не допускается                          |
      | CURRENT_TIME  | CREATE     | STRING_257 | -2       | JSON             | entityId: отрицательное значение и 0 не допускается                                       |
      |               | CREATE     | STRING_0   | 1        | JSON             | eventDateTime: пустое значение не  допускается                                            |
