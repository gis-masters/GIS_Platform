---
name: e2e-mcp
description: >-
  Справочник portal-ui: WDIO+Cucumber e2e, tests/_harness, тестовые логины,
  Playwright MCP. Подключать только по явному запросу пользователя (например
  навык e2e-mcp, @e2e-mcp, «по навыку e2e-mcp»).
---

# Отладка e2e (portal-ui)

## Стек и расположение

- **Раннер:** WebdriverIO 9 + Cucumber, спеки: `tests/e2e/**/*.feature`.
- **Harness:** шаги, страницы, блоки — `tests/_harness/` (в т.ч. `commonSteps`, `blocks`, `pages`, `commands`).
- **Канон логинов/паролей:** `tests/_harness/commands/auth/testUsers.ts` — при расхождении с таблицей ниже править навык **и** код.

## Запуск

Из корня `portal-ui` (нужны поднятый UI и окружение, как у команды):

| Команда                | Назначение                                                                                                                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run test:e2e`     | CI-ориентированный конфиг (`wdio.e2e.conf.ts`), удалённый Selenium/база из `wdio.base.conf.ts`.                                                                                        |
| `npm run test:e2e:dev` | Отладка: `tests/_harness/config/wdio.e2e.dev.conf.ts`, `baseUrl` `http://<офисный-IP>:4200` (IP — `getMyOfficeIp()` в `tests/_harness/config/getMyOfficeIp.ts`), `specFileRetries: 0`. |

Точечный прогон: весь файл или **один сценарий** — в аргументе `--spec` после `:` указывается **номер строки в файле, где стоит ключевое слово `Scenario:` или `Scenario Outline:`** (не строка с названием сценария в той же фразе, не шаг из Background).

```bash
npm run test:e2e:dev -- --spec tests/e2e/dataManagement/documentCreateChild.feature:14
```

**Проверка связки WDIO+Cucumber:** убедись, что `путь.feature:N` у тебя реально режет прогон до одного сценария (в логе видно ожидаемые шаги). Если полный файл падает, а с `:N` быстро PASSED и без нужных шагов — номер неверен или раннер ведёт себя иначе, чем ожидаешь.

Дополнительно — стандартные опции WDIO/Cucumber (теги через `--cucumberOpts.tags=` и т.д.).

## Артефакты при падении

- Скриншоты ошибок: `tests/_screens/.tmp/errors/` (имя файла часто содержит текст шага).
- Временные сравнения визуального сервиса: `tests/_screens/.tmp/` (частично очищается скриптами `test:e2e*`).
- В логе прогона ищи строку **`Test organization index: N`** — от неё зависят логины (см. ниже).

## Тестовые пользователи (логин / пароль)

Пароли тестовые, не прод. Логин для всех, кроме **Администратор системы**, формируется в коде как  
`{email из testUsers}{testOrganizationIndex}`  
(склеивание без `@` между email и цифрой: к базовому email дописывается индекс).

В пуле e2e индексы организаций **начинаются с 1** (`onPrepare` в `wdio.e2e.conf.ts`). Ниже — **типичный случай `testOrganizationIndex === 1`**. Если в логе **`Test organization index: N`** с другим **N**, замени суффикс логина на это число (например, при `2` → `hermione@admin2`, `harry@owner.ru2`).

| Имя в сценариях (ключ)           | Логин (index **1**)   | Пароль            |
| -------------------------------- | --------------------- | ----------------- |
| Администратор системы            | `testcrguser@mail.ru` | `BigTestPass6834` |
| Администратор организации        | `hermione@admin1`     | `Avadakedavra1`   |
| Гарри                            | `harry@owner.ru1`     | `Avadakedavra2`   |
| Драко                            | `draco@contributor1`  | `Avadakedavra3`   |
| Рональд                          | `ron@viewer1`         | `Avadakedavra4`   |
| Джинни                           | `ginny@user1`         | `Avadakedavra5`   |
| Деактивированный пользователь    | `fred@dead1`          | `Avadakedavra6`   |
| Администратор другой организации | `dark_lord@other1`    | `Avadakedavra666` |
| Питер                            | `scabbers@other1`     | `Avadakedavra0`   |

Авторизация в harness часто идёт через `authenticate` / `authenticateAs` (`tests/_harness/commands/auth/authenticate.ts`) и `authService` в браузере.

## Порядок отладки

1. **Playwright MCP** (если сервер подключён в чате): падающий `.feature` → логин/пароль из таблицы ниже, суффикс `N` из `Test organization index: N` в логе прогона → `http://localhost:4200` → пройти в UI шаги сценария (роль из Given, затем When/And по смыслу) до места ошибки → `browser_snapshot` или скрин → правки `steps`/blocks при необходимости.
2. Воспроизвести прогон: `npm run test:e2e:dev` с `--spec путь.feature` или `--spec путь.feature:номер_строки` (**номер** — строка с `Scenario:` / `Scenario Outline:`, см. выше); зафиксировать **последний зелёный шаг** перед падением.
3. По тексту шага искать реализацию в `tests/_harness/**/*.steps.ts` и блоки; смотреть `tests/_screens/.tmp/errors/`, при необходимости baseline в `tests/_screens/desktop_chrome/`.

**Идентификатор сервера MCP:** в `portal-ui/.cursor/mcp.json` ключ `playwright`, но в вызове инструментов может требоваться **другой** `serverIdentifier` — смотри `SERVER_METADATA.json` в `~/.cursor/projects/<workspace>/mcps/…` (пример: `project-0-portal-ui-playwright`).

## Не смешивать

- **Playwright MCP** в Cursor — для интерактива агента. **Отдельного Playwright test suite в проекте нет:** e2e только через **npm run test:e2e\*** (WebdriverIO + Cucumber), не через `npx playwright test`.
