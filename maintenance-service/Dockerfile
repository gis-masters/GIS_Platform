FROM 10.10.10.116:5000/nginx:1.27-alpine

# Копируем статические файлы (HTML + картинки)
COPY edge/html/ /usr/share/nginx/html/

# Создаём директории
RUN mkdir -p /opt/crg/ssl

# Копируем и делаем исполняемым entrypoint
COPY scripts/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80 443

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
