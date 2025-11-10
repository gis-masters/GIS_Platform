#!/usr/bin/env bash

# Скрипт для проверки корректности Azure DevOps PAT токена
# Usage: check-azure-pat.sh

set -eu pipefail

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Определяем пути - используем простой подход для совместимости с Azure DevOps
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" 2>/dev/null && pwd || dirname "${BASH_SOURCE[0]:-$0}")

# Загружаем переменные из .env файла (только рядом со скриптом)
ENV_FILE="$SCRIPT_DIR/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}Ошибка:${NC} Файл $ENV_FILE не найден." >&2
    echo "Создайте файл .env в директории $SCRIPT_DIR со следующим содержимым:" >&2
    echo "  AZURE_PAT=your_token_here" >&2
    exit 1
fi

set -a
. "$ENV_FILE"
set +a

if [ -z "${AZURE_PAT:-}" ]; then
    echo -e "${RED}Ошибка:${NC} Переменная AZURE_PAT не найдена в файле $ENV_FILE" >&2
    exit 1
fi

# Azure DevOps настройки
AZURE_DEVOPS_URL="https://azure2022eng.geoplan.local/DefaultCollection"
PROJECT_NAME="GIS_Platform"
REPO_NAME="GIS_Platform"

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${BOLD}Проверка токена Azure DevOps${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Делаем тестовый запрос к API для проверки токена
echo "Проверка токена..."
REPO_API_URL="${AZURE_DEVOPS_URL}/${PROJECT_NAME}/_apis/git/repositories/${REPO_NAME}?api-version=7.0"
REPO_RESPONSE=$(curl -s -w "\n%{http_code}" -u ":$AZURE_PAT" -H "Content-Type: application/json" "$REPO_API_URL" 2>/dev/null)

# Извлекаем HTTP код и тело ответа
HTTP_CODE=$(echo "$REPO_RESPONSE" | tail -n 1)
RESPONSE_BODY=$(echo "$REPO_RESPONSE" | sed '$d')

# Проверяем HTTP код
if [ "$HTTP_CODE" != "200" ]; then
    echo -e "${RED}✗${NC} Токен неверный (HTTP $HTTP_CODE)" >&2
    if [ -n "$RESPONSE_BODY" ]; then
        ERROR_MESSAGE=$(echo "$RESPONSE_BODY" | jq -r '.message // .Message // empty' 2>/dev/null || echo "")
        if [ -n "$ERROR_MESSAGE" ] && [ "$ERROR_MESSAGE" != "null" ]; then
            echo "Детали ошибки: $ERROR_MESSAGE" >&2
        fi
    fi
    echo "" >&2
    echo "Проверьте токен в файле $ENV_FILE" >&2
    exit 1
fi

# Проверяем, что ответ содержит данные репозитория (дополнительная проверка)
if [ -z "$RESPONSE_BODY" ]; then
    echo -e "${RED}✗${NC} Пустой ответ от Azure DevOps API" >&2
    exit 1
fi

ERROR_MESSAGE=$(echo "$RESPONSE_BODY" | jq -r '.message // .Message // empty' 2>/dev/null || echo "")
if [ -n "$ERROR_MESSAGE" ] && [ "$ERROR_MESSAGE" != "null" ]; then
    echo -e "${RED}✗${NC} Ошибка API: $ERROR_MESSAGE" >&2
    exit 1
fi

REPOSITORY_ID=$(echo "$RESPONSE_BODY" | jq -r '.id // empty' 2>/dev/null)
if [ -z "$REPOSITORY_ID" ] || [ "$REPOSITORY_ID" = "null" ]; then
    echo -e "${RED}✗${NC} Не удалось получить информацию о репозитории. Токен может быть неверным." >&2
    exit 1
fi

REPOSITORY_NAME=$(echo "$RESPONSE_BODY" | jq -r '.name // empty' 2>/dev/null || echo "$REPO_NAME")

echo -e "${GREEN}✓${NC} Токен корректен"
echo -e "  ${BLUE}Репозиторий:${NC} ${REPOSITORY_NAME}"
echo -e "  ${BLUE}ID:${NC} ${REPOSITORY_ID}"
echo ""
exit 0
