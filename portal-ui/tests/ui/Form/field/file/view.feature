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

  Scenario: У собранного набора файлов в режиме редактирования есть только одна кнопка "Удалить набор"
    Given я на странице "form-field-file--multiple-compound-editable" библиотеки блоков
    Then в поле файл у набора файлов есть единственная кнопка `Удалить набор`

  Scenario: У собранного набора файлов в режиме просмотра есть только одна кнопка "Скачать набор файлов архивом"
    Given я на странице "form-field-file--multiple-compound-view" библиотеки блоков
    Then в поле файл у набора файлов есть единственная кнопка `Скачать набор файлов архивом`

  Scenario: У собранного набора файлов в режиме просмотра есть только одна кнопка "Разместить в проекте"
    Given я на странице "form-field-file--multiple-compound-view" библиотеки блоков
    Then в поле файл у набора файлов есть единственная кнопка `Разместить в проекте`

  Scenario: Внешний вид не собранного набора файлов в режиме просмотра
    Given я на странице "form-field-file--multiple-not-completed-compound-view" библиотеки блоков
    Then блок FormViewTypeFile вариант "not-completed-compound-file-view" выглядит как положено

  Scenario: Внешний вид не собранного набора файлов в режиме редактирования
    Given я на странице "form-field-file--multiple-not-completed-compound-editable" библиотеки блоков
    Then блок FormControlTypeFile вариант "not-completed-compound-file-editable" выглядит как положено
