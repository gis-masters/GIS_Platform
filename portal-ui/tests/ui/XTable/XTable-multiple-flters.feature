Feature: xTable Multiple Filters

  Background:
    Given я на странице "xtable-filter--multiple-string-filters" библиотеки блоков

  Scenario: При нескольких активных фильтрах значения в колонках имеют жёлтую подсветку
    When  в таблице xtable я ввожу в поле фильтра "Название" типа string значение "Ст"
    When  в таблице xtable я ввожу в поле фильтра "Материал" типа string значение "oo"
    Then  блок xTable вариант "multiple-highlights" выглядит как положено
