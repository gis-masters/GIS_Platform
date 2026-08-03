#!/usr/bin/env bash

# Не запускайте скрипт руками, используйте только в общем процессе

set -euo pipefail

# Загружаем переменные окружения из .env файла
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/.env" ]; then
    source "$SCRIPT_DIR/.env"
fi

# Параметры для Telegram (читаем из .env файла)
BOT_TOKEN="${BOT_TOKEN:-}"
CHAT_ID="${CHAT_ID:-}"

# Проверяем, что необходимые переменные установлены
if [ -z "$BOT_TOKEN" ] || [ -z "$CHAT_ID" ]; then
    echo "Ошибка: BOT_TOKEN и CHAT_ID должны быть установлены в .env файле"
    exit 1
fi
#THEME_ID_1="8888"
NOTIFICATION=false

##Переменные собраны, основная логика дальше

send_telegram_message() {
    local message="$1"
    message="${message:0:4096}"

   json_payload=$(jq -n \
    --arg chat_id "$CHAT_ID" \
    --arg text "$message" \
    --arg notification "$NOTIFICATION" \
      '{chat_id: $chat_id, text: $text, parse_mode: "Markdown", disable_notification: $notification }')

    curl -s -X POST "https://tg-gateway.programgeoplan.workers.dev/bot$BOT_TOKEN/sendMessage" \
        -H "Content-Type: application/json" \
        -H "X-Auth-Token: $ACCESS_TOKEN" \
        -d "$json_payload" > /dev/null

    
    echo "✅ Сообщение отправлено"
}

make_message() {
    local changelog_file="$SCRIPT_DIR/../../CHANGELOG.md"
    
    if [ ! -f "$changelog_file" ]; then
        echo "Ошибка: файл CHANGELOG.md не найден"
        return 1
    fi
    
    # Находим номера строк с первым и вторым вхождением маски _[...]_
    local first_line=$(grep -n "_\[.*\]_" "$changelog_file" | head -1 | cut -d: -f1)
    local second_line=$(grep -n "_\[.*\]_" "$changelog_file" | head -2 | tail -1 | cut -d: -f1)
    
    if [ -z "$first_line" ] || [ -z "$second_line" ]; then
        echo "Ошибка: не найдены маски _[...]_ в CHANGELOG.md"
        return 1
    fi
    
    # Извлекаем заголовок релиза (строка перед первой маской)
    local release_title_line=$((first_line - 1))
    local release_title=$(sed -n "${release_title_line}p" "$changelog_file" | sed 's/^## //')
    
    # Извлекаем содержимое между первой и второй маской, исключая последнюю строку
    local start_line=$((first_line + 1))
    local end_line=$((second_line - 2))
    
    if [ $start_line -gt $end_line ]; then
        echo "Ошибка: некорректные границы для извлечения сообщения"
        return 1
    fi
    
    # Извлекаем строки изменений и удаляем пустые строки
    local changes=$(sed -n "${start_line},${end_line}p" "$changelog_file" | sed '/^$/d' | grep -v "^### Список изменений")
    
    # Формируем итоговое сообщение
    echo "Опубликован новый релиз картографической платформы https://github.com/gis-masters/GIS\_Platform"
    echo "\`Версия от $release_title\`"
    echo "Список изменений:"
    echo "$changes"
}

# Получаем сообщение из CHANGELOG.md
MESSAGE=$(make_message)
if [ $? -eq 0 ] && [ -n "$MESSAGE" ]; then
    send_telegram_message "$MESSAGE"
else
    echo "Готовиться обновление, скоро мы расскажем про всё подробнее!!! 😏😏😏"
    exit 1
fi
