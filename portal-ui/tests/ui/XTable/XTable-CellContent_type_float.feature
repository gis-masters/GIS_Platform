Feature: xTable Cell Content Type Float

  Scenario: Значения в колонке выглядят как положено
    Given я на странице "xtable-cellcontent--type-float" библиотеки блоков
    Then в первой колонке таблицы xTable содержатся только элементы:
      | 20.2345234    |
      | 14.090888899  |
      | 4.1           |
      | 3.99          |
      | 420.0001      |
      | 16            |

  Scenario: При указанном значении precision:3 значения в колонке выглядят как положено
    Given я на странице "xtable-cellcontent--type-float-with-precision-3" библиотеки блоков
    Then в первой колонке таблицы xTable содержатся только элементы:
      | 20.235  |
      | 14.091  |
      | 4.100   |
      | 3.990   |
      | 420.000 |
      | 16.000  |

  Scenario: При указанном значении precision:0 значения в колонке выглядят как положено
    Given я на странице "xtable-cellcontent--type-float-with-precision-0" библиотеки блоков
    Then в первой колонке таблицы xTable содержатся только элементы:
      | 20  |
      | 14  |
      | 4   |
      | 4   |
      | 420 |
      | 16  |
