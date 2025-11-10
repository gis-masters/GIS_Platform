#!/usr/bin/env bash

# Оркестратор для автоматического создания релиза
# Последовательно выполняет все необходимые скрипты
# Usage: release-orchestrator.sh [base_branch] [release_branch_name]

set -euo pipefail

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

PROJECT_ROOT="$SCRIPT_DIR/../.."
PROJECT_ROOT=$(cd "$PROJECT_ROOT" 2>/dev/null && pwd || echo "$PROJECT_ROOT")
CHANGELOG_FILE="$PROJECT_ROOT/CHANGELOG.md"

# Параметры
BASE_BRANCH="${1:-master}"
RELEASE_BRANCH_NAME="${2:-}"

# Генерируем имя ветки если не указано
if [ -z "$RELEASE_BRANCH_NAME" ]; then
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    RELEASE_BRANCH_NAME="release/changelog-${TIMESTAMP}"
fi

echo ""
echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}   ${BOLD}Автоматическое создание релиза${NC}       ${CYAN}║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BLUE}Базовая ветка:${NC}    ${BASE_BRANCH}"
echo -e "  ${BLUE}Релизная ветка:${NC}   ${RELEASE_BRANCH_NAME}"
echo ""

# Проверяем наличие необходимых скриптов
# Делаем пути абсолютными для надежности
EXTRACT_SCRIPT=$(cd "$SCRIPT_DIR" && pwd)/extract-pr-numbers.sh
FETCH_NOTES_SCRIPT=$(cd "$SCRIPT_DIR" && pwd)/fetch-notes-and-fill-changelog.sh
CREATE_BRANCH_SCRIPT=$(cd "$SCRIPT_DIR" && pwd)/create-branch-api.sh
UPDATE_CHANGELOG_SCRIPT=$(cd "$SCRIPT_DIR" && pwd)/update-changelog-api.sh
CREATE_PR_SCRIPT=$(cd "$SCRIPT_DIR" && pwd)/create-pr-api.sh

REQUIRED_SCRIPTS=(
    "$EXTRACT_SCRIPT"
    "$FETCH_NOTES_SCRIPT"
    "$CREATE_BRANCH_SCRIPT"
    "$UPDATE_CHANGELOG_SCRIPT"
    "$CREATE_PR_SCRIPT"
)

for script in "${REQUIRED_SCRIPTS[@]}"; do
    if [ ! -f "$script" ]; then
        echo "Ошибка: скрипт $script не найден" >&2
        exit 1
    fi
    if [ ! -x "$script" ]; then
        chmod +x "$script"
    fi
done

# Переходим в корень проекта
cd "$PROJECT_ROOT" || exit 1

# Проверяем, что мы в git репозитории
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Ошибка: текущая директория не является git репозиторием" >&2
    exit 1
fi

# Шаг 1: Извлекаем номера PR из коммитов
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${BOLD}Шаг 1/5:${NC} ${BLUE}Извлечение номеров PR${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Передаем PROJECT_ROOT в дочерние скрипты
export PROJECT_ROOT_ABS="$PROJECT_ROOT"

if ! bash "$EXTRACT_SCRIPT"; then
    echo -e "${RED}Ошибка:${NC} не удалось выполнить $EXTRACT_SCRIPT" >&2
    echo "Полный путь: $(realpath "$EXTRACT_SCRIPT" 2>/dev/null || echo "$EXTRACT_SCRIPT")" >&2
    [ -f "$EXTRACT_SCRIPT" ] && echo "Файл существует" >&2 || echo "Файл НЕ существует" >&2
    exit 1
fi

echo ""

# Шаг 2: Получаем release notes и заполняем CHANGELOG.md
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${BOLD}Шаг 2/5:${NC} ${BLUE}Заполнение CHANGELOG.md${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Проверяем наличие файла с номерами PR
PR_NUMBERS_FILE="$SCRIPT_DIR/pr_numbers.txt"
if [ ! -f "$PR_NUMBERS_FILE" ]; then
    echo -e "${YELLOW}Предупреждение:${NC} файл $PR_NUMBERS_FILE не найден, создаем пустой" >&2
    touch "$PR_NUMBERS_FILE"
fi

if ! bash "$FETCH_NOTES_SCRIPT" "$PR_NUMBERS_FILE"; then
    echo -e "${RED}Ошибка${NC} при заполнении CHANGELOG.md" >&2
    exit 1
fi

# Проверяем, что CHANGELOG.md был обновлен
if [ ! -f "$CHANGELOG_FILE" ]; then
    echo -e "${RED}Ошибка:${NC} файл CHANGELOG.md не найден после обновления" >&2
    exit 1
fi

echo ""

# Шаг 3: Создаем ветку через API
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${BOLD}Шаг 3/5:${NC} ${BLUE}Создание ветки${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if ! bash "$CREATE_BRANCH_SCRIPT" "$RELEASE_BRANCH_NAME" "$BASE_BRANCH"; then
    echo -e "${RED}Ошибка${NC} при создании ветки" >&2
    exit 1
fi

echo ""

# Шаг 4: Обновляем CHANGELOG.md в новой ветке через API
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${BOLD}Шаг 4/5:${NC} ${BLUE}Обновление CHANGELOG.md в ветке${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if ! bash "$UPDATE_CHANGELOG_SCRIPT" "$RELEASE_BRANCH_NAME" "$CHANGELOG_FILE"; then
    echo -e "${RED}Ошибка${NC} при обновлении CHANGELOG.md в ветке" >&2
    exit 1
fi

echo ""

# Шаг 5: Создаем Pull Request через API
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${BOLD}Шаг 5/5:${NC} ${BLUE}Создание Pull Request${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if ! bash "$CREATE_PR_SCRIPT" "$RELEASE_BRANCH_NAME" "$BASE_BRANCH"; then
    echo -e "${RED}Ошибка${NC} при создании Pull Request" >&2
    exit 1
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}      ${GREEN}✓${NC} ${BOLD}${GREEN}Релиз успешно создан!${NC}       ${GREEN}║${NC}"
echo -e "${GREEN}╚════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BLUE}Релизная ветка:${NC}   ${BOLD}$RELEASE_BRANCH_NAME${NC}"
echo -e "  ${BLUE}Базовая ветка:${NC}    ${BOLD}$BASE_BRANCH${NC}"
echo ""

