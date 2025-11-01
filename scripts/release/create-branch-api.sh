#!/usr/bin/env bash

# Скрипт для создания ветки через Azure DevOps REST API
# Usage: create-branch-api.sh [branch_name] [base_branch]

set -euo pipefail

# Определяем пути
SCRIPT_DIR="$(dirname "${BASH_SOURCE[0]}")"

# Параметры
BRANCH_NAME="${1:-releaseFiz}"
BASE_BRANCH="${2:-master}"

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
echo "Создание ветки через Azure DevOps API" >&2
echo "==========================================" >&2
echo "Базовая ветка: ${BASE_BRANCH}" >&2
echo "Новая ветка: ${BRANCH_NAME}" >&2
echo "" >&2

# Шаг 1: Получаем информацию о репозитории
echo "Шаг 1: Получение информации о репозитории..." >&2

REPO_API_URL="${AZURE_DEVOPS_URL}/${PROJECT_NAME}/_apis/git/repositories/${REPO_NAME}?api-version=7.0"
REPO_RESPONSE=$(curl -s -u ":$AZURE_PAT" -H "Content-Type: application/json" "$REPO_API_URL")

if [ $? -ne 0 ] || [ -z "$REPO_RESPONSE" ]; then
    echo "Ошибка: не удалось получить информацию о репозитории" >&2
    exit 1
fi

# Проверяем на ошибки
ERROR_MESSAGE=$(echo "$REPO_RESPONSE" | jq -r '.message // empty' 2>/dev/null)
if [ -n "$ERROR_MESSAGE" ] && [ "$ERROR_MESSAGE" != "null" ]; then
    echo "Ошибка API: $ERROR_MESSAGE" >&2
    exit 1
fi

REPOSITORY_ID=$(echo "$REPO_RESPONSE" | jq -r '.id // empty' 2>/dev/null)

if [ -z "$REPOSITORY_ID" ] || [ "$REPOSITORY_ID" = "null" ]; then
    echo "Ошибка: не удалось получить ID репозитория" >&2
    echo "Ответ сервера: $REPO_RESPONSE" >&2
    exit 1
fi

echo "✓ ID репозитория: $REPOSITORY_ID" >&2
echo "" >&2

# Шаг 2: Получаем информацию о базовой ветке
echo "Шаг 2: Получение информации о базовой ветке ${BASE_BRANCH}..." >&2

REFS_API_URL="${AZURE_DEVOPS_URL}/${PROJECT_NAME}/_apis/git/repositories/${REPOSITORY_ID}/refs?filter=heads/${BASE_BRANCH}&api-version=7.0"
REFS_RESPONSE=$(curl -s -u ":$AZURE_PAT" -H "Content-Type: application/json" "$REFS_API_URL")

if [ $? -ne 0 ] || [ -z "$REFS_RESPONSE" ]; then
    echo "Ошибка: не удалось получить информацию о ветке ${BASE_BRANCH}" >&2
    exit 1
fi

# Проверяем на ошибки
ERROR_MESSAGE=$(echo "$REFS_RESPONSE" | jq -r '.message // empty' 2>/dev/null)
if [ -n "$ERROR_MESSAGE" ] && [ "$ERROR_MESSAGE" != "null" ]; then
    echo "Ошибка API: $ERROR_MESSAGE" >&2
    exit 1
fi

BASE_BRANCH_OBJECT_ID=$(echo "$REFS_RESPONSE" | jq -r '.value[0].objectId // empty' 2>/dev/null)

if [ -z "$BASE_BRANCH_OBJECT_ID" ] || [ "$BASE_BRANCH_OBJECT_ID" = "null" ]; then
    echo "Ошибка: ветка ${BASE_BRANCH} не найдена" >&2
    echo "Ответ сервера: $REFS_RESPONSE" >&2
    exit 1
fi

echo "✓ Хеш коммита базовой ветки: ${BASE_BRANCH_OBJECT_ID:0:8}..." >&2
echo "" >&2

# Шаг 3: Проверяем, существует ли уже ветка с таким именем
echo "Шаг 3: Проверка существования ветки ${BRANCH_NAME}..." >&2

CHECK_BRANCH_API_URL="${AZURE_DEVOPS_URL}/${PROJECT_NAME}/_apis/git/repositories/${REPOSITORY_ID}/refs?filter=heads/${BRANCH_NAME}&api-version=7.0"
CHECK_RESPONSE=$(curl -s -u ":$AZURE_PAT" -H "Content-Type: application/json" "$CHECK_BRANCH_API_URL")

if [ $? -eq 0 ] && [ -n "$CHECK_RESPONSE" ]; then
    EXISTING_BRANCH=$(echo "$CHECK_RESPONSE" | jq -r '.value[0].name // empty' 2>/dev/null)
    if [ -n "$EXISTING_BRANCH" ] && [ "$EXISTING_BRANCH" != "null" ]; then
        echo "Ошибка: ветка ${BRANCH_NAME} уже существует" >&2
        echo "Используйте другое имя ветки или удалите существующую" >&2
        exit 1
    fi
fi

echo "✓ Ветка ${BRANCH_NAME} не существует" >&2
echo "" >&2

# Шаг 4: Создаем новую ветку через API
echo "Шаг 4: Создание ветки ${BRANCH_NAME} через API..." >&2

CREATE_BRANCH_API_URL="${AZURE_DEVOPS_URL}/${PROJECT_NAME}/_apis/git/repositories/${REPOSITORY_ID}/refs?api-version=7.0"

# Формируем JSON для создания ветки
BRANCH_JSON=$(jq -n \
    --arg name "refs/heads/$BRANCH_NAME" \
    --arg oldObjectId "0000000000000000000000000000000000000000" \
    --arg newObjectId "$BASE_BRANCH_OBJECT_ID" \
    '[{
        name: $name,
        oldObjectId: $oldObjectId,
        newObjectId: $newObjectId
    }]')

if [ -z "$BRANCH_JSON" ]; then
    echo "Ошибка: не удалось создать JSON для создания ветки" >&2
    exit 1
fi

CREATE_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
    -u ":$AZURE_PAT" \
    -H "Content-Type: application/json" \
    -X POST \
    -d "$BRANCH_JSON" \
    "$CREATE_BRANCH_API_URL")

HTTP_CODE=$(echo "$CREATE_RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
BODY=$(echo "$CREATE_RESPONSE" | sed '/HTTP_CODE:/d')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    CREATED_BRANCH=$(echo "$BODY" | jq -r '.value[0].name // empty' 2>/dev/null)
    if [ -n "$CREATED_BRANCH" ] && [ "$CREATED_BRANCH" != "null" ]; then
        echo "✓ Ветка успешно создана!" >&2
        echo "" >&2
        echo "==========================================" >&2
        echo "Готово!" >&2
        echo "==========================================" >&2
        echo "Ветка: $BRANCH_NAME" >&2
        echo "Полное имя: $CREATED_BRANCH" >&2
        echo "Базовая ветка: $BASE_BRANCH" >&2
        echo "Хеш коммита: ${BASE_BRANCH_OBJECT_ID:0:8}..." >&2
        echo "" >&2
        exit 0
    else
        echo "Предупреждение: ветка создана, но не удалось получить подтверждение" >&2
        echo "Ответ сервера: $BODY" >&2
        exit 0
    fi
else
    echo "Ошибка при создании ветки (HTTP $HTTP_CODE)" >&2
    echo "Ответ сервера: $BODY" >&2
    
    # Пытаемся извлечь понятное сообщение об ошибке
    ERROR_MESSAGE=$(echo "$BODY" | jq -r '.message // .value[0].customMessage // empty' 2>/dev/null)
    if [ -n "$ERROR_MESSAGE" ] && [ "$ERROR_MESSAGE" != "null" ]; then
        echo "Детали ошибки: $ERROR_MESSAGE" >&2
    fi
    
    exit 1
fi
