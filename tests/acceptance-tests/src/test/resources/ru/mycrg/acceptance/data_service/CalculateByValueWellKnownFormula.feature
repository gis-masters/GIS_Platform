Feature: Работа с calculatedValueWellKnownFormula

  Background:
    Given Существует любая организация
    *     Владелец организации авторизован
    *     Существует набор данных

  Scenario: Невозможно создание таблицы, имеющей поля с calculatedValueWellKnownFormula без требуемых для вычисления полей
    Given Существует схема "rule_id_terr_Rf_subRf без требуемых полей"
    When Администратор делает запрос на создание новой таблицы по схеме "rule_id_terr_Rf_subRf без требуемых полей"
    Then Сервер отвечает со статус-кодом 400
    And Тело ответа содержит ошибку о том что для калькуляции ruleid по wellKnown формуле отсутствует поле classid

  Scenario: Невозможно создание таблицы, имеющей поля с calculatedValueWellKnownFormula с неподходящими типами полей
    Given Существует схема "rule_id_terr_Rf_subRf с неподходящими типами полей"
    When Администратор делает запрос на создание новой таблицы по схеме "rule_id_terr_Rf_subRf с неподходящими типами полей"
    Then Сервер отвечает со статус-кодом 400
    And Тело ответа содержит ошибку о том что для калькуляции ruleid по wellKnown формуле поле classid должно быть типа choice, string или int

  Scenario: Создание таблицы, имеющей поля с calculatedValueWellKnownFormula с необходимыми для вычисления полями происходит успешно
    Given Существует схема "rule_id_terr_Rf_subRf"
    When Администратор делает запрос на создание новой таблицы по схеме "rule_id_terr_Rf_subRf"
    Then Сервер отвечает со статус-кодом 201
