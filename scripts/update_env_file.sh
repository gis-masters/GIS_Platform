#!/bin/bash
# update_env.sh — обновление .env файла из другого .env с исключениями

set -euo pipefail

# Проверка числа аргументов
if [ $# -lt 2 ]; then
    echo "Использование: $0 <первый_файл> <второй_файл> [ключи_исключений ...]"
    echo "Пример: $0 .env .env.example DB_HOST DB_PORT"
    exit 1
fi

first_file="$1"
second_file="$2"
shift 2
exclude_keys=("$@")

# Проверка существования файлов
if [ ! -f "$first_file" ]; then
    echo "Ошибка: файл '$first_file' не найден" >&2
    exit 1
fi
if [ ! -f "$second_file" ]; then
    echo "Ошибка: файл '$second_file' не найден" >&2
    exit 1
fi

# Ассоциативный массив для исключений (bash 4+)
declare -A exclude
for key in "${exclude_keys[@]}"; do
    exclude["$key"]=1
done

# Читаем второй файл и сохраняем пары KEY=VALUE
declare -A new_values
while IFS='=' read -r key value || [ -n "$key" ]; do
    # Убираем пробелы у ключа
    key="$(echo "$key" | xargs)"
    # Пропускаем пустые строки и комментарии
    if [[ -z "$key" || "$key" =~ ^# ]]; then
        continue
    fi
    # Сохраняем значение (всё, что после первого '=')
    new_values["$key"]="$value"
done < "$second_file"

# Собираем новый контент первого файла
output=""
updated_keys=()

# Читаем первый файл построчно
while IFS= read -r line || [ -n "$line" ]; do
    # Если строка содержит '=' и не является комментарием
    if [[ "$line" != "#"* && "$line" == *"="* ]]; then
        # Извлекаем ключ (всё до первого '=')
        key="${line%%=*}"
        key="$(echo "$key" | xargs)"  # убираем пробелы вокруг ключа

        # Если ключ есть во втором файле и не исключён — обновляем
        if [[ -n "${new_values[$key]+set}" && -z "${exclude[$key]-}" ]]; then
            line="$key=${new_values[$key]}"
            updated_keys+=("$key")
            # Удаляем ключ, чтобы не добавить как новый позже
            unset new_values["$key"]
        fi
    fi
    output+="$line"$'\n'
done < "$first_file"

# Добавляем новые переменные (которые были только во втором файле)
for key in "${!new_values[@]}"; do
    # Проверяем, не исключён ли ключ (на всякий случай)
    if [[ -z "${exclude[$key]-}" ]]; then
        output+="$key=${new_values[$key]}"$'\n'
    fi
done

# Записываем результат в первый файл
echo -n "$output" > "$first_file"

echo "✅ Файл '$first_file' обновлён из '$second_file'."
if [ ${#exclude_keys[@]} -gt 0 ]; then
    echo "🔒 Исключённые ключи: ${exclude_keys[*]}"
fi