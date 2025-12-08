#!/usr/bin/env bash

# Скрипт для синхронизации репозитория с GitHub
# Добавляет remote "github" (если его нет) и пушит текущую ветку
# Для ветки master автоматически удаляет конфигурационные файлы gisogd
# Usage: push-to-github.sh [branch_name]

set -euo pipefail

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Настройки
GITHUB_REMOTE_NAME="github"
GITHUB_REPO_URL="git@github.com:gis-masters/GIS_Platform.git"

# Определяем корень проекта
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Переходим в корень проекта
cd "$PROJECT_ROOT" || exit 1

# Проверяем, что мы в git репозитории
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Ошибка:${NC} текущая директория не является git репозиторием" >&2
    exit 1
fi

echo ""
echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}   ${BOLD}Синхронизация с GitHub${NC}               ${CYAN}║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
echo ""

# Определяем ветку для пуша
BRANCH_NAME="${1:-}"
if [ -z "$BRANCH_NAME" ]; then
    # Получаем текущую ветку
    BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "master")
    if [ "$BRANCH_NAME" = "HEAD" ]; then
        echo -e "${YELLOW}Предупреждение:${NC} находимся в detached HEAD, используем master"
        BRANCH_NAME="master"
    fi
fi

echo -e "  ${BLUE}Ветка:${NC}              ${BOLD}$BRANCH_NAME${NC}"
echo -e "  ${BLUE}GitHub remote:${NC}     ${BOLD}$GITHUB_REMOTE_NAME${NC}"
echo -e "  ${BLUE}GitHub URL:${NC}        ${BOLD}$GITHUB_REPO_URL${NC}"
echo ""

# Проверяем наличие remote
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${BOLD}Шаг 1/2:${NC} ${BLUE}Настройка remote${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if git remote | grep -q "^${GITHUB_REMOTE_NAME}$"; then
    echo -e "  ${YELLOW}Remote '${GITHUB_REMOTE_NAME}' уже существует${NC}"
    
    # Проверяем URL
    CURRENT_URL=$(git remote get-url "$GITHUB_REMOTE_NAME" 2>/dev/null || echo "")
    if [ "$CURRENT_URL" != "$GITHUB_REPO_URL" ]; then
        echo -e "  ${YELLOW}Обновляем URL remote...${NC}"
        git remote set-url "$GITHUB_REMOTE_NAME" "$GITHUB_REPO_URL"
        echo -e "  ${GREEN}✓${NC} URL обновлен"
    else
        echo -e "  ${GREEN}✓${NC} URL уже правильный"
    fi
else
    echo -e "  ${BLUE}Добавляем remote '${GITHUB_REMOTE_NAME}'...${NC}"
    git remote add "$GITHUB_REMOTE_NAME" "$GITHUB_REPO_URL"
    echo -e "  ${GREEN}✓${NC} Remote добавлен"
fi

echo ""

# Удаление файлов перед пушем в master
if [ "$BRANCH_NAME" = "master" ]; then
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "  ${BOLD}Шаг 2/3:${NC} ${BLUE}Очистка конфигурационных файлов${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    FILES_TO_REMOVE=(
        "gisogdIntegrationSed.yml"
        "gisogdRfService.yml"
    )
    
    FILES_REMOVED=0
    for file in "${FILES_TO_REMOVE[@]}"; do
        if [ -f "$file" ]; then
            echo -e "  ${BLUE}Удаление файла:${NC} ${BOLD}$file${NC}"
            if git rm "$file" >/dev/null 2>&1; then
                FILES_REMOVED=$((FILES_REMOVED + 1)) || true
            else
                echo -e "  ${YELLOW}Предупреждение:${NC} файл $file не отслеживается git, удаляем напрямую"
                rm -f "$file" || true
                # Добавляем удаление файла в индекс
                git add -A >/dev/null 2>&1 || true
                if git ls-files --deleted --error-unmatch "$file" >/dev/null 2>&1; then
                    FILES_REMOVED=$((FILES_REMOVED + 1)) || true
                fi
            fi
        elif git ls-files --error-unmatch "$file" >/dev/null 2>&1; then
            # Файл отслеживается git, но физически отсутствует
            echo -e "  ${BLUE}Удаление из git:${NC} ${BOLD}$file${NC}"
            if git rm "$file" >/dev/null 2>&1; then
                FILES_REMOVED=$((FILES_REMOVED + 1)) || true
            fi
        else
            echo -e "  ${YELLOW}Файл не найден:${NC} $file (возможно, уже удален)"
        fi
    done
    
    if [ "$FILES_REMOVED" -gt 0 ]; then
        # Проверяем, есть ли изменения для коммита
        if ! git diff --cached --quiet 2>/dev/null; then
            COMMIT_MESSAGE="chore: удаление конфигурационных файлов gisogd"
            echo -e "  ${BLUE}Создание коммита...${NC}"
            if git commit -m "$COMMIT_MESSAGE" >/dev/null 2>&1; then
                echo -e "  ${GREEN}✓${NC} Изменения закоммичены"
            else
                echo -e "  ${YELLOW}Предупреждение:${NC} не удалось создать коммит"
            fi
        else
            echo -e "  ${YELLOW}Нет изменений для коммита${NC}"
        fi
        echo -e "  ${GREEN}✓${NC} Удалено файлов: $FILES_REMOVED"
    else
        echo -e "  ${GREEN}✓${NC} Нет файлов для удаления"
    fi
    
    echo ""
fi

# Пушим в GitHub
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ "$BRANCH_NAME" = "master" ]; then
    echo -e "  ${BOLD}Шаг 3/3:${NC} ${BLUE}Отправка в GitHub${NC}"
else
    echo -e "  ${BOLD}Шаг 2/2:${NC} ${BLUE}Отправка в GitHub${NC}"
fi
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "  ${BLUE}Отправка ветки '${BRANCH_NAME}' в '${GITHUB_REMOTE_NAME}'...${NC}"

# Проверяем, существует ли ветка локально
if ! git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
    echo -e "  ${RED}Ошибка:${NC} локальная ветка '$BRANCH_NAME' не найдена" >&2
    exit 1
fi

# Получаем изменения с GitHub перед пушем
echo -e "  ${BLUE}Получение изменений с GitHub...${NC}"
if ! git fetch "$GITHUB_REMOTE_NAME" "$BRANCH_NAME" 2>&1; then
    echo -e "  ${YELLOW}Предупреждение:${NC} ветка '$BRANCH_NAME' еще не существует на GitHub, создадим новую"
fi

# Проверяем, есть ли удаленная ветка
if git show-ref --verify --quiet "refs/remotes/${GITHUB_REMOTE_NAME}/${BRANCH_NAME}"; then
    echo -e "  ${BLUE}Ветка существует на GitHub, проверяем расхождения...${NC}"
    
    # Проверяем, есть ли локальные коммиты, которых нет на GitHub
    LOCAL_COMMITS=$(git rev-list "${GITHUB_REMOTE_NAME}/${BRANCH_NAME}..${BRANCH_NAME}" 2>/dev/null | wc -l || echo "0")
    REMOTE_COMMITS=$(git rev-list "${BRANCH_NAME}..${GITHUB_REMOTE_NAME}/${BRANCH_NAME}" 2>/dev/null | wc -l || echo "0")
    
    if [ "$REMOTE_COMMITS" -gt 0 ]; then
        echo -e "  ${YELLOW}Обнаружены новые коммиты на GitHub (${REMOTE_COMMITS} коммитов)${NC}"
        echo -e "  ${BLUE}Выполняем merge...${NC}"
        
        # Пытаемся сделать merge
        if git merge "${GITHUB_REMOTE_NAME}/${BRANCH_NAME}" --no-edit 2>&1; then
            echo -e "  ${GREEN}✓${NC} Изменения успешно объединены"
        else
            echo -e "  ${RED}Ошибка:${NC} не удалось автоматически объединить изменения" >&2
            echo -e "  ${YELLOW}Возможные варианты:${NC}" >&2
            echo -e "    1. Разрешите конфликты вручную и выполните:" >&2
            echo -e "       ${BLUE}git merge --continue${NC}" >&2
            echo -e "       ${BLUE}git push ${GITHUB_REMOTE_NAME} ${BRANCH_NAME}${NC}" >&2
            echo -e "    2. Или используйте rebase:" >&2
            echo -e "       ${BLUE}git rebase ${GITHUB_REMOTE_NAME}/${BRANCH_NAME}${NC}" >&2
            echo -e "       ${BLUE}git push ${GITHUB_REMOTE_NAME} ${BRANCH_NAME}${NC}" >&2
            echo -e "    3. Или отмените merge и используйте force push (не рекомендуется):" >&2
            echo -e "       ${BLUE}git merge --abort${NC}" >&2
            echo -e "       ${BLUE}git push ${GITHUB_REMOTE_NAME} ${BRANCH_NAME} --force${NC}" >&2
            exit 1
        fi
    else
        echo -e "  ${GREEN}✓${NC} Локальная ветка актуальна"
    fi
else
    echo -e "  ${GREEN}✓${NC} Ветка не существует на GitHub, будет создана новая"
fi

# Пушим ветку без --force
echo -e "  ${BLUE}Отправка ветки '${BRANCH_NAME}' в '${GITHUB_REMOTE_NAME}'...${NC}"
if git push -u "$GITHUB_REMOTE_NAME" "$BRANCH_NAME" 2>&1; then
    echo -e "  ${GREEN}✓${NC} Ветка успешно отправлена"
else
    EXIT_CODE=$?
    echo -e "  ${RED}Ошибка${NC} при отправке ветки (код: $EXIT_CODE)" >&2
    echo "" >&2
    echo -e "  ${YELLOW}Возможные причины:${NC}" >&2
    echo -e "    - Нет доступа к GitHub репозиторию" >&2
    echo -e "    - SSH ключ не настроен для GitHub" >&2
    echo -e "    - Ветка на GitHub содержит коммиты, которых нет локально" >&2
    echo -e "    - Требуется разрешение конфликтов (см. выше)" >&2
    echo "" >&2
    echo -e "  ${YELLOW}Если уверены, что нужно перезаписать историю:${NC}" >&2
    echo -e "    ${BLUE}git push ${GITHUB_REMOTE_NAME} ${BRANCH_NAME} --force${NC}" >&2
    exit $EXIT_CODE
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}      ${GREEN}✓${NC} ${BOLD}${GREEN}Синхронизация завершена!  ${NC}      ${GREEN}║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BLUE}Ветка:${NC}              ${BOLD}$BRANCH_NAME${NC}"
echo -e "  ${BLUE}Remote:${NC}             ${BOLD}$GITHUB_REMOTE_NAME${NC}"
echo ""
