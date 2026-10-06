Feature: Поле со связанными документами: внешний вид

  https://azure2022eng.geoplan.local/DefaultCollection/GIS_Platform/_wiki/wikis/GIS-Platform.wiki?pagePath=/Контент%20Менеджмент/Схемы%20данных/Свойства%20объекта-схемы&anchor=relations

  Scenario: Внешний вид редактируемого поля со связанными документами
    Given я на странице "form-field-withrelations--editable" библиотеки блоков
    Then блок FormContent вариант "withrelations-editable" выглядит как положено

  Scenario: Внешний вид поля со связанными документами в режиме чтения
    Given я на странице "form-field-withrelations--read-only" библиотеки блоков
    Then блок FormContent вариант "withrelations-read-only" выглядит как положено
