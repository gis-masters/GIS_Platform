Feature: Поле string: внешний вид
  Scenario: Внешний вид заполненного большим значением редактируемого поля
    Given я на странице "form-field-string--long-value-editable" библиотеки блоков
    Then блок FormControlTypeString вариант "long-value-editable" выглядит как положено

  Scenario: Внешний вид заполненного редактируемого поля
    Given я на странице "form-field-string--editable" библиотеки блоков
    Then блок FormControlTypeString вариант "editable" выглядит как положено

  Scenario: Внешний вид пустого редактируемого поля
    Given я на странице "form-field-string--editable-empty" библиотеки блоков
    Then блок FormControlTypeString вариант "editable-empty" выглядит как положено

  Scenario: Внешний вид заполненного большим значением поля в режиме чтения
    Given я на странице "form-field-string--long-value-view" библиотеки блоков
    Then блок FormViewTypeString вариант "long-value-view" выглядит как положено

  Scenario: Внешний вид заполненного поля в режиме чтения
    Given я на странице "form-field-string--view" библиотеки блоков
    Then блок FormViewTypeString вариант "view" выглядит как положено

  Scenario: Внешний вид пустого поля в режиме чтения
    Given я на странице "form-field-string--view-empty" библиотеки блоков
    Then блок FormViewTypeString вариант "view-empty" выглядит как положено

  Scenario: Внешний вид заполненного большим значением и раскрытого поля в режиме чтения
    Given я на странице "form-field-string--long-value-view" библиотеки блоков
    When я нажимаю кнопку `Показать всё`
    Then блок FormViewTypeString вариант "long-value-view-opened" выглядит как положено

  Scenario: Внешний вид поля с ограниченным большим значением в режиме чтения
    Given я на странице "form-field-string--long-value-view" библиотеки блоков
    When я нажимаю кнопку `Показать всё`
    And я нажимаю кнопку `Свернуть`
    Then блок FormViewTypeString вариант "long-value-view-closed" выглядит как положено
