Feature: Форма: значение по умолчанию

    https://azure2022eng.geoplan.local/DefaultCollection/GIS_Platform/_wiki/wikis/GIS-Platform.wiki/67/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D0%BE%D0%BB%D1%8F-PropertySchema?anchor=defaultvalue

  Background:
    Given я на странице "form--default-value" библиотеки блоков

  Scenario: При использовании свойства defaultValue в схеме поля значение по-умолчанию этого поля соответствует значению свойства
    Then в форме в поле "Имя" типа string значение "John"

  Scenario: При использовании свойства defaultValueWellKnownFormula со значением "inherit" в схеме поля значение по-умолчанию этого поля берётся из одноимённого поля родителя
    Then в форме в поле "Фамилия" типа string значение "Doe"

  Scenario: При использовании свойства defaultValueFormula в схеме поля значение по-умолчанию этого поля вычисляется согласно js-формуле из этого свойства
    Then в форме в поле "Инициалы" типа string значение "J. D."
