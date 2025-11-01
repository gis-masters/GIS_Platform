#!/usr/bin/env bash

# Скрипт для создания Pull Request через Azure DevOps REST API
# Usage: create-pr-api.sh <source_branch> [target_branch]

set -euo pipefail

# Определяем пути
SCRIPT_DIR="$(dirname "${BASH_SOURCE[0]}")"

# Параметры
SOURCE_BRANCH="${1:-}"
TARGET_BRANCH="${2:-master}"

# Проверяем обязательный параметр
if [ -z "$SOURCE_BRANCH" ]; then
    echo "Ошибка: не указана исходная ветка" >&2
    echo "Usage: $0 <source_branch> [target_branch]" >&2
    echo "" >&2
    echo "Примеры:" >&2
    echo "  $0 releaseFiz           # создать PR от releaseFiz в master" >&2
    echo "  $0 releaseFiz main      # создать PR от releaseFiz в main" >&2
    exit 1
fi

# Загружаем переменные из .env файла
ENV_FILE="$SCRIPT_DIR/.env"
if [ -f "$ENV_FILE" ]; then
    set -a
    . "$ENV_FILE"
    set +a
fi

if [ -z "${AZURE_PAT:-}" ]; then
    echo "Ошибка: Переменная AZURE_PAT не найдена" >&2
    echo "Создайте файл .env в директории $SCRIPT_DIR со следующим содержимым:" >&2
    echo "  AZURE_PAT=your_token_here" >&2
    exit 1
fi

# Azure DevOps настройки
AZURE_DEVOPS_URL="https://azure2022eng.geoplan.local/DefaultCollection"
PROJECT_NAME="GIS_Platform"
REPO_NAME="GIS_Platform"

echo "==========================================" >&2
echo "Создание Pull Request через Azure DevOps API" >&2
echo "==========================================" >&2
echo "Исходная ветка: ${SOURCE_BRANCH}" >&2
echo "Целевая ветка: ${TARGET_BRANCH}" >&2
echo "" >&2

# Шаг 1: Получаем информацию о репозитории
echo "Шаг 1: Получение информации о репозитории..." >&2

REPO_API_URL="${AZURE_DEVOPS_URL}/${PROJECT_NAME}/_apis/git/repositories/${REPO_NAME}?api-version=7.0"
REPO_RESPONSE=$(curl -s -u ":$AZURE_PAT" -H "Content-Type: application/json" "$REPO_API_URL")

if [ $? -ne 0 ] || [ -z "$REPO_RESPONSE" ]; then
    echo "Ошибка: не удалось получить информацию о репозитории" >&2
    exit 1
fi

ERROR_MESSAGE=$(echo "$REPO_RESPONSE" | jq -r '.message // empty' 2>/dev/null)
if [ -n "$ERROR_MESSAGE" ] && [ "$ERROR_MESSAGE" != "null" ]; then
    echo "Ошибка API: $ERROR_MESSAGE" >&2
    exit 1
fi

REPOSITORY_ID=$(echo "$REPO_RESPONSE" | jq -r '.id // empty' 2>/dev/null)

if [ -z "$REPOSITORY_ID" ] || [ "$REPOSITORY_ID" = "null" ]; then
    echo "Ошибка: не удалось получить ID репозитория" >&2
    exit 1
fi

echo "✓ ID репозитория: $REPOSITORY_ID" >&2
echo "" >&2

# Шаг 2: Проверяем существование веток
echo "Шаг 2: Проверка существования веток..." >&2

# Проверяем исходную ветку
SOURCE_REFS_API_URL="${AZURE_DEVOPS_URL}/${PROJECT_NAME}/_apis/git/repositories/${REPOSITORY_ID}/refs?filter=heads/${SOURCE_BRANCH}&api-version=7.0"
SOURCE_REFS_RESPONSE=$(curl -s -u ":$AZURE_PAT" -H "Content-Type: application/json" "$SOURCE_REFS_API_URL")

SOURCE_BRANCH_OBJECT_ID=$(echo "$SOURCE_REFS_RESPONSE" | jq -r '.value[0].objectId // empty' 2>/dev/null)

if [ -z "$SOURCE_BRANCH_OBJECT_ID" ] || [ "$SOURCE_BRANCH_OBJECT_ID" = "null" ]; then
    echo "Ошибка: ветка ${SOURCE_BRANCH} не найдена" >&2
    exit 1
fi

echo "✓ Исходная ветка ${SOURCE_BRANCH} найдена: ${SOURCE_BRANCH_OBJECT_ID:0:8}..." >&2

# Проверяем целевую ветку
TARGET_REFS_API_URL="${AZURE_DEVOPS_URL}/${PROJECT_NAME}/_apis/git/repositories/${REPOSITORY_ID}/refs?filter=heads/${TARGET_BRANCH}&api-version=7.0"
TARGET_REFS_RESPONSE=$(curl -s -u ":$AZURE_PAT" -H "Content-Type: application/json" "$TARGET_REFS_API_URL")

TARGET_BRANCH_OBJECT_ID=$(echo "$TARGET_REFS_RESPONSE" | jq -r '.value[0].objectId // empty' 2>/dev/null)

if [ -z "$TARGET_BRANCH_OBJECT_ID" ] || [ "$TARGET_BRANCH_OBJECT_ID" = "null" ]; then
    echo "Ошибка: ветка ${TARGET_BRANCH} не найдена" >&2
    exit 1
fi

echo "✓ Целевая ветка ${TARGET_BRANCH} найдена: ${TARGET_BRANCH_OBJECT_ID:0:8}..." >&2
echo "" >&2

# Шаг 3: Формируем заголовок и описание PR
echo "Шаг 3: Формирование заголовка и описания PR..." >&2

CURRENT_DATE=$(date +%Y-%m-%d)
PR_TITLE="chore(release): update changelog $CURRENT_DATE"
PR_DESCRIPTION="Автоматически созданный Pull Request для обновления CHANGELOG.md.

**Изменения:**
- Добавлена новая секция с датой релиза
- Интегрированы release notes из связанных Pull Request
"

echo "✓ Заголовок: $PR_TITLE" >&2
echo "" >&2

# Шаг 4: Создаем Pull Request через Azure DevOps API
echo "Шаг 4: Создание Pull Request..." >&2

CREATE_PR_URL="${AZURE_DEVOPS_URL}/${PROJECT_NAME}/_apis/git/repositories/${REPOSITORY_ID}/pullrequests?api-version=7.0"

PR_JSON=$(jq -n \
    --arg title "$PR_TITLE" \
    --arg description "$PR_DESCRIPTION" \
    --arg sourceRef "refs/heads/$SOURCE_BRANCH" \
    --arg targetRef "refs/heads/$TARGET_BRANCH" \
    '{
        sourceRefName: $sourceRef,
        targetRefName: $targetRef,
        title: $title,
        description: $description
    }')

if [ -z "$PR_JSON" ]; then
    echo "Ошибка: не удалось создать JSON для PR" >&2
    exit 1
fi

RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
    -u ":$AZURE_PAT" \
    -H "Content-Type: application/json" \
    -X POST \
    -d "$PR_JSON" \
    "$CREATE_PR_URL")

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    PR_ID=$(echo "$BODY" | jq -r '.pullRequestId // ""' 2>/dev/null)
    if [ -n "$PR_ID" ] && [ "$PR_ID" != "null" ]; then
        PR_URL=$(echo "$BODY" | jq -r '._links.web.href // ""' 2>/dev/null)
        echo "✓ Pull Request успешно создан!" >&2
        echo "" >&2
        echo "==========================================" >&2
        echo "Готово!" >&2
        echo "==========================================" >&2
        echo "  ID: $PR_ID" >&2
        echo "  Исходная ветка: $SOURCE_BRANCH" >&2
        echo "  Целевая ветка: $TARGET_BRANCH" >&2
        if [ -n "$PR_URL" ] && [ "$PR_URL" != "null" ]; then
            echo "  URL: $PR_URL" >&2
        fi
        echo "" >&2
        exit 0
    else
        echo "Предупреждение: PR создан, но не удалось получить его ID" >&2
        echo "Ответ сервера: $BODY" >&2
        exit 0
    fi
else
    echo "Ошибка при создании Pull Request (HTTP $HTTP_CODE)" >&2
    echo "Ответ сервера: $BODY" >&2
    
    # Пытаемся извлечь понятное сообщение об ошибке
    ERROR_MESSAGE=$(echo "$BODY" | jq -r '.message // .value[0].customMessage // empty' 2>/dev/null)
    if [ -n "$ERROR_MESSAGE" ] && [ "$ERROR_MESSAGE" != "null" ]; then
        echo "Детали ошибки: $ERROR_MESSAGE" >&2
    fi
    
    exit 1
fi
