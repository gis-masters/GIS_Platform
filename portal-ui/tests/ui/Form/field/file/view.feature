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

  Scenario: Внешний вид одиночного редактируемого поля
    Given я на странице "form-field-file--single-editable" библиотеки блоков
    Then блок FormControlTypeFile вариант "single-editable" выглядит как положено

  Scenario: Внешний вид пустого одиночного редактируемого поля
    Given я на странице "form-field-file--single-editable-empty" библиотеки блоков
    Then блок FormControlTypeFile вариант "single-editable-empty" выглядит как положено

  Scenario: Внешний вид множественного поля
    Given я на странице "form-field-file--multiple-editable" библиотеки блоков
    Then блок FormControlTypeFile вариант "multiple-editable" выглядит как положено

  Scenario: Внешний вид множественного поля с переполнением
    Given я на странице "form-field-file--multiple-editable-scroll" библиотеки блоков
    Then блок FormControlTypeFile вариант "multiple-editable-scroll" выглядит как положено

  Scenario: Внешний вид пустого множественного поля
    Given я на странице "form-field-file--multiple-editable-empty" библиотеки блоков
    Then блок FormControlTypeFile вариант "multiple-editable-empty" выглядит как положено

  Scenario: Внешний вид в режиме чтения
    Given я на странице "form-field-file--single-view" библиотеки блоков
    Then блок FormViewTypeFile вариант "single-view" выглядит как положено

  Scenario: Внешний вид пустого поля в режиме чтения
    Given я на странице "form-field-file--single-view-empty" библиотеки блоков
    Then блок FormViewTypeFile вариант "single-view-empty" выглядит как положено

  Scenario: Внешний вид множественного поля в режиме чтения
    Given я на странице "form-field-file--multiple-view" библиотеки блоков
    Then блок FormViewTypeFile вариант "multiple-view" выглядит как положено

  Scenario: Внешний вид множественного поля в режиме чтения с переполнением
    Given я на странице "form-field-file--multiple-view-scroll" библиотеки блоков
    Then блок FormViewTypeFile вариант "multiple-view-scroll" выглядит как положено

  Scenario: Внешний вид пустого множественного поля в режиме чтения
    Given я на странице "form-field-file--multiple-view-empty" библиотеки блоков
    Then блок FormViewTypeFile вариант "multiple-view-empty" выглядит как положено
