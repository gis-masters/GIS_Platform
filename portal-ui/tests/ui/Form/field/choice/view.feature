Feature: Поле choice: внешний вид
  Scenario: Внешний вид заполненного большим значением редактируемого поля
    Given я на странице "form-field-choice--long-value-editable" библиотеки блоков
    Then блок FormControlTypeChoice вариант "long-value-editable" выглядит как положено

  Scenario: Внешний вид заполненного редактируемого поля
    Given я на странице "form-field-choice--editable" библиотеки блоков
    Then блок FormControlTypeChoice вариант "editable" выглядит как положено

  Scenario: Внешний вид пустого редактируемого поля
    Given я на странице "form-field-choice--editable-empty" библиотеки блоков
    Then блок FormControlTypeChoice вариант "editable-empty" выглядит как положено

  Scenario: Внешний вид заполненного большим значением поля в режиме чтения
    Given я на странице "form-field-choice--long-value-view" библиотеки блоков
    Then блок FormViewTypeChoice вариант "long-value-view" выглядит как положено

  Scenario: Внешний вид заполненного поля в режиме чтения
    Given я на странице "form-field-choice--view" библиотеки блоков
    Then блок FormViewTypeChoice вариант "view" выглядит как положено

  Scenario: Внешний вид пустого поля в режиме чтения
    Given я на странице "form-field-choice--view-empty" библиотеки блоков
    Then блок FormViewTypeChoice вариант "view-empty" выглядит как положено

  Scenario: Внешний вид заполненного большим значением и раскрытого поля в режиме чтения
    Given я на странице "form-field-choice--long-value-view" библиотеки блоков
    When я нажимаю кнопку `Показать всё`
    Then блок FormViewTypeChoice вариант "long-value-view-opened" выглядит как положено

  Scenario: Внешний вид поля с ограниченным большим значением в режиме чтения
    Given я на странице "form-field-choice--long-value-view" библиотеки блоков
    When я нажимаю кнопку `Показать всё`
    And я нажимаю кнопку `Свернуть`
    Then блок FormViewTypeChoice вариант "long-value-view-closed" выглядит как положено
