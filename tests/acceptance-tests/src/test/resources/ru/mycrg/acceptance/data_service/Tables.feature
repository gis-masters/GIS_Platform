Feature: Проверка сущности table

  Background:
    Given Существует организация
      | ООО НаборыДанных | 1234567890 | Наборов | Набор | EMAIL_13 | testPassword1 |

  Scenario Outline: Создание таблиц с валидными данными (<reason>)
    Given Авторизируемся владельцем организации
    Given Отправляется запрос на создание набора "STRING_5" "STRING_5"
    Then Сервер отвечает со статус-кодом 201
    When Отправляется запрос на создание таблицы "<name>" "<title>" "<details>" "<crs>" "<schemaId>"
    Then Сервер отвечает со статус-кодом 201
    Examples:
      | name      | title      | details     | crs       | schemaId  | reason                     |
      | STRING_3  | STRING_1   | STRING_1    | STRING_8  | STRING_3  | Граничные нижние значения  |
      | STRING_60 | STRING_250 | STRING_1000 | STRING_20 | STRING_50 | Граничные верхние значения |

#  Нельзя проверить ничего более до тех пор пока таблицы не создаются реально
