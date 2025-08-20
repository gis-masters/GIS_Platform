Feature: Поле user: внешний вид
  Scenario: Внешний вид одиночного редактируемого поля
    Given   я на странице "form-field-user--single-editable" библиотеки блоков
    Then    блок FormControlTypeUser вариант "single-editable" выглядит как положено

  Scenario: Внешний вид пустого одиночного редактируемого поля
    Given   я на странице "form-field-user--single-editable-empty" библиотеки блоков
    Then    блок FormControlTypeUser вариант "single-editable-empty" выглядит как положено

  Scenario: Внешний вид множественного поля
    Given   я на странице "form-field-user--multiple-editable" библиотеки блоков
    Then    блок FormControlTypeUser вариант "multiple-editable" выглядит как положено

  Scenario: Внешний вид пустого множественного поля
    Given   я на странице "form-field-user--multiple-editable-empty" библиотеки блоков
    Then    блок FormControlTypeUser вариант "multiple-editable-empty" выглядит как положено

  Scenario: Внешний вид множественного поля с переполнением
    Given   я на странице "form-field-user--multiple-scroll-editable" библиотеки блоков
    Then    блок FormControlTypeUser вариант "multiple-scroll-editable" выглядит как положено

  Scenario: Внешний вид в режиме чтения
    Given   я на странице "form-field-user--single-view" библиотеки блоков
    Then    блок FormViewTypeUser вариант "single-view" выглядит как положено

  Scenario: Внешний вид пустого поля в режиме чтения
    Given   я на странице "form-field-user--single-view-empty" библиотеки блоков
    Then    блок FormViewTypeUser вариант "single-view-empty" выглядит как положено

  Scenario: Внешний вид множественного поля в режиме чтения
    Given   я на странице "form-field-user--multiple-view" библиотеки блоков
    Then    блок FormViewTypeUser вариант "multiple-view" выглядит как положено

  Scenario: Внешний вид пустого множественного поля в режиме чтения
    Given   я на странице "form-field-user--multiple-view-empty" библиотеки блоков
    Then    блок FormViewTypeUser вариант "multiple-view-empty" выглядит как положено

  Scenario: Внешний вид множественного поля в режиме чтения с переполнением
    Given   я на странице "form-field-user--multiple-scroll-view" библиотеки блоков
    Then    блок FormViewTypeUser вариант "multiple-scroll-view" выглядит как положено

  Scenario: Внешний вид диалогового окна выбора одного пользователя
    Given   я на странице "form-field-user--single-editable" библиотеки блоков
    When    в форме в поле "Начальник" типа user я нажимаю на кнопку `Добавить пользователя`
    Then    блок UsersAddDialog вариант "single-select" выглядит как положено

  Scenario: Внешний вид диалогового окна выбора нескольких пользователей
    Given   я на странице "form-field-user--multiple-editable" библиотеки блоков
    When    в форме в поле "Начальники" типа user я нажимаю на кнопку `Добавить пользователя`
    Then    блок UsersAddDialog вариант "multiple-select" выглядит как положено
