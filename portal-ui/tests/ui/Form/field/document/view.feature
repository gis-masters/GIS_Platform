Feature: Поле document: внешний вид
  Scenario: Внешний вид одиночного редактируемого поля
    Given я на странице "form-field-document--single-editable" библиотеки блоков
    Then блок "FormControlTypeDocument" вариант "single-editable" выглядит как положено

  Scenario: Внешний вид пустого одиночного редактируемого поля
    Given я на странице "form-field-document--single-editable-empty" библиотеки блоков
    Then блок "FormControlTypeDocument" вариант "single-editable-empty" выглядит как положено

  Scenario: Внешний вид множественного поля
    Given я на странице "form-field-document--multiple-editable" библиотеки блоков
    Then блок "FormControlTypeDocument" вариант "multiple-editable" выглядит как положено

  Scenario: Внешний вид множественного поля с переполнением
    Given я на странице "form-field-document--multiple-editable-scroll" библиотеки блоков
    Then блок "FormControlTypeDocument" вариант "multiple-editable-scroll" выглядит как положено

  Scenario: Внешний вид пустого множественного поля
    Given я на странице "form-field-document--multiple-editable-empty" библиотеки блоков
    Then блок "FormControlTypeDocument" вариант "multiple-editable-empty" выглядит как положено

  Scenario: Внешний вид в режиме чтения
    Given я на странице "form-field-document--single-view" библиотеки блоков
    Then блок "FormViewTypeDocument" вариант "single-view" выглядит как положено

  Scenario: Внешний вид пустого поля в режиме чтения
    Given я на странице "form-field-document--single-view-empty" библиотеки блоков
    Then блок "FormViewTypeDocument" вариант "single-view-empty" выглядит как положено

  Scenario: Внешний вид множественного поля в режиме чтения
    Given я на странице "form-field-document--multiple-view" библиотеки блоков
    Then блок "FormViewTypeDocument" вариант "multiple-view" выглядит как положено

  Scenario: Внешний вид множественного поля в режиме чтения с переполнением
    Given я на странице "form-field-document--multiple-view-scroll" библиотеки блоков
    Then блок "FormViewTypeDocument" вариант "multiple-view-scroll" выглядит как положено

  Scenario: Внешний вид пустого множественного поля в режиме чтения
    Given я на странице "form-field-document--multiple-view-empty" библиотеки блоков
    Then блок "FormViewTypeDocument" вариант "multiple-view-empty" выглядит как положено
