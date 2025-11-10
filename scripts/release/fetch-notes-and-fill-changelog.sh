#!/usr/bin/env bash

# Определяем пути
# Если PROJECT_ROOT передан через переменную окружения (при запуске из временной директории), используем его
if [ -n "${PROJECT_ROOT_ABS:-}" ]; then
    PROJECT_ROOT="$PROJECT_ROOT_ABS"
    # Для .env используем временную директорию если скрипт запущен оттуда
    if [ -f "$(dirname "${BASH_SOURCE[0]}")/.env" ]; then
        ENV_FILE="$(dirname "${BASH_SOURCE[0]}")/.env"
    else
        SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
        ENV_FILE="$SCRIPT_DIR/.env"
    fi
else
    SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
    PROJECT_ROOT=$(cd "$SCRIPT_DIR/../.." && pwd)
    ENV_FILE="$SCRIPT_DIR/.env"
fi
CHANGELOG_FILE="$PROJECT_ROOT/CHANGELOG.md"
# PR_NUMBERS_FILE должен быть в директории скриптов (scripts/tmp/ если скрипт запущен оттуда)
if [ -n "${PROJECT_ROOT_ABS:-}" ]; then
    SCRIPT_DIR_ABS="$(dirname "${BASH_SOURCE[0]}")"
    PR_NUMBERS_FILE="${1:-${SCRIPT_DIR_ABS}/pr_numbers.txt}"
else
    PR_NUMBERS_FILE="${1:-$SCRIPT_DIR/pr_numbers.txt}"
fi

# Загружаем переменные из .env файла
if [ -f "$ENV_FILE" ]; then
    # Читаем AZURE_PAT из .env файла
    export $(grep -v '^#' "$ENV_FILE" | grep 'AZURE_PAT' | xargs)
else
    echo "Ошибка: Файл $ENV_FILE не найден." >&2
    echo "Создайте файл .env в директории $SCRIPT_DIR со следующим содержимым:" >&2
    echo "  AZURE_PAT=your_token_here" >&2
    exit 1
fi

if [ -z "$AZURE_PAT" ]; then
    echo "Ошибка: Переменная AZURE_PAT не найдена в файле $ENV_FILE" >&2
    exit 1
fi

# Azure DevOps настройки
AZURE_DEVOPS_URL="https://azure2022eng.geoplan.local/DefaultCollection"
PROJECT_NAME="GIS_Platform"
REPO_NAME="GIS_Platform"

# Проверяем наличие файла с номерами PR
if [ ! -f "$PR_NUMBERS_FILE" ]; then
    echo "Ошибка: Файл $PR_NUMBERS_FILE не найден." >&2
    exit 1
fi

# Функция для получения описания PR
get_pr_description() {
    local pr_id=$1
    local api_url="${AZURE_DEVOPS_URL}/${PROJECT_NAME}/_apis/git/repositories/${REPO_NAME}/pullrequests/${pr_id}?api-version=7.0"
    
    local response=$(curl -s -u ":$AZURE_PAT" \
        -H "Content-Type: application/json" \
        "$api_url")
    
    if [ $? -eq 0 ] && [ -n "$response" ]; then
        # Проверяем, есть ли ошибка в ответе
        local error=$(echo "$response" | grep -o '"message":"[^"]*"' | head -1)
        if [ -z "$error" ]; then
            # Извлекаем описание PR (поле description)
            echo "$response" | jq -r '.description // ""' 2>/dev/null || echo ""
            return 0
        else
            echo "WARNING: PR #${pr_id} не найден: $error"
            return 1
        fi
    else
        echo "WARNING: Ошибка при запросе PR #${pr_id}"
        return 1
    fi
}

# Функция для извлечения Release note из описания PR
extract_release_note() {
    local description=$1
    # Ищем паттерн "Release note: [текст]" и извлекаем содержимое в квадратных скобках
    # Сначала пробуем grep с Perl regex (если доступен)
    local result=$(echo "$description" | grep -oP 'Release note:\s*\[\K[^\]]*(?=\])' 2>/dev/null)
    if [ -n "$result" ]; then
        echo "$result"
        return 0
    fi
    # Если не сработало, используем sed (универсальный вариант)
    result=$(echo "$description" | sed -n 's/.*Release note:[[:space:]]*\[\([^]]*\)\].*/\1/p' 2>/dev/null)
    if [ -n "$result" ]; then
        echo "$result"
        return 0
    fi
    # Если все еще не найдено, пробуем более простой вариант
    echo "$description" | grep -o 'Release note:[[:space:]]*\[[^]]*\]' | sed 's/Release note:[[:space:]]*\[\(.*\)\]/\1/' 2>/dev/null || echo ""
}

# Получаем текущую дату и хеш HEAD
CURRENT_DATE=$(date +%Y-%m-%d)
CURRENT_HASH=$(git rev-parse HEAD)

echo "Обработка пул-реквестов..."
echo ""

PR_NUMBERS=$(cat "$PR_NUMBERS_FILE" | grep -v '^$')

# Собираем список release notes во временный файл
NOTES_TEMP=$(mktemp)
NOTES_COUNT=0

if [ -n "$PR_NUMBERS" ]; then
    while IFS= read -r pr_number; do
        if [ -n "$pr_number" ]; then
            pr_description=$(get_pr_description "$pr_number")
            if [ $? -eq 0 ]; then
                release_note=$(extract_release_note "$pr_description")
                if [ -n "$release_note" ]; then
                    echo "- ${release_note}" >> "$NOTES_TEMP"
                    NOTES_COUNT=$((NOTES_COUNT + 1))
                else
                    echo "WARNING: PR #${pr_number} не содержит секцию Release note"
                fi
            fi
        fi
    done <<< "$PR_NUMBERS"
else
    echo "Номера PR не найдены в файле $PR_NUMBERS_FILE."
fi

# Создаем временный файл для нового содержимого CHANGELOG.md
TEMP_FILE=$(mktemp)
NEW_ENTRY_TEMP=$(mktemp)

# Формируем блок с новой записью
{
    echo "## $CURRENT_DATE"
    echo "###### _[$CURRENT_HASH]_"
    if [ -s "$NOTES_TEMP" ]; then
        echo ""
        echo "### Изменения"
        cat "$NOTES_TEMP"
    fi
} > "$NEW_ENTRY_TEMP"

# Читаем существующий CHANGELOG.md и вставляем новую запись после [Unreleased]
if [ -f "$CHANGELOG_FILE" ]; then
    # Используем awk для вставки нового блока после строки [Unreleased]
    awk -v new_entry="$NEW_ENTRY_TEMP" '
        /## \[Unreleased\]/ {
            print $0
            print ""
            while ((getline line < new_entry) > 0) {
                print line
            }
            close(new_entry)
            next
        }
        { print }
    ' "$CHANGELOG_FILE" > "$TEMP_FILE"
    
    # Заменяем оригинальный файл
    mv "$TEMP_FILE" "$CHANGELOG_FILE"
else
    # Если файл не существует, создаем новый
    {
        echo "# Changelog"
        echo ""
        echo "Все значимые изменения в проекте документируются в этом файле."
        echo ""
        echo "Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/)."
        echo ""
        echo "## [Unreleased]"
        echo ""
        cat "$NEW_ENTRY_TEMP"
    } > "$CHANGELOG_FILE"
fi

# Удаляем временные файлы
rm -f "$NEW_ENTRY_TEMP"

# Удаляем временный файл с заметками
rm -f "$NOTES_TEMP"

echo ""
if [ $NOTES_COUNT -gt 0 ]; then
    echo "CHANGELOG.md обновлен. Добавлено $NOTES_COUNT записей."
else
    echo "WARNING: Release notes не найдены. Добавлена только заголовок даты."
fi
