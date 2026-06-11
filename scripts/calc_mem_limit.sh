#!/usr/bin/env bash

# Скрипт: calc_mem_limit.sh
# Назначение: вычисление mem_limit в МБ на основе процента от RAM сервера
# Вывод: целое число (мегабайты)

set -euo pipefail

usage() {
    cat <<EOF
Использование: $0 [--min MIN_MB] [--max MAX_MB] PERCENT

Аргументы:
  PERCENT                  Процент от общей памяти сервера (целое число, 1-100)
  --min MIN_MB             Минимальное значение в мегабайтах (по умолчанию 64)
  --max MAX_MB             Максимальное значение в мегабайтах (по умолчанию без ограничения)
  --help, -h               Показать справку

Примеры:
  $0 75                     # выведет 75% от ОЗУ в МБ, например "6144"
  $0 --min 512 --max 8192 50 # выведет 50% от ОЗУ, но не менее 512 и не более 8192 МБ
EOF
    exit 1
}

# Параметры по умолчанию
MIN_MB=64
MAX_MB=""
PERCENT=""

# Разбор аргументов
while [[ $# -gt 0 ]]; do
    case "$1" in
        --min)
            MIN_MB="$2"
            shift 2
            ;;
        --max)
            MAX_MB="$2"
            shift 2
            ;;
        --help|-h)
            usage
            ;;
        -*)
            echo "Ошибка: неизвестный параметр $1" >&2
            usage
            ;;
        *)
            if [[ -z "$PERCENT" ]]; then
                PERCENT="$1"
                shift
            else
                echo "Ошибка: лишний аргумент $1" >&2
                usage
            fi
            ;;
    esac
done

# Проверка процента
if [[ -z "$PERCENT" ]]; then
    echo "Ошибка: не указан процент" >&2
    usage
fi
if ! [[ "$PERCENT" =~ ^[0-9]+$ ]] || [[ "$PERCENT" -lt 1 ]] || [[ "$PERCENT" -gt 100 ]]; then
    echo "Ошибка: процент должен быть целым числом от 1 до 100" >&2
    exit 1
fi

# Проверка min и max (если заданы)
if ! [[ "$MIN_MB" =~ ^[0-9]+$ ]] || [[ "$MIN_MB" -lt 1 ]]; then
    echo "Ошибка: --min должен быть положительным целым числом" >&2
    exit 1
fi
if [[ -n "$MAX_MB" ]]; then
    if ! [[ "$MAX_MB" =~ ^[0-9]+$ ]] || [[ "$MAX_MB" -lt 1 ]]; then
        echo "Ошибка: --max должен быть положительным целым числом" >&2
        exit 1
    fi
    if [[ "$MAX_MB" -lt "$MIN_MB" ]]; then
        echo "Ошибка: --max ($MAX_MB) не может быть меньше --min ($MIN_MB)" >&2
        exit 1
    fi
fi

# Получение общей памяти сервера в кибибайтах
if [[ -f /proc/meminfo ]]; then
    TOTAL_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')
else
    echo "Ошибка: не удалось определить объём памяти (нет /proc/meminfo)" >&2
    exit 1
fi

if [[ -z "$TOTAL_KB" ]]; then
    echo "Ошибка: не удалось прочитать MemTotal" >&2
    exit 1
fi

# Перевод в мегабайты (1 MiB = 1024 KiB)
TOTAL_MB=$(( TOTAL_KB / 1024 ))

# Вычисление лимита в мегабайтах (целочисленное деление)
LIMIT_MB=$(( TOTAL_MB * PERCENT / 100 ))

# Применение минимального значения
if [[ "$LIMIT_MB" -lt "$MIN_MB" ]]; then
    echo "Предупреждение: вычисленный лимит (${LIMIT_MB} МБ) меньше минимального (${MIN_MB} МБ). Использую минимальный." >&2
    LIMIT_MB=$MIN_MB
fi

# Применение максимального значения, если задано
if [[ -n "$MAX_MB" ]] && [[ "$LIMIT_MB" -gt "$MAX_MB" ]]; then
    echo "Предупреждение: вычисленный лимит (${LIMIT_MB} МБ) превышает максимальный (${MAX_MB} МБ). Использую максимальный." >&2
    LIMIT_MB=$MAX_MB
fi

# Вывод только числа (в мегабайтах)
echo "$LIMIT_MB"