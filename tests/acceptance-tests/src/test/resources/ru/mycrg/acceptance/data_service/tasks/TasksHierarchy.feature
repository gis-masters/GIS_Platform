Feature: Доступность и управление задачами согласно иерархии пользователей

  # Иерархия пользователей: "Иерархия вариант 1"                Своих задач   Должен видеть
  # orgOwner      Владелец организации                          2             12
  #   fiz1        пользователь-1 у которого начальник OrgOwner  3             3
  #   fiz2        пользователь-2 у которого начальник OrgOwner  2             6
  #     fiz3      пользователь-3 у которого начальник fiz2      1             4
  #       fiz4    пользователь-4 у которого начальник fiz3      3             3
  # fiz5          пользователь-5 без начальника                 1             1

  #  Задачи:
  #  | owner    | ownerName | type   | description     | taskId |
  #  | orgOwner | orgOwner  | CUSTOM | orgOwner task 1 | 1      |
  #  | orgOwner | orgOwner  | CUSTOM | orgOwner task 2 | 2      |
  #  | fiz1     | fiz1      | CUSTOM | fiz1 task 1     | 3      |
  #  | fiz1     | fiz1      | CUSTOM | fiz1 task 2     | 4      |
  #  | fiz1     | fiz1      | CUSTOM | fiz1 task 3     | 5      |
  #  | fiz2     | fiz2      | CUSTOM | fiz2 task 1     | 6      |
  #  | fiz2     | fiz2      | CUSTOM | fiz2 task 2     | 7      |
  #  | fiz3     | fiz3      | CUSTOM | fiz3 task 1     | 8      |
  #  | fiz4     | fiz4      | CUSTOM | fiz4 task 1     | 9      |
  #  | fiz4     | fiz4      | CUSTOM | fiz4 task 2     | 10     |
  #  | fiz4     | fiz4      | CUSTOM | fiz4 task 3     | 11     |
  #  | fiz5     | fiz5      | CUSTOM | fiz5 task 1     | 12     |

  Background:
    Given Существует организация созданная по шаблону: "для тестирования доступности задач согласно иерархии пользователей"
    *     задачи актуализированы согласно шаблона "для тестирования доступности задач согласно иерархии пользователей"

  Scenario Outline: При выборке задачи по ID получаем конкретную задачу. <reason>
    Given я авторизован как "Владелец организации"
    When  я делаю выборку задач с фильтром по recordId "<tasks>"
    Then  в выборке только задачи "<expected>"
    Examples:
      | tasks                                  | expected                 | reason                              |
      | orgOwner task 2                        | orgOwner task 2          | Простая выборка одного элемента     |
      | fiz1 task 1, fiz4 task 2               | fiz1 task 1, fiz4 task 2 | Простая выборка двух элементов      |
      | NOT_EXIST_TASK                         |                          | Несуществующий ID                   |
      | fiz4 task 1, fiz4 task 1               | fiz4 task 1              | Одинаковый ID                       |
      | fiz5 task 1, fiz1 task 1, notExistTask | fiz5 task 1, fiz1 task 1 | Смесь того что есть и того чего нет |

  Scenario: Владельцу организации доступны все задачи (не зависит от иерархии)
    Given я авторизован как "Владелец организации"
    When  я делаю выборку всех задач
    Then  В выборке присутствуют определённое кол-во элементов: 12

  Scenario Outline: Задачи доступны согласно иерархии. Пользователю <userName> доступно: <expected> задач.
    Given я авторизован как "<userName>"
    When  я делаю выборку всех задач
    Then  В выборке присутствуют определённое кол-во элементов: <expected>
    Examples:
      | userName | expected |
      | orgOwner | 12       |
      | fiz1     | 3        |
      | fiz2     | 6        |
      | fiz3     | 4        |
      | fiz4     | 3        |
      | fiz5     | 1        |

  Scenario Outline: При выборке всех задач поддерживается ECQL фильтр. При фильтре: '<filter>' ожидаем: <expected> элементов
    Given я авторизован как "fiz2"
    When  я делаю выборку всех задач с фильтром "<filter>"
    Then  В выборке присутствуют определённое кол-во элементов: <expected>
    Examples:
      | filter                                                                                             | expected |
      | description ILIKE '%fiz2%'                                                                         | 2        |
      | type IN('ASSIGNABLE')                                                                              | 0        |
      | status IS null                                                                                     | 0        |
      | assignedTo > 1                                                                                     | 6        |
      | ownerId > 1                                                                                        | 6        |
      | dueDate >= '2023-07-06'                                                                            | 0        |
      | ((description ILIKE '%2%') AND (type IN('CUSTOM')) AND (ownerId > 1)) AND ((status IN('CREATED'))) | 3        |

  Scenario Outline: Назначение задач возможно только для своего непосредственного подчиненного. <reason>
    Given я авторизован как "<creator>"
    When  я создаю задачу на пользователя "<owner>"
    Then  Сервер отвечает со статус-кодом <expectedStatus>
    Examples:
      | creator  | owner    | expectedStatus | reason                                                               |
      | orgOwner | fiz2     | 201            | Назначение задачи на своего подчиненного владельцем организации      |
      | orgOwner | orgOwner | 201            | Назначение задачи на себя                                            |
      | fiz2     | fiz3     | 201            | Назначение задачи на своего подчиненного пользователем               |
      | fiz2     | fiz4     | 400            | Попытка назначить задачу НЕ на своего непосредственного подчиненного |
      | fiz1     | fiz3     | 400            | Попытка назначить задачу НЕ на своего подчиненного                   |
      | orgOwner | fiz4     | 400            | Попытка назначить задачу НЕ на своего подчиненного                   |

  Scenario Outline: Редактировать возможно только свои задачи и задачи непосредственных подчиненных. <reason>
    Given пользователем "<creator>" создана задача на пользователя "<owner>"
    Given я авторизован как "<actor>"
    When  я меняю описание текущей задачи на: "I'll be back!"
    Then  Сервер отвечает со статус-кодом <httpCode>
    And   описание текущей задачи изменено на: "<expectedDescription>"
    Examples:
      | creator  | owner    | actor    | httpCode | expectedDescription | reason                                            |
      | orgOwner | fiz2     | orgOwner | 204      | I'll be back!       | Задача непосредственного подчиненного             |
      | orgOwner | orgOwner | orgOwner | 204      | I'll be back!       | Своя задача                                       |
      | fiz2     | fiz3     | orgOwner | 204      | I'll be back!       | Задача подчиненного-подчиненного                  |
      | fiz3     | fiz4     | orgOwner | 204      | I'll be back!       | Задача под-под-подчиненного                       |
      | fiz2     | fiz3     | fiz2     | 204      | I'll be back!       | Задача непосредственного подчиненного             |
      | fiz3     | fiz4     | fiz4     | 204      | I'll be back!       | Своя задача                                       |
      | fiz3     | fiz4     | fiz5     | 400      | old description     | Пользователь не является наследуемым  начальником |
      | orgOwner | fiz2     | fiz3     | 400      | old description     | Пользователь не является наследуемым  начальником |

  Scenario Outline: Изменять статус возможно только своих задач и задач непосредственных подчиненных. <reason>
    Given пользователем "<creator>" создана задача на пользователя "<owner>"
    Given я авторизован как "<actor>"
    When  я меняю статус текущей задачи на: "CANCELED"
    Then  Сервер отвечает со статус-кодом <httpCode>
    And   задача изменила статус на "<expectedStatus>"
    Examples:
      | creator  | owner    | actor    | httpCode | expectedStatus | reason                                                                       |
      | orgOwner | fiz2     | orgOwner | 204      | CANCELED       | Редактирование статуса задачи непосредственного   подчиненного               |
      | orgOwner | orgOwner | orgOwner | 204      | CANCELED       | Редактирование статуса своей задачи                                          |
      | fiz2     | fiz3     | orgOwner | 400      | CREATED        | Запрещено редактирование статуса задачи НЕ  непосредственного подчиненного   |
      | fiz2     | fiz3     | fiz2     | 204      | CANCELED       | Редактирование статуса задачи непосредственного  подчиненного                |
      | fiz3     | fiz4     | orgOwner | 400      | CREATED        | Запрещено редактирование статуса задачи НЕ  непосредственного   подчиненного |
      | fiz4     | fiz4     | fiz4     | 204      | CANCELED       | Редактирование статуса своей задачи                                          |

  Scenario: При делегировании задачи корректно обновляется начальник исполнителя
    Given пользователем "orgOwner" создана задача на пользователя "fiz2"
    *     я авторизован как "fiz2"
    When  я меняю исполнителя текущей задачи на: "fiz3"
    Then  сервер отвечает со статус-кодом 204
    And   начальник в текущей задаче соответствует: "fiz2"
