#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

. "$SCRIPT_DIR/utils/textUtil"

cd "$PROJECT_ROOT"

DEFAULT_CONTEXT_FILE="pull_request_template/.review-context.md"

BASE_REF_INPUT=""
CONTEXT_FILE_INPUT=""

usage() {
  cat <<EOF
Usage:
  ./scripts/self-review.sh [base-branch]
  ./scripts/self-review.sh --base origin/master --context pull_request_template/.review-context.md

Options:
  -b, --base <ref>      base branch/ref for review
  -c, --context <file>  file with task goal and review context
  -h, --help            show help

Defaults:
  base ref priority: origin/master -> master -> origin/main -> main -> origin/develop -> develop
  context file: $DEFAULT_CONTEXT_FILE (required unless --context is passed explicitly)
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -b|--base)
      if [[ $# -lt 2 ]]; then
        printError "для опции $1 нужен аргумент"
        usage
        exit 1
      fi
      BASE_REF_INPUT="$2"
      shift 2
      ;;
    -c|--context)
      if [[ $# -lt 2 ]]; then
        printError "для опции $1 нужен аргумент"
        usage
        exit 1
      fi
      CONTEXT_FILE_INPUT="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      shift
      break
      ;;
    -*)
      printError "неизвестная опция: $1"
      usage
      exit 1
      ;;
    *)
      if [[ -z "$BASE_REF_INPUT" ]]; then
        BASE_REF_INPUT="$1"
        shift
      else
        printError "лишний позиционный аргумент: $1"
        usage
        exit 1
      fi
      ;;
  esac
done

if ! git rev-parse --git-dir > /dev/null 2>&1; then
  printError "текущая директория не является git-репозиторием"
  exit 1
fi

CURRENT_BRANCH="$(git branch --show-current 2>/dev/null || true)"

if [[ -z "$CURRENT_BRANCH" ]]; then
  printError "режим detached HEAD не поддерживается для self-review"
  exit 1
fi

choose_base_ref() {
  local candidate
  local candidates=()

  if [[ -n "$BASE_REF_INPUT" ]]; then
    candidates+=("$BASE_REF_INPUT")
  fi

  candidates+=(
    "origin/master"
    "master"
    "origin/main"
    "main"
    "origin/develop"
    "develop"
  )

  for candidate in "${candidates[@]}"; do
    if [[ "$candidate" == "$CURRENT_BRANCH" || "$candidate" == "origin/$CURRENT_BRANCH" ]]; then
      continue
    fi

    if git rev-parse --verify "$candidate" > /dev/null 2>&1; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done

  return 1
}

find_context_file() {
  if [[ -n "$CONTEXT_FILE_INPUT" ]]; then
    printf '%s\n' "$CONTEXT_FILE_INPUT"
    return 0
  fi

  if [[ -f "$DEFAULT_CONTEXT_FILE" ]]; then
    printf '%s\n' "$DEFAULT_CONTEXT_FILE"
    return 0
  fi

  return 1
}

path_matches() {
  local pattern="$1"
  local path

  for path in "${CHANGED_FILES[@]}"; do
    if [[ "$path" =~ $pattern ]]; then
      return 0
    fi
  done

  return 1
}

add_focus_item() {
  REVIEW_FOCUS+=("$1")
}

BASE_REF="$(choose_base_ref || true)"

if [[ -z "$BASE_REF" ]]; then
  printError "не удалось определить базовую ветку"
  printInfo "использование: ./scripts/self-review.sh <base-branch>"
  exit 1
fi

if [[ -n "$CONTEXT_FILE_INPUT" && ! -f "$CONTEXT_FILE_INPUT" ]]; then
  printError "не найден файл контекста: $CONTEXT_FILE_INPUT"
  exit 1
fi

MERGE_BASE="$(git merge-base --fork-point "$BASE_REF" HEAD 2>/dev/null || git merge-base HEAD "$BASE_REF")"
BASE_SHA="$(git rev-parse "$BASE_REF")"
HEAD_SHA="$(git rev-parse HEAD)"
UPSTREAM_BRANCH="$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || true)"
WORKTREE_STATUS="$(git status --short)"
CONTEXT_FILE="$(find_context_file || true)"

if [[ -z "$CONTEXT_FILE" ]]; then
  printError "обязательный файл контекста задачи не найден: $DEFAULT_CONTEXT_FILE"
  printInfo "создай $DEFAULT_CONTEXT_FILE в корне репозитория или передай путь через --context"
  exit 1
fi

if [[ "$MERGE_BASE" == "$HEAD_SHA" ]]; then
  printError "относительно $BASE_REF нет коммитов для ревью"
  printInfo "подсказка: передай другую базовую ветку, например ./scripts/self-review.sh origin/master"
  exit 0
fi

read -r COMMIT_COUNT <<< "$(git rev-list --count "${MERGE_BASE}..HEAD")"
mapfile -t CHANGED_FILES < <(git diff --name-only "${MERGE_BASE}..HEAD")
mapfile -t CHANGED_FILE_STATUSES < <(git diff --name-status --find-renames "${MERGE_BASE}..HEAD")

FILES_COUNT="${#CHANGED_FILES[@]}"
DIFF_SHORTSTAT="$(git diff --shortstat "${MERGE_BASE}..HEAD" || true)"
DIFF_SUMMARY="$(git diff --summary --find-renames "${MERGE_BASE}..HEAD" || true)"
DIFF_CHECK_OUTPUT="$(git diff --check "${MERGE_BASE}..HEAD" || true)"

declare -A SEEN_MODULES=()
MODULES=()
for path in "${CHANGED_FILES[@]}"; do
  module="${path%%/*}"
  if [[ -z "${SEEN_MODULES[$module]+x}" ]]; then
    SEEN_MODULES["$module"]=1
    MODULES+=("$module")
  fi
done

REVIEW_FOCUS=()
if path_matches '(^|/)(db/migration|migration-scripts|flyway|liquibase)(/|$)'; then
  add_focus_item "Есть изменения в миграциях или схеме данных."
fi
if path_matches '^(contracts/|clients/)|\.bru$'; then
  add_focus_item "Есть изменения во внешних контрактах, клиентах или API-коллекциях."
fi
if path_matches '(^|/)(application|bootstrap).*\.(ya?ml|properties)$|(^|/).*docker.*|(^|/)scripts/release/|(^|/)coreApplication\.yml$'; then
  add_focus_item "Есть конфигурационные или инфраструктурные изменения."
fi
if path_matches '(^auth-service/)|(^|/)(security|permission|role|acl|oauth|auth)(/|[^/])'; then
  add_focus_item "Есть изменения в безопасности, правах или аутентификации."
fi
if path_matches '(^portal-ui/)|\.(ts|tsx|js|jsx|scss|css|html)$'; then
  add_focus_item "Есть frontend-изменения."
fi
if path_matches '(^tests/)|(/src/test/)|(/test/)|(\.feature$)'; then
  add_focus_item "В diff есть тесты; полезно проверить, покрывают ли они новый сценарий."
else
  add_focus_item "В diff нет тестовых файлов; отдельно проверь, чем подтверждена корректность изменений."
fi

printHeader "SELF REVIEW"
printInfo "текущая ветка:  $CURRENT_BRANCH"
printInfo "базовая ветка:  $BASE_REF"
printInfo "base sha:       $BASE_SHA"
printInfo "merge-base:     $MERGE_BASE"
printInfo "head:           $HEAD_SHA"

printHeader2 "Состояние Ветки"
if [[ -n "$UPSTREAM_BRANCH" ]]; then
  read -r UPSTREAM_ONLY LOCAL_ONLY <<< "$(git rev-list --left-right --count "${UPSTREAM_BRANCH}...HEAD")"
  printf '%s\n' "upstream:       $UPSTREAM_BRANCH"
  if [[ "$UPSTREAM_ONLY" == "0" && "$LOCAL_ONLY" == "0" ]]; then
    printSuccess "локальная ветка совпадает с upstream"
  elif [[ "$UPSTREAM_ONLY" == "0" ]]; then
    printError "локальная ветка содержит $LOCAL_ONLY непушенных коммитов"
  elif [[ "$LOCAL_ONLY" == "0" ]]; then
    printError "локальная ветка отстает от upstream на $UPSTREAM_ONLY коммитов"
  else
    printError "локальная ветка и upstream разошлись: local +$LOCAL_ONLY / upstream +$UPSTREAM_ONLY"
  fi
else
  printInfo "upstream для текущей ветки не настроен"
fi

if [[ -n "$WORKTREE_STATUS" ]]; then
  printError "рабочее дерево грязное: незакоммиченные изменения не входят в diff ${MERGE_BASE}..HEAD"
  printf '%s\n' "$WORKTREE_STATUS"
else
  printSuccess "рабочее дерево чистое"
fi

printHeader2 "Контекст Задачи"
printf '%s\n' "файл контекста: $CONTEXT_FILE"
printf '\n'
sed -n '1,220p' "$CONTEXT_FILE"

printHeader2 "Коммиты В Ревью"
printf '%s\n' "количество коммитов: $COMMIT_COUNT"
git log --oneline --decorate "${MERGE_BASE}..HEAD"

printHeader2 "Изменения В Объеме"
printf '%s\n' "файлов изменено: $FILES_COUNT"
if [[ -n "$DIFF_SHORTSTAT" ]]; then
  printf '%s\n' "$DIFF_SHORTSTAT"
fi
printf '%s\n' "затронутые модули: ${MODULES[*]}"

printHeader2 "Измененные Файлы"
printf '%s\n' "${CHANGED_FILE_STATUSES[@]}"

if [[ -n "$DIFF_SUMMARY" ]]; then
  printHeader2 "Структурные Изменения"
  printf '%s\n' "$DIFF_SUMMARY"
fi

printHeader2 "Фокус Для Review"
printf '%s\n' "${REVIEW_FOCUS[@]}"

printHeader2 "Sanity Checks"
if [[ -n "$DIFF_CHECK_OUTPUT" ]]; then
  printError "git diff --check нашел проблемы"
  printf '%s\n' "$DIFF_CHECK_OUTPUT"
else
  printSuccess "git diff --check не нашел проблем"
fi

printHeader2 "Диапазон Для Review"
printf '%s\n' "git diff ${MERGE_BASE}..HEAD"
printf '%s\n' "git diff --name-status --find-renames ${MERGE_BASE}..HEAD"

printHeader2 "Подсказка Для Review"
printf '%s\n' "Проверь итоговый diff задачи относительно ${BASE_REF}: ${MERGE_BASE}..HEAD."
printf '%s\n' "Сначала оцени изменения относительно цели из ${CONTEXT_FILE:-$DEFAULT_CONTEXT_FILE}, затем ищи баги, регрессии, пропущенные тесты и риски в затронутых модулях."
printf '%s\n' "Коммиты служат только как история; вывод по ревью должен относиться к финальному состоянию ветки."
