#!/usr/bin/env bash

# Оркестратор для публикации релиза
# Последовательно выполняет синхронизацию с GitHub и публикацию Docker образов
# Usage: publish-release.sh [branch_name]

set -euo pipefail

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Определяем пути
SCRIPT_PATH="${BASH_SOURCE[0]:-$0}"
if command -v readlink >/dev/null 2>&1 && readlink -f "$SCRIPT_PATH" >/dev/null 2>&1; then
    SCRIPT_DIR=$(dirname "$(readlink -f "$SCRIPT_PATH")")
elif [[ "$SCRIPT_PATH" = /* ]]; then
    SCRIPT_DIR=$(cd "$(dirname "$SCRIPT_PATH")" 2>/dev/null && pwd || dirname "$SCRIPT_PATH")
else
    SCRIPT_DIR=$(cd "$(dirname "$SCRIPT_PATH")" 2>/dev/null && pwd || echo "$(pwd)/$(dirname "$SCRIPT_PATH")")
fi

PROJECT_ROOT="$SCRIPT_DIR/.."
PROJECT_ROOT=$(cd "$PROJECT_ROOT" 2>/dev/null && pwd || echo "$PROJECT_ROOT")

# Параметры
BRANCH_NAME="${1:-}"

echo ""
echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}   ${BOLD}Публикация релиза${NC}                    ${CYAN}║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
echo ""

if [ -n "$BRANCH_NAME" ]; then
    echo -e "  ${BLUE}Ветка:${NC}              ${BOLD}$BRANCH_NAME${NC}"
fi
echo ""

# Проверяем наличие необходимых скриптов
PUSH_GITHUB_SCRIPT="$SCRIPT_DIR/push-to-github.sh"
PUSH_DOCKER_SCRIPT="$SCRIPT_DIR/push-app-docker-hub.sh"

REQUIRED_SCRIPTS=(
    "$PUSH_GITHUB_SCRIPT"
    "$PUSH_DOCKER_SCRIPT"
)

for script in "${REQUIRED_SCRIPTS[@]}"; do
    if [ ! -f "$script" ]; then
        echo -e "${RED}Ошибка:${NC} скрипт $script не найден" >&2
        exit 1
    fi
    if [ ! -x "$script" ]; then
        chmod +x "$script"
    fi
done

# Переходим в корень проекта
cd "$PROJECT_ROOT" || exit 1

# Шаг 1: Синхронизация с GitHub
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${BOLD}Шаг 1/2:${NC} ${BLUE}Синхронизация с GitHub${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ -n "$BRANCH_NAME" ]; then
    if ! bash "$PUSH_GITHUB_SCRIPT" "$BRANCH_NAME"; then
        echo -e "${RED}Ошибка${NC} при синхронизации с GitHub" >&2
        exit 1
    fi
else
    if ! bash "$PUSH_GITHUB_SCRIPT"; then
        echo -e "${RED}Ошибка${NC} при синхронизации с GitHub" >&2
        exit 1
    fi
fi

echo ""

# Шаг 2: Публикация Docker образов
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${BOLD}Шаг 2/2:${NC} ${BLUE}Публикация Docker образов${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if ! bash "$PUSH_DOCKER_SCRIPT"; then
    echo -e "${RED}Ошибка${NC} при публикации Docker образов" >&2
    exit 1
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}      ${GREEN}✓${NC} ${BOLD}${GREEN}Публикация завершена!${NC}         ${GREEN}║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

