#!/usr/bin/env bash

# Определяем пути
SCRIPT_DIR="$(dirname "${BASH_SOURCE[0]}")"
PR_NUMBERS_FILE="${SCRIPT_DIR}/pr_numbers.txt"

# Определяем путь к CHANGELOG.md относительно корня проекта
# Сначала пробуем относительно текущей директории, потом относительно директории скрипта
if [ -f "CHANGELOG.md" ]; then
    CHANGELOG_FILE="CHANGELOG.md"
elif [ -f "../../CHANGELOG.md" ]; then
    CHANGELOG_FILE="../../CHANGELOG.md"
else
    # Пробуем найти через PROJECT_ROOT если задан
    if [ -n "${PROJECT_ROOT_ABS:-}" ]; then
        CHANGELOG_FILE="${PROJECT_ROOT_ABS}/CHANGELOG.md"
    else
        # Вычисляем PROJECT_ROOT из директории скрипта
        PROJECT_ROOT_TMP=$(cd "$SCRIPT_DIR/../.." 2>/dev/null && pwd)
        CHANGELOG_FILE="${PROJECT_ROOT_TMP}/CHANGELOG.md"
    fi
fi

# Очищаем файл с номерами PR в начале, чтобы гарантировать отсутствие старых данных
> "$PR_NUMBERS_FILE"

# Если параметры не указаны, берем из CHANGELOG.md и текущего HEAD
if [ $# -eq 0 ]; then
    echo "Режим: Автоматический (из CHANGELOG.md и HEAD)" >&2
    # Извлекаем последний хеш из CHANGELOG.md (первая строка с ###### _[hex]_)
    if [ -f "$CHANGELOG_FILE" ]; then
        [ -n "${DEBUG:-}" ] && echo "Читаем CHANGELOG.md: $CHANGELOG_FILE" >&2
        
        # Ищем строку с паттерном ###### _[hex]_ - пробуем разные варианты
        # Вариант 1: ###### _[hex]_
        FROM_HASH=$(grep -E "######\s+_\[[a-f0-9]+\]_" "$CHANGELOG_FILE" 2>/dev/null | head -1 | sed -E 's/.*\[([a-f0-9]+)\].*/\1/')
        
        # Если не нашли, пробуем более гибкий паттерн
        if [ -z "$FROM_HASH" ]; then
            FROM_HASH=$(grep -E "######.*\[[a-f0-9]+\]" "$CHANGELOG_FILE" 2>/dev/null | head -1 | sed -E 's/.*\[([a-f0-9]+)\].*/\1/')
        fi
        
        # Если все еще не нашли, пробуем самый простой вариант
        if [ -z "$FROM_HASH" ]; then
            FROM_HASH=$(grep -oE "\[[a-f0-9]{8,}\]" "$CHANGELOG_FILE" 2>/dev/null | head -1 | sed -E 's/\[([a-f0-9]+)\]/\1/')
        fi
        
        [ -n "${DEBUG:-}" ] && echo "Найденный хеш: $FROM_HASH" >&2
        [ -n "${DEBUG:-}" ] && echo "Содержимое CHANGELOG.md (первые 20 строк):" >&2
        [ -n "${DEBUG:-}" ] && head -20 "$CHANGELOG_FILE" >&2
    else
        echo "Предупреждение: файл $CHANGELOG_FILE не найден" >&2
    fi
    
    # Если хеш не найден в CHANGELOG.md, пытаемся найти последний коммит с изменением CHANGELOG.md
    if [ -z "$FROM_HASH" ]; then
        echo "Предупреждение: не удалось извлечь хеш из CHANGELOG.md, ищем последний коммит с изменением CHANGELOG.md..." >&2
        FROM_HASH=$(git log --format="%H" --follow -- "$CHANGELOG_FILE" 2>/dev/null | head -1)
        if [ -n "$FROM_HASH" ]; then
            FROM_HASH=$(git rev-parse --short=8 "$FROM_HASH" 2>/dev/null || echo "$FROM_HASH")
            echo "Используем хеш последнего коммита с CHANGELOG.md: $FROM_HASH" >&2
        fi
    fi
    
    if [ -z "$FROM_HASH" ]; then
        echo "Ошибка: не удалось определить начальный хеш коммита" >&2
        echo "Убедитесь, что в CHANGELOG.md есть запись с хешем в формате: ###### _[hex]_" >&2
        echo "Или что в репозитории есть коммиты с изменениями CHANGELOG.md" >&2
        exit 1
    fi
    
    # Расширяем короткий хеш до полного, если нужно
    FROM_HASH_FULL=$(git rev-parse "$FROM_HASH" 2>/dev/null)
    if [ -z "$FROM_HASH_FULL" ]; then
        echo "Ошибка: коммит $FROM_HASH не найден в репозитории" >&2
        exit 1
    fi
    FROM_HASH="$FROM_HASH_FULL"
    
    # Текущий HEAD
    TO_HASH=$(git rev-parse HEAD)
    
    echo "  FROM (из CHANGELOG.md): $FROM_HASH" >&2
    echo "  TO (текущий HEAD): $TO_HASH" >&2
    echo "" >&2
elif [ $# -eq 2 ]; then
    # Ручной режим с параметрами (для отладки)
    echo "Режим: Отладка (хеши переданы вручную)" >&2
    FROM_HASH=$1
    TO_HASH=$2
    
    # Валидация хешей
    FROM_HASH_FULL=$(git rev-parse "$FROM_HASH" 2>/dev/null)
    if [ -z "$FROM_HASH_FULL" ]; then
        echo "Ошибка: коммит $FROM_HASH не найден в репозитории" >&2
        exit 1
    fi
    FROM_HASH="$FROM_HASH_FULL"
    
    TO_HASH_FULL=$(git rev-parse "$TO_HASH" 2>/dev/null)
    if [ -z "$TO_HASH_FULL" ]; then
        echo "Ошибка: коммит $TO_HASH не найден в репозитории" >&2
        exit 1
    fi
    TO_HASH="$TO_HASH_FULL"
    
    echo "  FROM: $FROM_HASH" >&2
    echo "  TO: $TO_HASH" >&2
    echo "" >&2
else
    echo "Usage: $0 [from_commit_hash] [to_commit_hash]" >&2
    echo "" >&2
    echo "  Если параметры не указаны (автоматический режим):" >&2
    echo "    from_commit_hash - автоматически извлекается из CHANGELOG.md (последняя дата)" >&2
    echo "    to_commit_hash   - автоматически берется текущий HEAD" >&2
    echo "" >&2
    echo "  Если переданы 2 параметра (режим отладки):" >&2
    echo "    from_commit_hash - хеш начального коммита (может быть коротким)" >&2
    echo "    to_commit_hash   - хеш конечного коммита (может быть коротким)" >&2
    echo "" >&2
    echo "Примеры:" >&2
    echo "  $0                                    # автоматический режим" >&2
    echo "  $0 e9d33983 HEAD                      # отладка с коротким хешем" >&2
    echo "  $0 e9d339834df085ef HEAD              # отладка с полным хешем" >&2
    exit 1
fi

echo "Collecting git log from $FROM_HASH to $TO_HASH..."
# Сохраняем git log в переменную и логируем его
GIT_LOG=$(git log --oneline "${FROM_HASH}..${TO_HASH}")

# Печатаем лог для наглядности (можно отключить, если нужно только логфайл)
echo "===== GIT LOG ====="
echo "$GIT_LOG"
echo "==================="

# Извлекаем номера пул-реквестов из лога
# Поддерживаем форматы: "Merged PR 1000", "Объединенный запрос на вытягивание 996", "#1234"
# Сохраняем порядок появления в логе, удаляя дубликаты
PR_NUMBERS=$(echo "$GIT_LOG" | grep -oE '(PR\s+[0-9]+|запрос на вытягивание\s+[0-9]+|#[0-9]+)' | grep -oE '[0-9]+' | awk '!seen[$0]++')

# Записываем найденные номера PR в файл
if [ -n "$PR_NUMBERS" ]; then
    echo "$PR_NUMBERS" > "$PR_NUMBERS_FILE"
    if [ $? -eq 0 ]; then
        echo "" >&2
        echo "✓ Номера PR записаны в файл: $PR_NUMBERS_FILE" >&2
        echo "Содержимое файла:" >&2
        cat "$PR_NUMBERS_FILE" >&2
    else
        echo "Ошибка: не удалось записать номера PR в файл $PR_NUMBERS_FILE" >&2
        exit 1
    fi
else
    echo "" >&2
    echo "Предупреждение: номера пул-реквестов не найдены в диапазоне коммитов ${FROM_HASH:0:8}..${TO_HASH:0:8}" >&2
    # Создаем пустой файл, чтобы fetch-release-notes.sh знал, что файл существует
    touch "$PR_NUMBERS_FILE"
fi
