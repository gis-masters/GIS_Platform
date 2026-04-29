---
name: e2e-mcp
description: >-
  Отладка e2e portal-ui через Playwright MCP: пройти в браузере шаги .feature,
  логины, harness, артефакты. Запуск WDIO — навык e2e-run. Подключать только по
  явному запросу пользователя (например e2e-mcp, @e2e-mcp, «по навыку e2e-mcp»).
---

# Отладка e2e через браузер (portal-ui)

Этот навык про **интерактив в браузере** (Playwright MCP): агент повторяет действия из сценария и видит DOM/скрины. **Запуск тестов** (`npm run test:e2e*`, `--spec`, предусловия) — в [e2e-run](../e2e-run/SKILL.md).

## Стек и расположение

- **Раннер:** WebdriverIO 9 + Cucumber, спеки: `tests/e2e/**/*.feature`.
- **Harness:** шаги, страницы, блоки — `tests/_harness/` (в т.ч. `commonSteps`, `blocks`, `pages`, `commands`).
- **Канон логинов/паролей:** `tests/_harness/commands/auth/testUsers.ts` — при расхождении с таблицей ниже править навык **и** код.

## Артефакты при падении прогона

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

1. **Playwright MCP** (если сервер подключён в чате): открыть падающий `.feature` → логин/пароль из таблицы, суффикс `N` из **`Test organization index: N`** в логе прогона → `http://localhost:4200` → пройти в UI шаги (роль из Given, затем When/And) до места ошибки → `browser_snapshot` или скрин → при необходимости правки `steps`/blocks.
2. Воспроизвести прогон WDIO — команды и `--spec` см. [e2e-run](../e2e-run/SKILL.md); зафиксировать **последний зелёный шаг** перед падением.
3. По тексту шага искать реализацию в `tests/_harness/**/*.steps.ts` и блоки; смотреть `tests/_screens/.tmp/errors/`, при необходимости baseline в `tests/_screens/desktop_chrome/`.

**Идентификатор сервера MCP:** в `portal-ui/.cursor/mcp.json` ключ `playwright`, но в вызове инструментов может требоваться **другой** `serverIdentifier` — смотри `SERVER_METADATA.json` в `~/.cursor/projects/<workspace>/mcps/…` (пример: `project-0-portal-ui-playwright`).

## Не смешивать

- **Playwright MCP** в Cursor — для интерактива агента в браузере. **Отдельного Playwright test suite в проекте нет:** e2e только через **WebdriverIO + Cucumber** ([e2e-run](../e2e-run/SKILL.md)), не через `npx playwright test`.
