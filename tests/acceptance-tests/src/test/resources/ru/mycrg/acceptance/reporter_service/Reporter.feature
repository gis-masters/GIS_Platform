Feature: Тесты report service с дефолтным шаблоном

  Background:
    Given Существует любая организация
    *     я авторизован как "Владелец организации"

  Scenario Outline: Все отчёты сформированные пользователем по системным шаблонам печати скачивается в ожидаемом виде
    Given сформирован отчёт по шаблону с именем "<templateName>"
    When  я скачиваю текущий отчёт
    Then  размер скачанного отчёта равен <size> байт
    Examples:
      | templateName          | size   |
      | featureExtractCompact | 15240  |
      | featureExtractFull    | 470950 |

  Scenario: Созданный отчёт сохраняется как файл платформы с ожидаемыми атрибутами
    Given сформирован отчёт по шаблону с именем "featureExtractFull"
    When  я запрашиваю атрибуты текущего файла
    Then  атрибутами отчёта как файла соответствуют ожиданиям
      | size        | 470950                   |
      | extension   | docx                     |
      | contentType | application/octet-stream |
      | signed      | false                    |
      | expired     | false                    |

  Scenario: Успешное создание отчёта возвращает идентификатор файла
    When я делаю запрос для создание отчёта c данными по-умолчанию
    Then возвращается идентификатор файла с платформы

  Scenario Outline: Созданный отчёт соответствует запрошенному формату ("<format>")
    Given создан отчёт в формате "<format>"
    When  я запрашиваю атрибуты текущего файла
    Then  отчёт соответствует формату "<format>"
    Examples:
      | format |
      | DOCX   |
      | PDF    |
      | JPEG   |
      | ODT    |

  Scenario Outline: Пользовательские шаблоны скачиваются с ожидаемым размером ("<reason>")
    Given существует пользовательский шаблон печати с именем "<templateName>"
    *     сформирован отчёт по шаблону с именем "<templateName>"
    When  я скачиваю текущий отчёт
    Then  размер скачанного отчёта равен <size> байт
    Examples:
      | templateName            | size  | reason                                  |
      | user template           | 39052 | Простой шаблон печати                   |
      | test pictures in arrays | 75053 | Сложный шаблон печати с циклом картинок |
