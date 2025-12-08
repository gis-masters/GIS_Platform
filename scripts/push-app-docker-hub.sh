#!/usr/bin/env bash

# Определяем путь к директории скрипта
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

# Переходим в директорию скриптов
cd "$SCRIPT_DIR" || exit 1

# Imports
. "$SCRIPT_DIR/utils/textUtil"

# Чистим что есть на всякий случай
"$SCRIPT_DIR/remove-our-images.sh" || true
docker rmi 10.10.10.165:5000/crg-ui:latest || true

printInfo "Пересобираем фронт"
cd "$PROJECT_ROOT/portal-ui" || exit 1
npm i
rm -rf dist/
npm run build || {
    printError "Сборка фронта не удалась"
    exit 1
}

cd "$PROJECT_ROOT" || exit 1

printInfo "Пересобираем проект"
mvn clean install || {
  printError "Failed to build common-contracts. See maven errors"
  exit 1
}

printInfo "Пересобираем сервисы"
# Собираем образ UI
printInfo "Сборка образа crg-ui"
docker build -t 10.10.10.165:5000/crg-ui:latest portal-ui/ || {
    printError "Сборка образа crg-ui не удалась"
    exit 1
}

# Собираем образы сервисов
printInfo "Сборка образа auth-service"
docker build -t 10.10.10.165:5000/auth-service:latest auth-service/ || {
    printError "Сборка образа auth-service не удалась"
    exit 1
}

printInfo "Сборка образа crg-integration-service"
docker build -t 10.10.10.165:5000/crg-integration-service:latest integration-service/ || {
    printError "Сборка образа crg-integration-service не удалась"
    exit 1
}

printInfo "Сборка образа crg-report-service"
docker build -t 10.10.10.165:5000/crg-report-service:latest report-service/ || {
    printError "Сборка образа crg-report-service не удалась"
    exit 1
}

printInfo "Сборка образа crg-gateway"
docker build -t 10.10.10.165:5000/crg-gateway:latest gateway/ || {
    printError "Сборка образа crg-gateway не удалась"
    exit 1
}

printInfo "Сборка образа crg-audit-service"
docker build -t 10.10.10.165:5000/crg-audit-service:latest audit-service/ || {
    printError "Сборка образа crg-audit-service не удалась"
    exit 1
}

printInfo "Сборка образа crg-gis-service"
docker build -t 10.10.10.165:5000/crg-gis-service:latest gis-service/ || {
    printError "Сборка образа crg-gis-service не удалась"
    exit 1
}

printInfo "Сборка образа crg-data-service"
docker build -t 10.10.10.165:5000/crg-data-service:latest data-service/ || {
    printError "Сборка образа crg-data-service не удалась"
    exit 1
}

printInfo "Сборка образа geo-wrapper"
docker build -t 10.10.10.165:5000/geo-wrapper:latest geo-wrapper/ || {
    printError "Сборка образа geo-wrapper не удалась"
    exit 1
}

printInfo "Ретегирование образов"
docker tag 10.10.10.165:5000/crg-ui:latest                   gismaster/crg-ui:2_ru
docker tag 10.10.10.165:5000/geo-wrapper:latest              gismaster/geo-wrapper:2_ru
docker tag 10.10.10.165:5000/crg-gateway:latest              gismaster/crg-gateway:2_ru
docker tag 10.10.10.165:5000/auth-service:latest             gismaster/auth-service:2_ru
docker tag 10.10.10.165:5000/crg-gis-service:latest          gismaster/crg-gis-service:2_ru
docker tag 10.10.10.165:5000/crg-data-service:latest         gismaster/crg-data-service:2_ru
docker tag 10.10.10.165:5000/crg-audit-service:latest        gismaster/crg-audit-service:2_ru
docker tag 10.10.10.165:5000/crg-report-service:latest       gismaster/crg-report-service:2_ru
docker tag 10.10.10.165:5000/crg-integration-service:latest  gismaster/crg-integration-service:2_ru
docker tag 10.10.10.165:5000/crg-notification-service:latest gismaster/crg-notification-service:2_ru

printInfo "Публикуем в реестр hub.docker"
docker push gismaster/crg-ui:2_ru
docker push gismaster/geo-wrapper:2_ru
docker push gismaster/crg-gateway:2_ru
docker push gismaster/auth-service:2_ru
docker push gismaster/crg-gis-service:2_ru
docker push gismaster/crg-data-service:2_ru
docker push gismaster/crg-audit-service:2_ru
docker push gismaster/crg-report-service:2_ru
docker push gismaster/crg-integration-service:2_ru
docker push gismaster/crg-notification-service:2_ru

printSuccess "Свежие 2_ru образы опубликованы"
