Feature: Права на проекты
  Background: Существует организация с пользователями:
  owner@o - OWNER(id: 2), test1@o - USER(id: 10), test2@o - USER(id: 11)
  Создано три проекта: "test1"(id: 202), "test2"(id: 203), "test3"(id: 204)

  Scenario: По-умолчанию новоый проект виден только владельцу
    When Пользователь test1@o запрашивает список проектов
    Then сервер отвечает кодом 200 с пустым списком

  Scenario: Получение всех пермишенов(правил доступа)
    When Владелец посылает запрос GET на "/projects/204/permissions"
    Then сервер отвечает кодом 200 с пустым списком

  Scenario: Создание правила
    When Владелец посылает запрос POST на "/projects/204/permissions" с телом:
         | {
         |  "principalType": "user",
         |  "principalId": 10,
         |  "role": "VIEWER"
         | }
    Then сервер отвечает кодом 201 с телом правила
    And Повторный запрос на создание такого же правила
    Then сервер отвечает 409 "Permission already exist"
    And Пользователь test1@o запрашивает список проектов
    Then пользователю доступен только одни проект с id: 204

  Scenario: Обновление правила
    Given Существует правило с id: 37 для проекта с id: 204
          | {
          |  "principalType": "user",
          |  "principalId": 10,
          |  "role": "VIEWER"
          | }
    When Владелец организации посылает запрос на обновление PATCH на /projects/204/permissions/37
         с заголовком "Content-Type": "application/merge-patch+json" и телом:
          | {
          |  "principalType": "group"
          | }
    Then сервер отвечает кодом 204
    And запрашивая это правило
    Then получаем измененное правило с "principalType": "group"

  Scenario: Удаление правила
    When Владелец посылает запрос DELETE на "/projects/204/permissions/{permission_id}"
    Then сервер отвечает кодом 204
    And при повторном запросе
    Then сервер отвечает кодом 404
