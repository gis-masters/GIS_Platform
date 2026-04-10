#!/bin/sh
set -e

# Общая логика maintenance для всех серверов
MAINTENANCE_LOGIC="
    # Статические файлы (картинки, CSS, JS)
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp)$ {
        root /usr/share/nginx/html;
        expires 1h;
        add_header Cache-Control \"public, immutable\";
    }

    # Все остальные запросы -> maintenance.html
    location / {
        root /usr/share/nginx/html;
        try_files /maintenance.html =404;
        add_header Cache-Control \"no-store\";
    }"

# Генерируем HTTP блок (всегда)
HTTP_BLOCK="# HTTP сервер - только статическая страница техработ
server {
    listen 80;
    server_name _;
$MAINTENANCE_LOGIC
}"

# Генерируем HTTPS блок (если нужен)
HTTPS_BLOCK=""
if [ "$HTTPS_ALLOWED" = "1" ]; then
    # Проверяем наличие сертификатов
    if [ -f /opt/crg/ssl/maintenance.crt ] && [ -f /opt/crg/ssl/maintenance.key ]; then
        echo "HTTPS enabled: сертификаты найдены"
        HTTPS_BLOCK="
# HTTPS сервер
server {
    listen 443 ssl http2;
    server_name _;

    ssl_certificate /opt/crg/ssl/maintenance.crt;
    ssl_certificate_key /opt/crg/ssl/maintenance.key;

    # SSL настройки
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
$MAINTENANCE_LOGIC
}"
    else
        echo "Предупреждение: HTTPS_ALLOWED=1, но сертификаты не найдены в /opt/crg/ssl/"
        echo "HTTPS будет недоступен. Убедитесь, что файлы maintenance.crt и maintenance.key присутствуют."
    fi
else
    echo "HTTPS отключен (HTTPS_ALLOWED=0)"
fi

# Генерируем финальный конфиг
cat > /etc/nginx/conf.d/default.conf <<EOF
$HTTP_BLOCK
$HTTPS_BLOCK
EOF

# Заменяем текст о времени работ если задана переменная
if [ -n "$MAINTENANCE_TIME" ]; then
    sed -i "s|<!--{%additional text%}-->|${MAINTENANCE_TIME}|g" \
        /usr/share/nginx/html/maintenance.html
fi

# Проверяем конфигурацию nginx
echo "Проверка конфигурации nginx..."
nginx -t

# Запускаем nginx
exec nginx -g "daemon off;"
