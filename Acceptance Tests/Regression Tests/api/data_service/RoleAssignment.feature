Feature: Настройка прав доступа к ресурсам "data" сервиса

  Scenario: Проверка секьюрити эндпоинта "roleAssignment"
    Given Поднят дата сервис
    And наш пользователь не имеет ролей ORG_ADMIN или GLOBAL_ADMIN
    When Выполняя любые запросы на ".../roleAssignment"
    Then получаем ответ 403


  Scenario: Добавление роли
    Given Существует схема "workspace_1" но таблица "some_table" отсутствует
    When Попытка добавить любые ограниченичя: "/api/data/schemas/workspace_1/tables/some_table/roleAssignment"
    Then приводит к 404 т.к. ресурса нет
    And
    Given Существует схема "workspace_1" в ней таблица "electricpowerstation"
    When Выполнить POST запрос на эндпоинт: "/api/data/schemas/workspace_1/tables/electricpowerstation/roleAssignment"
          с телом:
          {
            "role": "VIEWER",
            "principalType": "group",
            "principalId": 1
          }
    Then Сервер отвечает 200 с телом созданной сущности
    And
    When Выполняя повторный запрос на создание тех же ограничений.
          POST запрос на эндпоинт: "/api/data/schemas/workspace_1/tables/electricpowerstation/roleAssignment"
          с телом:
          {
            "role": "VIEWER",
            "principalType": "group",
            "principalId": 1
          }
    Then Сервер отвечает 409

  Scenario: Проверка валидации при создании пермишена
    Given Существует схема "workspace_1" и таблица "some_table"
    When Пытаемся добавлять пермишн без тела
    Then сервер отвечает кодом 400 Bad Request
    And
    When Попытка добавить пермишн с телом {}
    Then сервер отвечает кодом 400 Bad Request, с подробным описанием обязательных полей
    And
    When Попытка добавить пермишн с телом в котором неверно задан атрибут "role"
          {
            "role": "SOME_WRONG_ROLE",
            "principalType": "group",
            "principalId": 1
          }
    Then сервер отвечает кодом 400 Bad Request, с описанием допустимых значений для атрибута "role"
          { "defaultMessage": "Допустимые значения поля role: OWNER, CONTRIBUTOR, VIEWER" }
    And
    When Попытка добавить пермишн с телом в котором неверно задан атрибут "principalType"
          {
            "role": "VIEWER",
            "principalType": "WRONG",
            "principalId": 1
          }
    Then сервер отвечает кодом 400 Bad Request, с описанием допустимых значений для атрибута "principalType"
          { "defaultMessage": "Допустимые значения поля principalType: user или group" }


  Scenario: Получение пермишенов
    Given Для схемы "workspace_1" таблице "electricpowerstation" заданы пермишены
    When Выполнить GET запрос на эндпоинт: "/api/data/schemas/workspace_1/tables/electricpowerstation/roleAssignment"
    Then Сервер отвечает 200 с постраничным списком обьектов

  Scenario: Удаление всех пермишенов
    Given Для схемы "workspace_1" таблицы "electricpowerstation" заданы пермишены
    When Выполнить DELETE запрос на эндпоинт: "/api/data/schemas/workspace_1/tables/electricpowerstation/roleAssignment"
    Then Сервер отвечает 204
    And
    When на повторное выполнение запроса
    Then сервер ответит 404

  Scenario: Удаление пермишена с ид 1
    Given Для схемы "workspace_1" таблицы "electricpowerstation" заданы пермишены
    When Выполнить DELETE запрос на эндпоинт: "/api/data/schemas/workspace_1/tables/electricpowerstation/roleAssignment/1"
    Then Сервер отвечает 204

  Scenario: Удаление не существующего пермишена
    Given Для схемы "workspace_1" таблицы "electricpowerstation" не задано пермишенов
    When Выполнить DELETE запрос на эндпоинт: "/api/data/schemas/workspace_1/tables/electricpowerstation/roleAssignment/1"
    Then Сервер отвечает 404

  Scenario: Обновление пермишенов не поддерживается
    Given Существуют схема/таблица и наложены пермишены
    When Запросы на обновление этих пермишенов
    Then приводят к 404
