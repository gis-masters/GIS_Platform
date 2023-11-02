Feature: xTable Cell Content Type String

  Scenario: Внешний вид ячейки таблицы с очень длинной строкой
    Given я на странице "xtable-cellcontent--type-string-overflow" библиотеки блоков
    Then блок XTableCellContentTypeString вариант "hide-text" выглядит как положено

  Scenario: Внешний вид ячейки таблицы с очень длинной строкой в развёрнутом виде
    Given я на странице "xtable-cellcontent--type-string-overflow" библиотеки блоков
    When я нажимаю кнопку `Показать всё`
    Then блок XTableCellContentTypeString вариант "show-text" выглядит как положено

  Scenario: Внешний вид ячейки таблицы с очень длинной строкой во вновь свёрнутом виде
    Given я на странице "xtable-cellcontent--type-string-overflow" библиотеки блоков
    When я нажимаю кнопку `Показать всё`
    When я нажимаю кнопку `Свернуть`
    Then блок XTableCellContentTypeString вариант "hide-text" выглядит как положено
