#!/usr/bin/env bash
# installGisMastersApp.sh — проверка окружения + загрузка ресурсов  + запуск и ожидание контейнеров
set -Eeuo pipefail

# -------------------- Константы --------------------
REQUIRED_FREE_GB=40              # минимум свободного места (ГБ)
REQUIRED_RAM_GB=32               # минимум ОЗУ (ГБ)
MAX_KERNEL_MAJOR=6               # ядро должно быть НЕ НОВЕЕ 6.8.x (6.9+ и 6.13 — не подходят)
MAX_KERNEL_MINOR=8
EXPECTED_CONTAINERS=8            # ожидаемое количество healthy контейнеров
WAIT_TIMEOUT_SECS=180            # 3 минуты
WAIT_STEP_SECS=5                 # шаг ожидания

REPO_TARBALL_URL="https://github.com/gis-masters/GIS_Platform/archive/refs/heads/master.tar.gz"

ISSUES=()

# Сообщение при некорректном вводе (по вашей формулировке — оставлено дословно)
ALLOWED_INPUT_MSG='Был некорректный ввод. Допустимые значения кириллицей: Да да д Нет нет н; Латиницей: Yes yes y No no n'

# -------------------- Утилиты --------------------
log()  { printf "%s\n" "$*"; }
ok()   { printf "  [OK] %s\n" "$*"; }
bad()  { printf "  [!!] %s\n" "$*"; }

to_int_mm() { awk -F. '{maj=$1; min=$2; if(min=="") min=0; printf("%d%03d\n", maj, min)}' <<<"$1"; }

kernel_major_minor() {
  local k
  k="$(uname -r | sed 's/[~-].*$//')"   # 6.8.0-… -> 6.8.0
  awk -F. '{printf("%d.%d\n",$1, ($2==""?0:$2))}' <<<"$k"
}

has_cmd() { command -v "$1" >/dev/null 2>&1; }

check_tcp() { local host="$1" port="$2"; timeout 5 bash -lc "exec 3<>/dev/tcp/${host}/${port}" >/dev/null 2>&1; }

http_head() {
  local url="$1" host port=443
  host="$(awk -F/ '{print $3}' <<<"$url")"
  if has_cmd curl; then curl -fsS --head --max-time 5 "$url" >/dev/null 2>&1 && return 0
  elif has_cmd wget; then wget -q --spider --timeout=5 "$url" >/dev/null 2>&1 && return 0
  fi
  check_tcp "$host" "$port"
}

have_fetcher() {
  if has_cmd curl || has_cmd wget; then return 0
  else ISSUES+=("Нет curl/wget для скачивания"); bad "Не найдено curl или wget для скачивания архивов"; return 1
  fi
}

fetch_to_file() {
  local url="$1" out="$2"
  if has_cmd curl; then curl -fSL "$url" -o "$out"
  else wget -qO "$out" "$url"
  fi
}

lower() { tr '[:upper:]' '[:lower:]'; }

first_ip() { hostname -I 2>/dev/null | awk '{print $1}'; }

# -------------------- Да/Нет с жёстким набором допустимых ответов --------------------
ask_yes_no() {
  # Использование: if ask_yes_no "Вопрос?"; then ... # YES  else ... # NO
  local prompt="${1:-Продолжить?}"
  local ans=""
  while true; do
    read -r -p "$prompt [Да/Нет | Yes/No]: " ans || ans=""
    case "$ans" in
      Да|да|д|Yes|yes|y) return 0 ;; # YES
      Нет|нет|н|No|no|n) return 1 ;; # NO
      *) echo "$ALLOWED_INPUT_MSG" ;;
    esac
  done
}

# -------------------- Bootstrap: обеспечить работу в /opt/crg --------------------
bootstrap_target_dir() {
  local SUDO=""
  [[ $EUID -ne 0 && -x "$(command -v sudo)" ]] && SUDO="sudo"
  local ans="" DEFAULT_DIR="/opt/crg"
  
  #ищем контейнер с примонтированной папкой
  local mountpoint=$(docker inspect $(docker ps -aqf "name=crg-data-service") --format='{{range .Mounts}}{{.Source}} {{println}}{{end}}' 2>/dev/null | grep -o '^.*/file_storage' | sed 's|/file_storage||')
  REQUIRED_DIR=$mountpoint

  if [[ -z $REQUIRED_DIR ]]; then
    while true; do
      read -r -p "Укажите папку расположения данных [$DEFAULT_DIR]: " ans || ans=$DEFAULT_DIR
      if [[ -z $ans ]]; then
        # Пользователь выбрал расположение по умолчанию
        REQUIRED_DIR=$DEFAULT_DIR
        break
      else
        local regex='^[a-zA-Z0-9_/-]*$'
        if [[ $ans =~ $regex ]]; then
          #Удаляем / в конце
          REQUIRED_DIR=$(echo "$ans" | sed 's:/*$::')
          break
        else 
          echo -e "\e[33mПапка должна содержать в пути только английские буквы, цифры, символы _ -\e[0m"
        fi
      fi
    done

    if [ -e "$REQUIRED_DIR" ] && [ ! -d "$REQUIRED_DIR" ]; then
      echo "Ошибка: Существует файл '$REQUIRED_DIR' это не папка"
      exit 1
    fi

    if [ -d "$REQUIRED_DIR" ]; then
      echo "Папка '$REQUIRED_DIR' существует"
      local perms; perms="$(stat -c '%a' "$REQUIRED_DIR" 2>/dev/null || echo "")"
      if [[ "$perms" != "777" ]] ; then
        if  ask_yes_no "Выдать права (777) на $REQUIRED_DIR?"; then
          $SUDO chmod -R 777 "$REQUIRED_DIR" || true
        else
          echo "Отменено пользователем."; exit 1
        fi
      fi
    else
      if ask_yes_no "Создать $REQUIRED_DIR и выдать права (777)?"; then
        $SUDO mkdir -p "$REQUIRED_DIR"
        $SUDO chmod -R 777 "$REQUIRED_DIR" || true
      else
        echo "Отменено пользователем."; exit 1
      fi
    fi
  fi
  echo "Данные приложения расположены в $REQUIRED_DIR"
}


check_os() {
  if [[ -r /etc/os-release ]]; then
    # shellcheck disable=SC1091
    . /etc/os-release || true
    if [[ "${ID:-}" == "ubuntu" ]]; then ok "ОС: Ubuntu (${PRETTY_NAME:-unknown})"
    else bad "ОС не Ubuntu (нужна Ubuntu)"; ISSUES+=("ОС не Ubuntu"); fi
  else bad "Не удалось определить ОС"; ISSUES+=("Не удалось определить ОС"); fi
}

check_kernel() {
  local mm k_int max_int
  mm="$(kernel_major_minor)"
  k_int="$(to_int_mm "$mm")"
  max_int="$(to_int_mm "${MAX_KERNEL_MAJOR}.${MAX_KERNEL_MINOR}")"
  if [[ "$k_int" -le "$max_int" ]]; then ok "Версия ядра: $(uname -r) (допустимо ≤ ${MAX_KERNEL_MAJOR}.${MAX_KERNEL_MINOR})"
  else bad "Версия ядра: $(uname -r) — слишком новая (допустимо ≤ ${MAX_KERNEL_MAJOR}.${MAX_KERNEL_MINOR})"; ISSUES+=("Ядро > ${MAX_KERNEL_MAJOR}.${MAX_KERNEL_MINOR}"); fi
}

check_ram() {
  local mem_kb required_kb
  mem_kb=$(awk '/MemTotal:/ {print $2}' /proc/meminfo)
  required_kb=$((REQUIRED_RAM_GB * 1024 * 1024))
  if (( mem_kb >= required_kb )); then ok "ОЗУ: $(awk -v kb="$mem_kb" 'BEGIN{printf "%.1f", kb/1024/1024}') ГБ (минимум ${REQUIRED_RAM_GB} ГБ)"
  else bad "ОЗУ недостаточно: $(awk -v kb="$mem_kb" 'BEGIN{printf "%.1f", kb/1024/1024}') ГБ (< ${REQUIRED_RAM_GB} ГБ)"; ISSUES+=("ОЗУ < ${REQUIRED_RAM_GB} ГБ"); fi
}

check_disk() {
  local avail_bytes avail_gb
  avail_bytes=$(df --output=avail -B1 / 2>/dev/null | tail -n1 | tr -dc '0-9')
  if [[ -z "$avail_bytes" ]]; then bad "Не удалось определить свободное место на корневом разделе"; ISSUES+=("Не удалось проверить свободное место"); return; fi
  avail_gb=$(( avail_bytes / 1024 / 1024 / 1024 ))
  if (( avail_gb >= REQUIRED_FREE_GB )); then ok "Свободное место на /: ${avail_gb} ГБ (минимум ${REQUIRED_FREE_GB} ГБ)"
  else bad "Свободное место на /: ${avail_gb} ГБ (< ${REQUIRED_FREE_GB} ГБ)"; ISSUES+=("Свободное место < ${REQUIRED_FREE_GB} ГБ"); fi
}

check_network() {
  local ok_any=0
  if check_tcp 1.1.1.1 443 || check_tcp 8.8.8.8 443; then ok "Общий выход в интернет (TCP/443) доступен"; ok_any=1
  else bad "Нет подтверждения общего выхода в интернет (TCP/443)"; ISSUES+=("Нет общего выхода в интернет"); fi
  if http_head "https://github.com"; then ok "Доступ к GitHub (https://github.com)"
  else bad "Нет доступа к GitHub (https://github.com)"; ISSUES+=("Нет доступа к GitHub"); fi
  if http_head "https://hub.docker.com"; then ok "Доступ к Docker Hub (https://hub.docker.com)"
  else bad "Нет доступа к Docker Hub (https://hub.docker.com)"; ISSUES+=("Нет доступа к Docker Hub"); fi
  (( ok_any == 1 )) || true
}

check_docker() {
  if has_cmd docker; then ok "Docker CLI найден: $(docker --version 2>/dev/null || echo 'версия не определена')"
  else bad "Docker не установлен (не найден бинарь docker)"; ISSUES+=("Нет docker. Инструкция по установке https://docs.docker.com/engine/install/ubuntu/"); fi

  if has_cmd docker && docker info >/dev/null 2>&1; then ok "Docker daemon доступен"
  else bad "Docker daemon недоступен (права/группа docker)"; ISSUES+=("У пользователя не хватает прав для использования docker выполните 'sudo usermod -aG docker $USER' и перезагрузитесь."); fi

  if docker compose version >/dev/null 2>&1; then ok "docker compose (plugin) найден"
  elif has_cmd docker-compose; then ok "docker-compose (standalone) найден: $(docker-compose --version 2>/dev/null || true)"
  else bad "Не найден docker compose (ни plugin, ни standalone)"; ISSUES+=("Нет docker compose. При установке последней версии docker установится автоматически"); fi
}

# -------------------- Docker helpers --------------------
count_healthy() {
  docker ps --filter "health=healthy" --format '{{.ID}}' 2>/dev/null | wc -l | tr -d ' '
}

is_service_healthy() {
  # по имени сервиса/контейнера (частичное совпадение имени)
  local name="$1"
  local cid
  cid="$(docker ps --filter "name=${name}" --format '{{.ID}}' | head -n1)"
  [[ -z "$cid" ]] && return 1
  local st
  st="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$cid" 2>/dev/null || echo "unknown")"
  [[ "$st" == "healthy" ]]
}

wait_for_containers() {
  local start now healthy
  start="$(date +%s)"
  while :; do
    healthy="$(count_healthy)"
    echo "Сейчас включилось $healthy из $EXPECTED_CONTAINERS"
    if (( healthy >= EXPECTED_CONTAINERS )); then
      return 0   # успех
    fi
    now="$(date +%s)"
    if (( now - start >= WAIT_TIMEOUT_SECS )); then
      break      # таймаут
    fi
    sleep "$WAIT_STEP_SECS"
  done

  # Таймаут
  if (( healthy == EXPECTED_CONTAINERS - 1 )); then
    # Проверяем auth-service
    if ! is_service_healthy "auth-service"; then
      return 2   # особый случай: только auth-service не healthy
    fi
  fi
  return 1       # прочие ошибки
}
#----------------------- Ввод логина и пароля --------------------------
validate_email() {
    if [[ "$1" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
        return 0
    else
        return 1
    fi
}

ask_login() {
    # Считываем логин
    while true; do
        read -p "Введите логин администратора, в виде электронной почты: " LOGIN
        if validate_email "$LOGIN"; then
            break
        else
            bad "Неверный формат электронной почты. Введите другой логин. Например user@example.com."
            if ! ask_yes_no 'Попробовать снова?'; then
              exit 1;
            fi
        fi
    done
}

validate_password_strength() {
    local password="$1"
    local strength=0
    local feedback=""

    if [[ -z "$password" ]]; then
        feedback+="  - Пароль не может быть пустым\n"
    fi

    if [[ ${#password} -ge 8 ]]; then
        ((strength++))
    else
        feedback+="  - Миннимум 8 символов\n"
    fi
    
    if [[ "$password" =~ [A-Z] ]]; then
        ((strength++))
    else
        feedback+="  - Мининмум одна заглавная буква (A-Z)\n"
    fi
    
    if [[ "$password" =~ [a-z] ]]; then
        ((strength++))
    else
        feedback+="  - Миннимум одна буква в ниженм регистре (a-z)\n"
    fi

    if [[ "$password" =~ [0-9] ]]; then
        ((strength++))
    else
        feedback+="  - Минимум одна цифра (0-9)\n"
    fi
    
    if [[ $strength -eq 4 ]]; then
        echo "strong"
        return 0
    else
        echo -e "weak\n$feedback"
        return 2
    fi
}

ask_password() {
    while true; do
        read -sp "Введите пароль администратора: " PASSWORD
        echo ""
        # Проверяем устойчивость пароля
        local strength_result=$(validate_password_strength "$PASSWORD")
        local strength=$(echo "$strength_result" | head -1)
        local feedback=$(echo "$strength_result" | tail -n+2)
        case $strength in
            "strong")
                echo "✓ Устойчивость пароля: СИЛЬНАЯ"
                break
                ;;
            "weak")
                echo "✗ Устойчивость пароля: СЛАБАЯ"
                echo "Ошибки:"
                echo -e $feedback
                if ! ask_yes_no 'Попробовать снова?'; then
                    exit 1;
                fi
                ;;
        esac
    done

    # Подтверждение паролей
    if [[ "$strength_result" == "strong" ]] then
        while true; do
            read -sp "Подтвердите пароль: " password_confirm
            echo ""
            
            if [[ "$PASSWORD" == "$password_confirm" ]]; then
                echo "✓ Пароль подтвержден"
                break
            else
                echo "✗ Пароли не совпадают."
                if ! ask_yes_no 'Попробовать снова?'; then
                    exit 1;
                fi
            fi
        done
    fi
}

generate_password(){
    PASSWORD=$(</dev/urandom tr -dc 'A-Za-z0-9' | head -c8; echo)
    PASSWORD="${PASSWORD:0:8}"
    while ! [[ "$PASSWORD" =~ [A-Z] && "$PASSWORD" =~ [a-z] && "$PASSWORD" =~ [0-9] ]]; do
        PASSWORD=$(</dev/urandom tr -dc 'A-Za-z0-9' | head -c8; echo)
        PASSWORD="${PASSWORD:0:8}"
    done
}


load_env_file() {
  local env_file="$1"

  [[ -f "$env_file" ]] || return 0

  set -a
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
    [[ "$line" =~ ^[^=]*\.[^=]*= ]] && continue

    if [[ "$line" =~ ^[A-Za-z_][A-Za-z0-9_]*=.*$ ]]; then
      eval "export $line"
    fi
  done < "$env_file"
  set +a
}

update_env() {
  local env_file="$BASE_DIR/settings.env"
  local tmp_file="settings.env.tmp"

  if [[ ! -f "$env_file" ]]; then
    echo "Файл $env_file не найден!"
    return 1
  fi

  # Формируем awk-скрипт
  local awk_script='BEGIN{OFS="="}'
  for arg in "$@"; do
    local key="${arg%%=*}"   # всё до "="
    local value="${arg#*=}"  # всё после "="
    awk_script+=" \$1==\"$key\"{\$2=\"$value\"}"
  done
  awk_script+=' {print}'

  # Запускаем awk
  awk -F= "$awk_script" "$env_file" > "$tmp_file" && mv "$tmp_file" "$env_file"
}


start_platform() {
    # .env может быть отредактирован пользователем прямо перед запуском,
    # поэтому перечитываем его только здесь.
    load_env_file "$BASE_DIR/settings.env"

    # Устанавливаем mem_limit для контейнеров в зависимости от объема памяти. Второй параметр это процент. 
    # Геосерверу и другим важным побольше, другим по меньше в  сумме должно быть примерно 90%
    export AUDIT_MEM_LIMIT=$($BASE_DIR/calc_mem_limit.sh 2)
    export AUTH_MEM_LIMIT=$($BASE_DIR/calc_mem_limit.sh 3)
    export DATA_MEM_LIMIT=$($BASE_DIR/calc_mem_limit.sh 6)
    export GATEWAY_MEM_LIMIT=$($BASE_DIR/calc_mem_limit.sh 3)
    export WRAPPER_MEM_LIMIT=$($BASE_DIR/calc_mem_limit.sh 3)
    export GIS_MEM_LIMIT=$($BASE_DIR/calc_mem_limit.sh 3)
    export INTEGRATION_MEM_LIMIT=$($BASE_DIR/calc_mem_limit.sh 3)
    export UI_MEM_LIMIT=$($BASE_DIR/calc_mem_limit.sh 1)
    export CRYPTOPRO_MEM_LIMIT=$($BASE_DIR/calc_mem_limit.sh 1)
    export NOTIFICATION_MEM_LIMIT=$($BASE_DIR/calc_mem_limit.sh 1)
    export REPORT_SERVICE_MEM_LIMIT=$($BASE_DIR/calc_mem_limit.sh 3)

    export GEOSERVER_MEM_LIMIT=$($BASE_DIR/calc_mem_limit.sh 30)
    export GEOSERVER_XMS_SIZE=$($BASE_DIR/calc_mem_limit.sh 15)m
    export GEOSERVER_XMX_SIZE=$($BASE_DIR/calc_mem_limit.sh 25)m

    export POSTGIS_MEM_LIMIT=$($BASE_DIR/calc_mem_limit.sh 20)
    export SHM_SIZE=$($BASE_DIR/calc_mem_limit.sh 6)mb
    export PG_SHARED_BUFFERS=$($BASE_DIR/calc_mem_limit.sh 5)MB
    export PG_EFFECTIVE_CACHE_SIZE=$($BASE_DIR/calc_mem_limit.sh 15)MB

    export RABBITMQ_MEM_LIMIT=$($BASE_DIR/calc_mem_limit.sh 3)
    export REDIS_MEM_LIMIT=$($BASE_DIR/calc_mem_limit.sh 1)
    export CARBONE_MEM_LIMIT=$($BASE_DIR/calc_mem_limit.sh 3)

    local RUNNING=$(docker ps  --format "{{.Image}}" | grep gismaster || true)
    if [ -n "$RUNNING" ]; then
     echo "[info] Останавливаю приложение и удаляю старые образы."
     docker compose -f $BASE_DIR/coreApplication.yml -f $BASE_DIR/openSources.yml --profile "*" down  --rmi all
    fi

    export CRG_DATA_DIR=$REQUIRED_DIR
    export GEOSERVER_DATA_DIR=${GEOSERVER_DATA_DIR:-${CRG_DATA_DIR}/data/geoserver}
    export DB_DATA_DIR=${DB_DATA_DIR:-${CRG_DATA_DIR}/data/postgres}
    cd "$BASE_DIR"
    pushd ./assets/ || exit
    
    ./migration-scripts/run.sh "${CRG_USER}" "${DB_PASS}" "${SECURITY_JWT_SECRET}" "${GEOSERVER_UI_LOGIN}" "${GEOSERVER_UI_CRYPTED_PASSWORD}"
    
    popd || exit
    docker compose -f ./coreApplication.yml \
        -f ./openSources.yml \
        --env-file ./settings.env \
        --profile ui up -d

    echo "[wait] Ожидаю, пока контейнеры включатся (до 3 минут)..."
    while true; do
      wait_for_containers
      HOST_IP="$(first_ip)"
      if [[ $? -eq 0 ]]; then
        log "Установка прошла успешно. Вы можете открыть страницу проекта по ссылке http://$HOST_IP . Либо зарегистрировать свою организацию по ссылке http://$HOST_IP/register"
      elif  [[ $? -eq 2 ]] ; then
        log "Восстановление пароля недоступно."
      else 
        echo "Установка завершена с ошибкой. Обратитесь к издателю за деталями."
        if ask_yes_no "На слабом сервере время включения всех контейнеров может быть больше. Желаете подождать
           ещё 3 минуты? (вы можете отвечать Да столько раз, сколько будет необходимо)"; then
             echo "[wait] Ожидаю еще раз, пока контейнеры станут healthy (до 3 минут)..."
          continue
        else
          echo "Установка прервана пользователем."
          exit 1
        fi
      fi

      echo ""
      echo ""
      echo "================================================"
      {
      echo "Системный логин| $SYSTEM_ADMIN_LOGIN"
      echo "Системный пароль| $SYSTEM_ADMIN_PASSWORD"
      echo "|"
      echo "Доступ на портал| http://$HOST_IP"
      echo "Описание|Через системный пароль доступен веб-интерфейс администратора платформы для управления настройками зарегистированных организаций."
      HOST_PORT=$(docker port "postgis" "5432/tcp" 2>/dev/null | cut -d':' -f2)
      echo "Доступ на PostgreSQL|$HOST_IP:$HOST_PORT"
      echo "Описание|База данных платформы для хранения структурированных данных, геоданных и служебной информации."
      HOST_PORT=$(docker port "geoserver" "8080/tcp" 2>/dev/null | cut -d':' -f2)
      echo "Доступ на Geoserver|http://$HOST_IP:$HOST_PORT/geoserver/web"
      echo "Описание|Сервис публикации и визуализации геоданных на карте через геосервисы платформы."
      HOST_PORT=$(docker port "rabbitmq" "15672/tcp" 2>/dev/null | cut -d':' -f2)
      echo "Доступ на Rabbit| http://$HOST_IP:$HOST_PORT/"
      echo "Описание|Сервис очередей сообщений для обмена данными между внутренними компонентами платформы."
      echo "|"
      echo "Настройки сохранены в| $BASE_DIR/settings.env"
      } | column -t -s '|'
      exit 0
    done
  }

# -------------------- Действия после согласия --------------------
download_and_prepare() {
  local BASE_DIR="$REQUIRED_DIR"
  local TMP_DIR TARBALL
  TMP_DIR="$(mktemp -d)"
  TARBALL="$TMP_DIR/GIS_Platform-master.tar.gz"

  log "[1/4] Скачиваю данные из основного проекта..."
  fetch_to_file "$REPO_TARBALL_URL" "$TARBALL"

  #Для локального тестирования скрипта
  #git archive --format=tar.gz --prefix=GIS_Platform-master/ --output="$TARBALL" bump-geoserver


  log "[2/4] Извлекаю ресурсы..."
  mkdir -p "$BASE_DIR/assets"
  sudo tar -xzf "$TARBALL" --strip-components=2 -C "$BASE_DIR/assets" GIS_Platform-master/assets

  log "[3/4] Извлекаю .env и compose..."
  sudo tar -xzf "$TARBALL" --strip-components=1 -C "$BASE_DIR" GIS_Platform-master/.env.example
  sudo tar -xzf "$TARBALL" --strip-components=1 -C "$BASE_DIR" GIS_Platform-master/coreApplication.yml
  sudo tar -xzf "$TARBALL" --strip-components=1 -C "$BASE_DIR" GIS_Platform-master/openSources.yml
  sudo tar -xzf "$TARBALL" --strip-components=2 -C "$BASE_DIR" GIS_Platform-master/scripts/calc_mem_limit.sh
  sudo tar -xzf "$TARBALL" --strip-components=2 -C "$BASE_DIR" GIS_Platform-master/scripts/update_env_file.sh


  # Подготовка окружения
  if [[ -f "$BASE_DIR/settings.env" ]]; then
    echo "[info] Файл settings.env уже существует — обновляю."
    $BASE_DIR/update_env_file.sh "$BASE_DIR/settings.env" "$BASE_DIR/.env.example" SYSTEM_ADMIN_LOGIN SYSTEM_ADMIN_PASSWORD CRG_USER DB_PASS GEOSERVER_UI_LOGIN SECURITY_JWT_CLIENT_ID SECURITY_JWT_CLIENT_SECRET SECURITY_JWT_SECRET RABBIT_USER RABBIT_PASS REDIS_PASS CAMUNDA_BPM_ADMIN_USER_ID CAMUNDA_BPM_ADMIN_USER_PASSWORD GEOSERVER_UI_CRYPTED_PASSWORD CRG_OPTIONS_SYSTEM_ADMIN_CRYPTED_PASSWORD SPRING_FLYWAY_PLACEHOLDERS_ADMIN_PASSWORD SPRING_MAIL_USERNAME SPRING_MAIL_PASSWORD
  else
    mv -f "$BASE_DIR/.env.example" "$BASE_DIR/settings.env"
    echo "[ok] Создан settings.env из шаблона .env.example"
  fi

  sudo chown "$(id -u)":"$(id -g)" "$BASE_DIR/settings.env" 2>/dev/null || true

  # Права на всё под /opt/crg
  chmod -R +x "$BASE_DIR" 2>/dev/null || true

  log "[4/4] Уборка..."
  rm -rf "$TMP_DIR"

  echo
  echo "Готово! В каталоге $BASE_DIR появились:"
  echo " - папка assets"
  echo " - файлы: settings.env, coreApplication.yml, openSources.yml, calc_mem_limit.sh"
  echo

  local RUNNING=$(docker ps  --format "{{.Image}}" | grep gismaster || true)
  
  #если это первая установка
  if [ -z "$RUNNING" ]; then
    LOGIN="gis@master.ru"
    if ask_yes_no "Указать логин администратора? (по умолчанию $LOGIN)"; then
      ask_login
    fi

    if ask_yes_no "Указать пароль администратора? Миннимум 8 символов, цифры, заглавные и строчные буквы. (Будет сгенерирован случайный)"; then
      ask_password
    else
      generate_password
    fi
    
    local output
    docker pull gismaster/gis-platform-ph
    mapfile -t output < <(docker run --rm gismaster/gis-platform-ph "$PASSWORD")
    FLYWAY_PASSWORD="${output[0]}"
    GEOSERVER_PASSWORD="${output[1]}"


    update_env SYSTEM_ADMIN_LOGIN=$LOGIN SYSTEM_ADMIN_PASSWORD=$PASSWORD \
              CRG_USER=$LOGIN DB_PASS=$PASSWORD \
              SECURITY_JWT_CLIENT_ID=$LOGIN SECURITY_JWT_CLIENT_SECRET=$PASSWORD \
              GEOSERVER_UI_LOGIN=$LOGIN SECURITY_JWT_SECRET=$PASSWORD \
              RABBIT_USER=$LOGIN RABBIT_PASS=$PASSWORD \
              REDIS_PASS=$PASSWORD CAMUNDA_BPM_ADMIN_USER_ID=$LOGIN \
              CAMUNDA_BPM_ADMIN_USER_PASSWORD=$PASSWORD \
              GEOSERVER_UI_CRYPTED_PASSWORD=$GEOSERVER_PASSWORD \
              CRG_OPTIONS_SYSTEM_ADMIN_CRYPTED_PASSWORD=$GEOSERVER_PASSWORD \
              SPRING_FLYWAY_PLACEHOLDERS_ADMIN_PASSWORD=\'$FLYWAY_PASSWORD\' \
              SPRING_MAIL_USERNAME=GisPlatform@yandex.ru \
              SPRING_MAIL_PASSWORD=ibhcizcxxbzyktvl
  else
   echo "[info] Выполняется обновление приложения."
  fi
  
  echo "Запуск через 10 секунд… Нажмите Ctrl+C для отмены." >&2
  sleep 10


  start_platform "$BASE_DIR"
}

# -------------------- Главный поток --------------------
log "=== Предварительная проверка окружения ==="
check_os
check_kernel
check_ram
check_disk
check_network
have_fetcher
check_docker
log "========================================="



if (( ${#ISSUES[@]} == 0 )); then
  echo "Все параметры соответствуют ожидаемым."
  echo "Ваш сервер подходит для установки приложения."
  if ask_yes_no "Начать установку приложения?"; then
    bootstrap_target_dir "$@"
    download_and_prepare
  else
    exit 0
  fi
else
  echo
  echo "===== Сводка по системе ====="
  echo "Хост:        $(hostname)"
  echo "Дата:        $(date -R)"
  if [[ -r /etc/os-release ]]; then . /etc/os-release || true; fi
  echo "ОС:          ${PRETTY_NAME:-$(uname -s)}"
  echo "Ядро:        $(uname -r)"
  echo "Архитектура: $(uname -m)"
  echo "CPU (ядер):  $(nproc 2>/dev/null || echo '?')"
  awk '
    /MemTotal:/ {mt=$2}
    /MemFree:/  {mf=$2}
    /SwapTotal:/ {st=$2}
    END{
      printf("ОЗУ всего:  %.1f ГБ\n", mt/1024/1024);
      printf("ОЗУ свободно: %.1f ГБ\n", mf/1024/1024);
      printf("Swap всего: %.1f ГБ\n", st/1024/1024);
    }' /proc/meminfo 2>/dev/null || true
  echo "Диски:"
  df -hT | awk 'NR==1 || /^\/dev\// {print "  "$0}'
  echo "IP адреса:   $(hostname -I 2>/dev/null || echo 'n/a')"
  echo "Скрипт в:    $(cd "$(dirname "$(realpath "$0")")" && pwd -P)"
  if [ -n "${REQUIRED_DIR+x}" ]; then
    if [[ -d "$REQUIRED_DIR" ]]; then
      echo "Права $REQUIRED_DIR: $(stat -c '%a %U:%G' "$REQUIRED_DIR" 2>/dev/null || echo '?')"
      ls -ld "$REQUIRED_DIR" 2>/dev/null || true
    fi
  fi
  if has_cmd docker; then
    echo "Docker версии:"
    docker --version 2>/dev/null || true
    docker compose version 2>/dev/null || docker-compose --version 2>/dev/null || true
  fi
  echo "============================="
  echo
  echo "Мастер установки не может двигаться дальше:"
  for i in "${ISSUES[@]}"; do echo " - $i"; done
  exit 1
fi