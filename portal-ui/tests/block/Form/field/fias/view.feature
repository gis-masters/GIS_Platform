Feature: Поле fias: внешний вид
  Scenario: Внешний вид заполненного поля адреса
    Given я на странице "form-field-fias--filled-address" библиотеки блоков
    Then блок Fias вариант "address" выглядит как положено

  Scenario: Внешний вид заполненного поля ОКТМО
    Given я на странице "form-field-fias--filled-oktmo" библиотеки блоков
    Then блок Fias вариант "oktmo" выглядит как положено

  Scenario: Внешний вид пустого поля
    Given я на странице "form-field-fias--empty" библиотеки блоков
    Then блок Fias вариант "empty" выглядит как положено
