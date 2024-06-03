#!/bin/bash

# Авторизуемся и получаем токен
export token=$(curl --location --request POST 'http://localhost:8100/oauth/token?username=admin@mail.ru&password=Esterhazy2022')

# Проверка токена
if [[ -z "$token" ]]; then
  echo "Failed to retrieve token"
  exit 1
fi

# Выведем токен
echo "$token"

# Обрабатываем каждый файл и папку в указанной директории
upload() {
  local sourseFolder="$1"
  local targetPath="$2"

  for object in "$sourseFolder"*
  do

    objectPath="$targetPath$(basename "$object")"
    # Проверка на папку
    if [ -d "$object" ]; then

      upload "$object/" "$objectPath"

    else
      # Логирование файл
      echo "Sending file: $object"

      # Отправить файл на сервер
      curl --location --request PUT "http://localhost:8080/geoserver/rest/resource/styles/$objectPath" \
      --header 'Content-Type: application/vnd.ogc.sld+xml' \
      --header "Authorization: Bearer $token" \
      --data-binary @"$object"

      # Для привязки sld к стилю. Только для sld
      if [[ "$object" == *.sld ]]; then
        name=$(basename "$object" .sld)

        # Проверка, содержит ли имя файла "dxf" или "raster"
        if [[ "$name" == *dxf* || "$name" == *raster* ]]; then
          # Логирование XML v1.0 данных перед отправкой
          xml_data="<style>
                      <name>$name</name>
                      <format>sld</format>
                      <languageVersion>
                        <version>1.0.0</version>
                      </languageVersion>
                      <filename>$objectPath</filename>
                    </style>"
        else
          # Логирование XML v1.1 данных перед отправкой
          xml_data="<style>
                      <name>$name</name>
                      <format>sld</format>
                      <languageVersion>
                        <version>1.1.0</version>
                      </languageVersion>
                      <filename>$objectPath</filename>
                    </style>"
        fi

        echo "Sending XML: $xml_data"

        # Попытка привязки стиля
        curl --location --request POST "http://localhost:8080/geoserver/rest/styles/" \
        --header 'Content-Type: application/xml' \
        --header "Authorization: Bearer $token" \
        --data "$xml_data"
      fi
    fi
  done
}

# Вызов функции для обработки файлов
upload "../initialConfig/geoserver/styles/" ""
