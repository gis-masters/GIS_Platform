#!/usr/bin/env bash

# Скрипт для обновления CHANGELOG.md в указанной ветке через Azure DevOps API
# Usage: update-changelog-api.sh <branch_name> <source_file>

set -euo pipefail

# Определяем пути
SCRIPT_DIR="$(dirname "${BASH_SOURCE[0]}")"

# Параметры
BRANCH_NAME="${1:-}"
SOURCE_FILE="${2:-}"

# Проверяем обязательные параметры
if [ -z "$BRANCH_NAME" ]; then
    echo "Ошибка: не указано имя ветки" >&2
    echo "Usage: $0 <branch_name> <source_file>" >&2
    echo "" >&2
    echo "Примеры:" >&2
    echo "  $0 release/changelog-20251101 /tmp/new-changelog.md" >&2
    exit 1
fi

if [ -z "$SOURCE_FILE" ]; then
    echo "Ошибка: не указан файл с новым содержимым" >&2
    echo "Usage: $0 <branch_name> <source_file>" >&2
    exit 1
fi

if [ ! -f "$SOURCE_FILE" ]; then
    echo "Ошибка: файл $SOURCE_FILE не найден" >&2
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
CHANGELOG_PATH="CHANGELOG.md"

echo "=========================================="
echo "Обновление CHANGELOG.md через Azure DevOps API"
echo "=========================================="
echo "Ветка: ${BRANCH_NAME}"
echo "Файл с новым содержимым: ${SOURCE_FILE}"
echo ""

# Шаг 1: Получаем информацию о репозитории
echo "Шаг 1: Получение информации о репозитории..."

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

echo "✓ ID репозитория: $REPOSITORY_ID"
echo ""

# Шаг 2: Получаем информацию о ветке
echo "Шаг 2: Получение информации о ветке ${BRANCH_NAME}..."

REFS_API_URL="${AZURE_DEVOPS_URL}/${PROJECT_NAME}/_apis/git/repositories/${REPOSITORY_ID}/refs?filter=heads/${BRANCH_NAME}&api-version=7.0"
REFS_RESPONSE=$(curl -s -u ":$AZURE_PAT" -H "Content-Type: application/json" "$REFS_API_URL")

if [ $? -ne 0 ] || [ -z "$REFS_RESPONSE" ]; then
    echo "Ошибка: не удалось получить информацию о ветке ${BRANCH_NAME}" >&2
    exit 1
fi

ERROR_MESSAGE=$(echo "$REFS_RESPONSE" | jq -r '.message // empty' 2>/dev/null)
if [ -n "$ERROR_MESSAGE" ] && [ "$ERROR_MESSAGE" != "null" ]; then
    echo "Ошибка API: $ERROR_MESSAGE" >&2
    exit 1
fi

BRANCH_OBJECT_ID=$(echo "$REFS_RESPONSE" | jq -r '.value[0].objectId // empty' 2>/dev/null)

if [ -z "$BRANCH_OBJECT_ID" ] || [ "$BRANCH_OBJECT_ID" = "null" ]; then
    echo "Ошибка: ветка ${BRANCH_NAME} не найдена" >&2
    exit 1
fi

echo "✓ Хеш коммита ветки: ${BRANCH_OBJECT_ID}"
echo ""

# Шаг 3: Получаем текущий коммит для создания дерева
echo "Шаг 3: Получение информации о текущем коммите..."

COMMIT_API_URL="${AZURE_DEVOPS_URL}/${PROJECT_NAME}/_apis/git/repositories/${REPOSITORY_ID}/commits/${BRANCH_OBJECT_ID}?api-version=7.0"
COMMIT_RESPONSE=$(curl -s -u ":$AZURE_PAT" -H "Content-Type: application/json" "$COMMIT_API_URL")

if [ $? -ne 0 ] || [ -z "$COMMIT_RESPONSE" ]; then
    echo "Ошибка: не удалось получить информацию о коммите" >&2
    exit 1
fi

COMMIT_TREE_ID=$(echo "$COMMIT_RESPONSE" | jq -r '.treeId // empty' 2>/dev/null)
COMMIT_AUTHOR_NAME=$(echo "$COMMIT_RESPONSE" | jq -r '.author.name // "Automated Release"' 2>/dev/null)
COMMIT_AUTHOR_EMAIL=$(echo "$COMMIT_RESPONSE" | jq -r '.author.email // "automated-release@git.local"' 2>/dev/null)

if [ -z "$COMMIT_TREE_ID" ] || [ "$COMMIT_TREE_ID" = "null" ]; then
    echo "Ошибка: не удалось получить tree ID коммита" >&2
    exit 1
fi

echo "✓ Tree ID: ${COMMIT_TREE_ID}"
echo ""

# Шаг 4: Читаем новое содержимое файла
echo "Шаг 4: Подготовка содержимого CHANGELOG.md..."

NEW_CONTENT=$(cat "$SOURCE_FILE")
CONTENT_LENGTH=${#NEW_CONTENT}
echo "✓ Содержимое подготовлено (${CONTENT_LENGTH} символов)"
echo ""

# Шаг 5: Создаем коммит через Push API напрямую (без создания blob и дерева отдельно)
echo "Шаг 5: Создание коммита через Push API..."

COMMIT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
COMMIT_MESSAGE="chore: обновлен CHANGELOG.md для нового релиза"

PUSH_API_URL="${AZURE_DEVOPS_URL}/${PROJECT_NAME}/_apis/git/repositories/${REPOSITORY_ID}/pushes?api-version=7.0"

# Формируем JSON для Push API
# Для rawtext содержимое передается как обычный текст, не base64
PUSH_JSON=$(jq -n \
    --arg refName "refs/heads/$BRANCH_NAME" \
    --arg oldObjectId "$BRANCH_OBJECT_ID" \
    --arg author "$COMMIT_AUTHOR_NAME <$COMMIT_AUTHOR_EMAIL>" \
    --arg date "$COMMIT_DATE" \
    --arg message "$COMMIT_MESSAGE" \
    --arg content "$NEW_CONTENT" \
    '{
        refUpdates: [{
            name: $refName,
            oldObjectId: $oldObjectId
        }],
        commits: [{
            comment: $message,
            changes: [{
                changeType: "edit",
                item: {
                    path: "CHANGELOG.md"
                },
                newContent: {
                    content: $content,
                    contentType: "rawtext"
                }
            }]
        }]
    }')

PUSH_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
    -u ":$AZURE_PAT" \
    -H "Content-Type: application/json" \
    -X POST \
    -d "$PUSH_JSON" \
    "$PUSH_API_URL")

PUSH_HTTP_CODE=$(echo "$PUSH_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
PUSH_BODY=$(echo "$PUSH_RESPONSE" | sed '/HTTP_CODE:/d')

if [ "$PUSH_HTTP_CODE" = "201" ]; then
    NEW_COMMIT_ID=$(echo "$PUSH_BODY" | jq -r '.commits[0].commitId // .refUpdates[0].newObjectId // empty' 2>/dev/null)
    if [ -n "$NEW_COMMIT_ID" ] && [ "$NEW_COMMIT_ID" != "null" ]; then
        echo "✓ Коммит успешно создан: ${NEW_COMMIT_ID}"
        echo ""
        echo "=========================================="
        echo "Готово!"
        echo "=========================================="
        echo "Ветка: $BRANCH_NAME"
        echo "Новый коммит: ${NEW_COMMIT_ID}"
        echo "CHANGELOG.md обновлен"
        echo ""
        exit 0
    fi
fi

echo "Ошибка при создании коммита (HTTP $PUSH_HTTP_CODE)" >&2
echo "Ответ сервера: $PUSH_BODY" >&2

# Пытаемся извлечь понятное сообщение об ошибке
ERROR_MESSAGE=$(echo "$PUSH_BODY" | jq -r '.message // .value[0].customMessage // empty' 2>/dev/null)
if [ -n "$ERROR_MESSAGE" ] && [ "$ERROR_MESSAGE" != "null" ]; then
    echo "Детали ошибки: $ERROR_MESSAGE" >&2
fi

exit 1
