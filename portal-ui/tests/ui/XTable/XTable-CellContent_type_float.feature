Feature: xTable Cell Content Type Float

  Scenario: Значения в колонке выглядят как положено
    Given я на странице "xtable-cellcontent--type-float" библиотеки блоков
    Then в первой колонке таблицы xTable содержатся только элементы:
      | 3.99          |
      | 4.1           |
      | 14.090888899  |
      | 16            |
      | 20.2345234    |
      | 420.0001      |

  Scenario: При указанном значении precision:3 значения в колонке выглядят как положено
    Given я на странице "xtable-cellcontent--type-float-with-precision-3" библиотеки блоков
    Then в первой колонке таблицы xTable содержатся только элементы:
      | 3.990   |
      | 4.100   |
      | 14.091  |
      | 16.000  |
      | 20.235  |
      | 420.000 |

  Scenario: При указанном значении precision:0 значения в колонке выглядят как положено
    Given я на странице "xtable-cellcontent--type-float-with-precision-0" библиотеки блоков
    Then в первой колонке таблицы xTable содержатся только элементы:
      | 4   |
      | 4   |
      | 14  |
      | 16  |
      | 20  |
      | 420 |
