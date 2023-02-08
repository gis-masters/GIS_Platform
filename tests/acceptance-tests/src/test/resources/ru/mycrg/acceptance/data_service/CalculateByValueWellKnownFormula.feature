Feature: Работа с calculatedValueWellKnownFormula

  Background:
    Given Существует организация
      | ООО НаборыДанных | 1234567890 | Наборов | Набор | EMAIL_13 | testPassword1 |
    Given Авторизируемся владельцем организации
    Given Существует набор

  Scenario: Невозможно создание таблицы, имеющей поля с calculatedValueWellKnownFormula без требуемых для вычисления полей
    Given Существует схема с wellKnownFormula - rule_id_terr_Rf_subRf без требуемых полей
    When Администратор делает запрос на создание новой таблицы по схеме "fun_zone_wellknownformula_without_required_field"
    Then Сервер отвечает со статус-кодом 400
    And Тело ответа содержит ошибку о том что для калькуляции ruleid по wellKnown формуле отсутсвует поле classid

  Scenario: Невозможно создание таблицы, имеющей поля с calculatedValueWellKnownFormula с неподходящими типами полей
    Given Существует схема с wellKnownFormula - rule_id_terr_Rf_subRf с неподходящими типами полей
    When Администратор делает запрос на создание новой таблицы по схеме "fz_wellknownformula_with_not_allowed_types"
    Then Сервер отвечает со статус-кодом 400
    And Тело ответа содержит ошибку о том что для калькуляции ruleid по wellKnown формуле поле classid должно быть типа choice, string или int

  Scenario: Создание таблицы, имеющей поля с calculatedValueWellKnownFormula с необходимыми для вычисления полями происходит успешно
    Given Существует схема с wellKnownFormula - rule_id_terr_Rf_subRf
    When Администратор делает запрос на создание новой таблицы по схеме "functionalzone_wellknownformula"
    Then Сервер отвечает со статус-кодом 201
