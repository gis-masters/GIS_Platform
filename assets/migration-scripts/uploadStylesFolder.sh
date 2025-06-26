#!/bin/bash

login="$1"
pass="$2"

# Считываем версию из файла ../stylesMigrationVersion
version=$(cat ../stylesMigrationVersion)

# Авторизуемся и получаем токен
token=$(curl --location --request POST "http://localhost:8100/oauth/token?username=${login}&password=${pass}")
export token

# Проверка токена
if [[ -z "$token" ]]; then
    echo "Failed to retrieve token"
    exit 1
fi

# Установим пути к папкам
DIR1="/opt/crg/data/geoserver/styles/"
DIR2="../initialConfig/geoserver/styles/"

# Массивы для отсутствующих и отличающихся файлов
missing_files=()
different_files=()

# Функция для создания XML данных
xmlUpload() {
    local name="$1"
    local objectPath="$2"

    # Проверка, содержит ли имя файла "dxf" или "raster"
    if [[ "$name" == *dxf* ]] || [[ "$name" == *raster* ]]; then
        # XML v1.0 данные
        xml_data="<style>
                    <name>$name</name>
                    <format>sld</format>
                    <languageVersion>
                        <version>1.0.0</version>
                    </languageVersion>
                    <filename>$objectPath</filename>
                </style>"
    else
        # XML v1.1 данные
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

    # Привязка стиля (Создание xml)
    curl --location --request POST "http://localhost:8080/geoserver/rest/styles/" \
         --header 'Content-Type: application/xml' \
         --header "Authorization: Bearer $token" \
         --data "$xml_data"

    curl --location --request PUT "http://localhost:8080/geoserver/rest/resource/styles/${objectPath%.sld}.xml" \
         --header 'Content-Type: application/xml' \
         --header "Authorization: Bearer $token" \
         --data "$xml_data"
}

# Функция для отправки файла на сервер
fileUpload() {
    local objectPath="$1"
    local object="$2"

    # Логирование файл
    echo "Sending file: $object"

    # Отправить файл на сервер
    curl --location --request PUT "http://localhost:8080/geoserver/rest/resource/styles/$objectPath" \
         --header 'Content-Type: application/vnd.ogc.sld+xml' \
         --header "Authorization: Bearer $token" \
         --data-binary @"$object"
}

# Функция для сравнения файлов в директориях
compare_dirs() {
    local dir1="$1"
    local dir2="$2"
    local relative_path="$3"

    for file in "$dir2"/*; do
        local fileName
        fileName=$(basename "$file")
        local rel_file_path="$relative_path/$fileName"

        # Пропустить XML-файлы
        if [[ "$fileName" == *.xml ]]; then
            continue
        fi

        if [ -f "$file" ]; then
            # Проверим наличие файла с таким же именем в DIR1
            if [ -e "$dir1/$fileName" ]; then
                # Сравним содержимое файлов
                if ! cmp -s "$file" "$dir1/$fileName"; then
                    different_files+=("${rel_file_path#/}")
                    fileUpload "$rel_file_path" "$file"
                fi
            else
                missing_files+=("${rel_file_path#/}")
                fileUpload "$rel_file_path" "$file"
            fi

            # Если файл имеет расширение .sld
            if [[ "$fileName" == *.sld ]]; then
                xmlFile="${fileName%.sld}.xml"
                # Проверим наличие соответствующего XML файла
                get=$(curl --location --request GET "http://localhost:8080/geoserver/rest/styles/$xmlFile" \
                           --header "Authorization: Bearer $token" \
                           --header "Accept: application/json")
                if [[ "$get" == "No such style"* ]]; then
                    missing_files+=("${relative_path#/}/${xmlFile}")
                    xmlUpload "${fileName%.sld}" "${relative_path#/}/${fileName}"
                fi
            fi
        fi
    done
}

# Обрабатываем каждый файл и папку в указанной директории
uploadAll() {
    local sourceFolder="$1"
    local targetPath="$2"

    for object in "$sourceFolder"*; do
        objectPath="$targetPath$(basename "$object")"

        # Проверка на папку
        if [ -d "$object" ]; then
            uploadAll "$object/" "$objectPath/"
        else
            # Пропустить XML-файлы
            if [[ "$object" == *.xml ]]; then
                continue
            fi

            fileUpload "$objectPath" "$object"

            # Для привязки sld к стилю. Только для sld
            if [[ "$object" == *.sld ]]; then
                name=$(basename "$object" .sld)
                xmlUpload "${name}" "${objectPath}"
            fi
        fi
    done
}

# Проверим наличие файла stylesMigrationVersion
if [ -e "$DIR1/../stylesMigrationVersion" ]; then
    # Проверяем stylesMigrationVersion
    if grep -q "$version" "$DIR1/../stylesMigrationVersion"; then
        # Запускаем функцию для начальных директорий
        compare_dirs "$DIR1" "$DIR2" ""

        # Выведем массивы отсутствующих и отличающихся файлов
        echo "Отсутствующие файлы: " "${missing_files[@]}"
        echo "Отличающиеся файлы: " "${different_files[@]}"
    else
        uploadAll "../initialConfig/geoserver/styles/" ""
        # Записать в файл значение stylesMigrationVersion
        echo "$version" > "$DIR1/../stylesMigrationVersion"
    fi
else
    uploadAll "../initialConfig/geoserver/styles/" ""
    # Записать в файл значение stylesMigrationVersion
    echo "$version" > "$DIR1/../stylesMigrationVersion"
fi
