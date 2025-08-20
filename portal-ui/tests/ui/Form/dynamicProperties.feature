Feature: Форма: динамические свойства

    https://azure2022eng.geoplan.local/DefaultCollection/GIS_Platform/_wiki/wikis/GIS-Platform.wiki/67/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D0%BE%D0%BB%D1%8F-PropertySchema?anchor=dynamicpropertyformula

  Background:
    Given я на странице "form--dynamic-properties" библиотеки блоков

  Scenario: При изменении поля зависящее от него поле изменяется согласно dynamicPropertyFormula

    Форма на этой странице в библиотеке блоков имеет свойство, у которого title зависит от значения другого поля.

    When в форме в поле "Название*" типа string я ввожу текст "тест123"
    Then в форме существует поле "Надпись на тест123"

  Scenario: Добавление required свойства с помощью динамического свойства работает корректно
    When    на странице формы в библиотеке блоков я нажимаю кнопку валидации
    Then    блок FormContent вариант "required-dynamic-properties" выглядит как положено
