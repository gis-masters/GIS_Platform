Feature: Поле fias в таблице: внешний вид

  Scenario: Внешний вид поля со значением переполняющим поле в свернутом виде
    Given я на странице "xtable-cellcontent--type-fias-overflow" библиотеки блоков
    Then блок XTableCellContentTypeFias вариант "hiden" выглядит как положено

  Scenario: Внешний вид поля со значением переполняющим поле в развернутом виде
    Given я на странице "xtable-cellcontent--type-fias-overflow" библиотеки блоков
    When я нажимаю кнопку `Показать всё`
    Then блок XTableCellContentTypeFias вариант "show" выглядит как положено

  Scenario: Внешний вид поля со значением переполняющим поле в развернутом и потом свернутом виде
    Given я на странице "xtable-cellcontent--type-fias-overflow" библиотеки блоков
    When я нажимаю кнопку `Показать всё`
    And я нажимаю кнопку `Свернуть`
    Then блок XTableCellContentTypeFias вариант "hiden" выглядит как положено
