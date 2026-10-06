Feature: Поле string: display phone
  Scenario: Внешний вид заполненного редактируемого поля phone
    Given я на странице "form-field-string--phone-editable" библиотеки блоков
    Then блок FormControlTypeString вариант "phone-editable" выглядит как положено

  Scenario: Внешний вид поля phone в режиме чтения
    Given я на странице "form-field-string--phone-view" библиотеки блоков
    Then блок FormViewTypeString вариант "phone-view" выглядит как положено

  Scenario: Внешний вид пустого редактируемого поля phone с маской
    Given я на странице "form-field-string--phone-editable-empty" библиотеки блоков
    Then блок FormControlTypeString вариант "phone-editable-empty" выглядит как положено

  Scenario: Ввод цифр в пустое поле phone форматирует значение по маске
    Given я на странице "form-field-string--phone-editable-empty" библиотеки блоков
    When в форме в поле "земельный участок" типа string я ввожу текст "79781234567"
    Then в форме в поле "земельный участок" типа string значение "7 (978) 123 45 67"

  Scenario: Удаление символов с конца поля phone убирает цифры и сохраняет маску
    Given я на странице "form-field-string--phone-editable" библиотеки блоков
    When в форме в поле "земельный участок" типа string я нажимаю Backspace 2 раз
    Then в форме в поле "земельный участок" типа string значение "7 (978) 123 45 __"

  Scenario: Редактирование в середине поля phone удаляет и добавляет цифру
    Given я на странице "form-field-string--phone-editable" библиотеки блоков
    When в форме в поле "земельный участок" типа string я ставлю курсор на позицию 4
    And в форме в поле "земельный участок" типа string я нажимаю Backspace
    Then в форме в поле "земельный участок" типа string значение "7 (781) 234 56 7_"
    When в форме в поле "земельный участок" типа string я ставлю курсор на позицию 3
    And в форме в поле "земельный участок" типа string я ввожу в позицию курсора "9"
    Then в форме в поле "земельный участок" типа string значение "7 (978) 123 45 67"

  Scenario: Вставка цифр из буфера в пустое поле phone форматирует значение по маске
    Given я на странице "form-field-string--phone-editable-empty" библиотеки блоков
    When в форме в поле "земельный участок" типа string я вставляю из буфера "79781234567"
    Then в форме в поле "земельный участок" типа string значение "7 (978) 123 45 67"

  Scenario: Вставка форматированного номера из буфера в пустое поле phone приводит значение к маске
    Given я на странице "form-field-string--phone-editable-empty" библиотеки блоков
    When в форме в поле "земельный участок" типа string я вставляю из буфера "7 (978) 123 45 67"
    Then в форме в поле "земельный участок" типа string значение "7 (978) 123 45 67"
