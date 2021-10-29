Feature: Импорт gml файла как процесс

  Background:
    Given Существует любая организация
    When Авторизируемся владельцем организации

  Scenario Outline: Процесс импорта GML файла c некорректными параметрами запроса ("<reason>").
    When Пытаемся инициализировать импорт GML файла "<wsUiId>" "<libraryId>" "<objectId>" "<projectId>" "<projectName>" "<projectIsNew>"
    Then Сервер отвечает со статус-кодом 400
    And В ответе пункт "errors[0].field" имеет значение "<responseField>"
    And В ответе пункт "errors[0].message" имеет значение "<responseMessage>"
    Examples:
      | wsUiId   | libraryId | objectId | projectId | projectName | projectIsNew | reason                                                    | responseField | responseMessage                                                              |
      | STRING_6 | STRING_8  | NUMBER_2 | NULL      | STRING_8    | false        | Обязательный projectId если проект заявляется не новым    | projectId     | Обязательно для заполнения                                                   |
      | STRING_6 | STRING_8  | NUMBER_2 | NUMBER_2  | NULL        | true         | Обязательный projectName если проект заявляется новым     | projectName   | Обязательно для заполнения                                                   |
      | NULL     | STRING_8  | NUMBER_2 | NUMBER_2  | NULL        | false        | Обязателен wsUiId поскольку UI сейчас по другому не умеет | wsUiId        | Обязательно для заполнения                                                   |
      | STRING_6 | STRING_8  | NUMBER_2 | NUMBER_2  | STRING_2    | true         | projectName минимальная длинна                            | projectName   | Не менее 3 и не более 250 символов                                           |
      | STRING_6 | STRING_8  | NUMBER_2 | NUMBER_2  | STRING_300  | true         | projectName максимальная длинна                           | projectName   | Не менее 3 и не более 250 символов                                           |
      | STRING_6 | STRING_8  | NUMBER_2 | NUMBER_2  | F$%^$%^     | true         | projectName максимальная длинна                           | projectName   | Должно начинаться с буквы. Затем может содержать: буквы, цифры и символы .-_ |

#  Нужен тест с реальной таблицей и объектами. "со случайными параметрами" теперь не прокатывает, работает проверка что объект не существует
#  Scenario: При старте процесса импорта сервер возвращает тело процесса
#    When Пользователь инициализирует импорт GML файла со случайными параметрами
#    Then Сервер отвечает со статус-кодом 202
#    And Сервер возвращает тело начатого процесса

#  Scenario: При неудачном завершении процесса его статус становится ERROR, а подробности записываются в details
#    When Пользователь инициализирует импорт GML файла со случайными параметрами
#    Then процесс завершается неудачей, в отчет записана причина
