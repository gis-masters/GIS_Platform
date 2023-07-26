Feature: Поле file

  Scenario Outline: Файл dxf и gml можно публиковать только из формы с ролью "viewDocument"(просмотр документа)
    Given я на странице "form-field-file--multiple-editable-with-form-role-view-document" библиотеки блоков
    Then в поле файла у прикрепленного файла "<файл>" есть кнопка `Разместить в проекте`

    Examples:
      | файл     |
      | test.dxf |
      | test.gml |

  Scenario Outline: У файла с расширениями dxf,gml нет кнопки кнопка "Разместить в проекте"
    Given я на странице "form-field-file--multiple-editable-without-form-roles" библиотеки блоков
    Then в поле файл у прикрепленного файла "<файл>" нет кнопки `Разместить в проекте`

    Examples:
      | файл     |
      | test.dxf |
      | test.gml |
