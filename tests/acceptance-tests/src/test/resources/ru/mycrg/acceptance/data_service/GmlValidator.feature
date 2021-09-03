Feature: Импорт gml файла

  Background:
    Given Существует организация
      | ООО БыкиИКоровы | 1234567890 | Иванов | Иван | EMAIL_20 | testPassword1 |
    When Авторизируемся владельцем организации

  Scenario Outline: Импорт gml файла c некорректными параметрами запроса ("<reason>").
    When Пользователь делает запрос на импорт gml файла "<gmlFile>" "<oktmo>" "<documentType>" "<details>" "<docDateApprove>" "<scale>" "<title>" "<invertCoordinates>"
    Then Сервер отвечает со статус-кодом 400
    Examples:
      | gmlFile        | oktmo     | documentType | details     | docDateApprove | scale    | title      | invertCoordinates | reason                                                     |
      | correct.gml    | NUMBER_4  | STRING_8     | STRING_8    | 2021-01-01     | NUMBER_0 | STRING_8   | false             | scale: не допускается пустое значение                      |
      | STRING_0       | NUMBER_4  | STRING_8     | STRING_8    | 2021-01-01     | NUMBER_4 | STRING_8   | false             | gmlFile: не допускается пустое значение                    |
      | empty.gml      | NUMBER_4  | STRING_8     | STRING_8    | 2021-01-01     | NUMBER_4 | STRING_8   | false             | gmlFile: файл не может быть пустым                         |
      | correct_mp.xml | NUMBER_4  | STRING_8     | STRING_8    | 2021-01-01     | NUMBER_4 | STRING_8   | false             | gmlFile: файл не может быть с расширением, отличным от gml |
      | correct.gml    | NUMBER_4  | STRING_8     | STRING_8    | 2021-01-01     | NUMBER_4 | STRING_0   | false             | title: не допускается пустое значение                      |
      | correct.gml    | NUMBER_4  | STRING_8     | STRING_8    | 2021-01-01     | NUMBER_4 | STRING_251 | false             | title: не может быть длиннее 250 символов                  |
      | correct.gml    | NUMBER_4  | STRING_8     | STRING_1001 | 2021-01-01     | NUMBER_4 | STRING_8   | false             | details: не может быть длиннее 1000 символов               |
      | correct.gml    | NUMBER_51 | STRING_8     | STRING_8    | 2021-01-01     | NUMBER_4 | STRING_8   | false             | oktmo: не допускается пустое значение                      |
      | correct.gml    | NUMBER_51 | STRING_8     | STRING_8    | 2021-01-01     | NUMBER_4 | STRING_8   | false             | oktmo: не  может быть длиннее 50 символов                  |
      | correct.gml    | NUMBER_4  | STRING_0     | STRING_8    | 2021-01-01     | NUMBER_4 | STRING_8   | false             | documentType: не допускается пустое значение               |
      | correct.gml    | NUMBER_4  | STRING_101   | STRING_8    | 2021-01-01     | NUMBER_4 | STRING_8   | false             | documentType: не  может быть длиннее 100 символов          |
      | correct.gml    | NUMBER_4  | STRING_8     | STRING_8    | STRING_0       | NUMBER_4 | STRING_8   | false             | docDateApprove: должен быть в формате YYYY-MM-DD           |
