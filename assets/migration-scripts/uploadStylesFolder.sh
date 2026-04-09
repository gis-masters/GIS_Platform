#!/bin/bash

# ============================================================================
# Fields
# ============================================================================
login=""
pass=""
version=""
token=""
nestingAccounting="true"
nestedResourcesChanged="false"

stylesMigrationVersionFile="../stylesMigrationVersion"
authUrl="http://localhost:8100/oauth/token"
geoserverStylesUrl="http://localhost:8080/geoserver/rest/styles"
geoserverResourceUrl="http://localhost:8080/geoserver/rest/resource"
geoserverReloadUrl="http://localhost:8080/geoserver/rest/reload"
currentData="../initialConfig/geoserver/styles/"
stylesResourcePath="styles"

neverWorkWith=(
    "default_generic.sld"
    "default_line.sld"
    "default_point.sld"
    "default_polygon.sld"
    "default_raster.sld"
    "raster.sld"
)
specificSldOne=(
    "dxf_style.sld"
)

noContent=()
diffContent=()
withProblems=()

nestedNoContent=()
nestedDiffContent=()
nestedWithProblems=()

# ============================================================================
# Bootstrap
# ============================================================================
initArguments() {
    login="$1"
    pass="$2"
}

loadMigrationVersion() {
    version=$(cat "$stylesMigrationVersionFile")
}

authorize() {
    token=$(curl --location --request POST "${authUrl}?username=${login}&password=${pass}")
    export token

    if [[ -z "$token" ]]; then
        echo "Failed to retrieve token"
        exit 1
    fi
}

# ============================================================================
# Utilities
# ============================================================================
containsElement() {
    local expected="$1"
    shift

    local element
    for element in "$@"; do
        if [[ "$element" == "$expected" ]]; then
            return 0
        fi
    done

    return 1
}

trimTrailingNewline() {
    local content="$1"

    printf '%s' "$content"
}

resolveStyleContentType() {
    local fileName="$1"

    if containsElement "$fileName" "${specificSldOne[@]}"; then
        printf '%s' "application/vnd.ogc.sld+xml"
    else
        printf '%s' "application/vnd.ogc.se+xml"
    fi
}

resolveNestedResourcePath() {
    local resourceFile="$1"
    local relativePath="${resourceFile#${currentData}}"

    printf '%s' "${stylesResourcePath}/${relativePath}"
}

resolveNestedResourceContentType() {
    local resourceFile="$1"

    case "$resourceFile" in
        *.svg)
            printf '%s' "image/svg+xml"
            ;;
        *.png)
            printf '%s' "image/png"
            ;;
        *)
            printf '%s' "application/octet-stream"
            ;;
    esac
}

logContentDifference() {
    local styleName="$1"
    local localContent="$2"
    local remoteContent="$3"
    local localTmpFile
    local remoteTmpFile
    local localSize
    local remoteSize
    local diffPreview

    localTmpFile=$(mktemp)
    remoteTmpFile=$(mktemp)

    printf '%s' "$localContent" > "$localTmpFile"
    printf '%s' "$remoteContent" > "$remoteTmpFile"

    localSize=$(wc -c < "$localTmpFile")
    remoteSize=$(wc -c < "$remoteTmpFile")
    diffPreview=$(diff -u "$localTmpFile" "$remoteTmpFile" | sed -n '1,20p')

    echo "Log: ${styleName}.sld попал в diffContent"
    echo "Log: размер локального файла: ${localSize} байт"
    echo "Log: размер файла с геосервера: ${remoteSize} байт"
    echo "Log: первые строки diff:"
    printf '%s\n' "$diffPreview"

    rm -f "$localTmpFile" "$remoteTmpFile"
}

# ============================================================================
# Styles
# ============================================================================
checkStyleOnGeoserver() {
    local styleName="$1"
    local sldFile="$2"
    local fileName="$3"
    local styleUrl="${geoserverStylesUrl}/${styleName}"
    local styleXmlUrl="${geoserverStylesUrl}/${styleName}.xml"
    local contentType
    local response
    local responseCode
    local responseBody
    local responseBodyForLog
    local localContent
    local normalizedResponseBody
    local normalizedLocalContent
    local diagnosticResponse
    local diagnosticCode
    local diagnosticBody
    local diagnosticBodyForLog

    contentType=$(resolveStyleContentType "$fileName")

    echo "Log: проверяем стиль ${styleName}"
    echo "Log: GET ${styleUrl}"

    response=$(curl --silent --show-error --location --request GET "${styleUrl}" \
        --header "Authorization: Bearer $token" \
        --header "Accept: ${contentType}" \
        --write-out $'\n%{http_code}')

    responseCode="${response##*$'\n'}"
    responseBody="${response%$'\n'*}"

    if [[ "$responseCode" == "200" ]]; then
        echo "Log: HTTP ${responseCode}"
        echo "Log: ${styleName} есть на геосервер"

        localContent=$(cat "$sldFile")
        normalizedResponseBody=$(trimTrailingNewline "$responseBody")
        normalizedLocalContent=$(trimTrailingNewline "$localContent")

        if [[ "$normalizedResponseBody" != "$normalizedLocalContent" ]]; then
            diffContent+=("${styleName}.sld")
            logContentDifference "$styleName" "$normalizedLocalContent" "$normalizedResponseBody"
        fi
    else
        responseBodyForLog=$(printf '%s' "$responseBody" | tr '\n' ' ')
        echo "Log: HTTP ${responseCode}"
        echo "Log: ${styleName} нет на геосервере"
        echo "Log: ответ на ${styleUrl}: ${responseBodyForLog}"
        noContent+=("${styleName}.sld")

        echo "Log: диагностический GET ${styleXmlUrl}"
        diagnosticResponse=$(curl --silent --show-error --location --request GET "${styleXmlUrl}" \
            --header "Authorization: Bearer $token" \
            --header "Accept: application/xml" \
            --write-out $'\n%{http_code}')
        diagnosticCode="${diagnosticResponse##*$'\n'}"
        diagnosticBody="${diagnosticResponse%$'\n'*}"
        diagnosticBodyForLog=$(printf '%s' "$diagnosticBody" | tr '\n' ' ')

        echo "Log: диагностический HTTP ${diagnosticCode}"
        echo "Log: ответ на ${styleXmlUrl}: ${diagnosticBodyForLog}"
    fi
}

createStyleOnGeoserver() {
    local fileName="$1"
    local styleName="${fileName%.sld}"
    local sldFile="${currentData}${fileName}"
    local contentType
    local response
    local responseCode
    local responseBody
    local responseBodyForLog

    if [[ ! -f "$sldFile" ]]; then
        withProblems+=("$fileName")
        return
    fi

    contentType=$(resolveStyleContentType "$fileName")

    echo "Log: создаём стиль ${styleName} на геосервере"

    response=$(curl --silent --show-error --location --request POST "${geoserverStylesUrl}" \
        --header "Authorization: Bearer $token" \
        --header "Content-Type: ${contentType}" \
        --data-binary @"$sldFile" \
        --write-out $'\n%{http_code}')

    responseCode="${response##*$'\n'}"
    responseBody="${response%$'\n'*}"

    if [[ "$responseCode" == "200" || "$responseCode" == "201" ]]; then
        echo "Log: ${styleName} успешно создан на геосервере"
    else
        responseBodyForLog=$(printf '%s' "$responseBody" | tr '\n' ' ')
        echo "Log: не удалось создать ${styleName} на геосервере"
        echo "Log: HTTP ${responseCode}"
        echo "Log: ответ на POST ${geoserverStylesUrl}: ${responseBodyForLog}"
        withProblems+=("$fileName")
    fi
}

updateStyleOnGeoserver() {
    local fileName="$1"
    local styleName="${fileName%.sld}"
    local sldFile="${currentData}${fileName}"
    local styleUrl="${geoserverStylesUrl}/${styleName}?raw=false"
    local contentType
    local response
    local responseCode
    local responseBody
    local responseBodyForLog

    if [[ ! -f "$sldFile" ]]; then
        withProblems+=("$fileName")
        return
    fi

    contentType=$(resolveStyleContentType "$fileName")

    echo "Log: обновляем стиль ${styleName} на геосервере"

    response=$(curl --silent --show-error --location --request PUT "${styleUrl}" \
        --header "Authorization: Bearer $token" \
        --header "Content-Type: ${contentType}" \
        --data-binary @"$sldFile" \
        --write-out $'\n%{http_code}')

    responseCode="${response##*$'\n'}"
    responseBody="${response%$'\n'*}"

    if [[ "$responseCode" == "200" || "$responseCode" == "201" ]]; then
        echo "Log: ${styleName} успешно обновлён на геосервере"
    else
        responseBodyForLog=$(printf '%s' "$responseBody" | tr '\n' ' ')
        echo "Log: не удалось обновить ${styleName} на геосервере"
        echo "Log: HTTP ${responseCode}"
        echo "Log: ответ на PUT ${styleUrl}: ${responseBodyForLog}"
        withProblems+=("$fileName")
    fi
}

processTopLevelStyles() {
    local sldFile
    local fileName
    local styleName

    for sldFile in "$currentData"/*.sld; do
        if [[ ! -f "$sldFile" ]]; then
            continue
        fi

        fileName=$(basename "$sldFile")
        if containsElement "$fileName" "${neverWorkWith[@]}"; then
            continue
        fi

        styleName=$(basename "$sldFile" .sld)
        checkStyleOnGeoserver "$styleName" "$sldFile" "$fileName"
    done
}

processMissingStyles() {
    local fileName

    for fileName in "${noContent[@]}"; do
        createStyleOnGeoserver "$fileName"
    done
}

processDifferentStyles() {
    local fileName

    for fileName in "${diffContent[@]}"; do
        updateStyleOnGeoserver "$fileName"
    done
}

# ============================================================================
# Nested Resources
# ============================================================================
resolveNestingAccounting() {
    local resourceUrl="${geoserverResourceUrl}/stylesMigrationVersion"
    local response
    local responseCode
    local responseBody
    local normalizedRemoteVersion
    local normalizedLocalVersion

    response=$(curl --silent --show-error --location --request GET "${resourceUrl}" \
        --header "Authorization: Bearer $token" \
        --write-out $'\n%{http_code}')

    responseCode="${response##*$'\n'}"
    responseBody="${response%$'\n'*}"

    if [[ "$responseCode" == "200" ]]; then
        normalizedRemoteVersion=$(trimTrailingNewline "$responseBody")
        normalizedLocalVersion=$(trimTrailingNewline "$version")

        if [[ "$normalizedRemoteVersion" == "$normalizedLocalVersion" ]]; then
            nestingAccounting="false"
            echo "миграции внутренних ресурсов не нужны"
            return
        fi
    fi

    nestingAccounting="true"
    echo "запускаем внутреннии миграции"
}

checkNestedResourceOnGeoserver() {
    local resourceFile="$1"
    local resourcePath
    local resourceUrl
    local remoteTmpFile
    local responseCode

    resourcePath=$(resolveNestedResourcePath "$resourceFile")
    resourceUrl="${geoserverResourceUrl}/${resourcePath}"
    remoteTmpFile=$(mktemp)

    echo "Log: проверяем вложенный ресурс ${resourcePath}"
    echo "Log: GET ${resourceUrl}"

    responseCode=$(curl --silent --show-error --location --request GET "${resourceUrl}" \
        --header "Authorization: Bearer $token" \
        --output "$remoteTmpFile" \
        --write-out "%{http_code}")

    if [[ "$responseCode" == "200" ]]; then
        if ! cmp -s "$resourceFile" "$remoteTmpFile"; then
            nestedDiffContent+=("$resourceFile")
        fi
    else
        nestedNoContent+=("$resourceFile")
    fi

    rm -f "$remoteTmpFile"
    echo "Log: HTTP ${responseCode}"
}

createNestedResourceOnGeoserver() {
    local resourceFile="$1"
    local resourcePath
    local resourceUrl
    local contentType
    local response
    local responseCode
    local responseBody
    local responseBodyForLog

    resourcePath=$(resolveNestedResourcePath "$resourceFile")
    resourceUrl="${geoserverResourceUrl}/${resourcePath}"
    contentType=$(resolveNestedResourceContentType "$resourceFile")

    echo "Log: создаём вложенный ресурс ${resourcePath} на геосервере"

    response=$(curl --silent --show-error --location --request PUT "${resourceUrl}" \
        --header "Authorization: Bearer $token" \
        --header "Content-Type: ${contentType}" \
        --data-binary @"$resourceFile" \
        --write-out $'\n%{http_code}')

    responseCode="${response##*$'\n'}"
    responseBody="${response%$'\n'*}"

    if [[ "$responseCode" == "200" || "$responseCode" == "201" ]]; then
        nestedResourcesChanged="true"
        echo "Log: ${resourcePath} успешно создан на геосервере"
    else
        responseBodyForLog=$(printf '%s' "$responseBody" | tr '\n' ' ')
        echo "Log: не удалось создать ${resourcePath} на геосервере"
        echo "Log: HTTP ${responseCode}"
        echo "Log: ответ на PUT ${resourceUrl}: ${responseBodyForLog}"
        nestedWithProblems+=("$resourcePath")
    fi
}

replaceNestedResourceOnGeoserver() {
    local resourceFile="$1"
    local resourcePath
    local resourceUrl
    local deleteResponse
    local deleteResponseCode
    local deleteResponseBody
    local deleteResponseBodyForLog

    resourcePath=$(resolveNestedResourcePath "$resourceFile")
    resourceUrl="${geoserverResourceUrl}/${resourcePath}"

    echo "Log: удаляем вложенный ресурс ${resourcePath} на геосервере"

    deleteResponse=$(curl --silent --show-error --location --request DELETE "${resourceUrl}" \
        --header "Authorization: Bearer $token" \
        --write-out $'\n%{http_code}')

    deleteResponseCode="${deleteResponse##*$'\n'}"
    deleteResponseBody="${deleteResponse%$'\n'*}"

    if [[ "$deleteResponseCode" != "200" ]]; then
        deleteResponseBodyForLog=$(printf '%s' "$deleteResponseBody" | tr '\n' ' ')
        echo "Log: не удалось удалить ${resourcePath} на геосервере"
        echo "Log: HTTP ${deleteResponseCode}"
        echo "Log: ответ на DELETE ${resourceUrl}: ${deleteResponseBodyForLog}"
        nestedWithProblems+=("$resourcePath")
        return
    fi

    nestedResourcesChanged="true"

    createNestedResourceOnGeoserver "$resourceFile"
}

processNestedResourcesScan() {
    local resourceFile

    if [[ "$nestingAccounting" != "true" ]]; then
        return
    fi

    while IFS= read -r resourceFile; do
        checkNestedResourceOnGeoserver "$resourceFile"
    done < <(find "$currentData" -type f \( -name '*.svg' -o -name '*.png' \))
}

processMissingNestedResources() {
    local resourceFile

    for resourceFile in "${nestedNoContent[@]}"; do
        createNestedResourceOnGeoserver "$resourceFile"
    done
}

processDifferentNestedResources() {
    local resourceFile

    for resourceFile in "${nestedDiffContent[@]}"; do
        replaceNestedResourceOnGeoserver "$resourceFile"
    done
}

applyNestedResourcesChanges() {
    if [[ "$nestingAccounting" != "true" ]]; then
        return
    fi

    processMissingNestedResources
    processDifferentNestedResources
}

uploadStylesMigrationVersion() {
    local resourceUrl="${geoserverResourceUrl}/stylesMigrationVersion"
    local response
    local responseCode
    local responseBody
    local responseBodyForLog

    if [[ "$nestingAccounting" != "true" ]]; then
        return
    fi

    if [[ ${#nestedWithProblems[@]} -ne 0 ]]; then
        return
    fi

    echo "Log: обновляем stylesMigrationVersion на геосервере"

    response=$(curl --silent --show-error --location --request PUT "${resourceUrl}" \
        --header "Authorization: Bearer $token" \
        --data-binary @"$stylesMigrationVersionFile" \
        --write-out $'\n%{http_code}')

    responseCode="${response##*$'\n'}"
    responseBody="${response%$'\n'*}"

    if [[ "$responseCode" == "200" || "$responseCode" == "201" ]]; then
        echo "Log: stylesMigrationVersion успешно обновлён на геосервере"
    else
        responseBodyForLog=$(printf '%s' "$responseBody" | tr '\n' ' ')
        echo "Log: не удалось обновить stylesMigrationVersion на геосервере"
        echo "Log: HTTP ${responseCode}"
        echo "Log: ответ на PUT ${resourceUrl}: ${responseBodyForLog}"
        nestedWithProblems+=("stylesMigrationVersion")
    fi
}

reloadGeoserverIfNeeded() {
    local response
    local responseCode
    local responseBody
    local responseBodyForLog

    if [[ "$nestedResourcesChanged" != "true" ]]; then
        return
    fi

    echo "Log: перезагружаем GeoServer"

    response=$(curl --silent --show-error --location --request POST "${geoserverReloadUrl}" \
        --header "Authorization: Bearer $token" \
        --write-out $'\n%{http_code}')

    responseCode="${response##*$'\n'}"
    responseBody="${response%$'\n'*}"

    if [[ "$responseCode" == "200" || "$responseCode" == "201" ]]; then
        echo "Log: GeoServer успешно перезагружен"
    else
        responseBodyForLog=$(printf '%s' "$responseBody" | tr '\n' ' ')
        echo "Log: не удалось перезагрузить GeoServer"
        echo "Log: HTTP ${responseCode}"
        echo "Log: ответ на POST ${geoserverReloadUrl}: ${responseBodyForLog}"
        nestedWithProblems+=("reload")
    fi
}

# ============================================================================
# Report
# ============================================================================
printSummary() {
    echo "SLD файлов которых нет: ${noContent[*]}"
    echo "SLD файлы которые есть но отличаются: ${diffContent[*]}"
    echo "SLD файлы с проблемами: ${withProblems[*]}"
    echo "Вложенных файлов которых нет: ${nestedNoContent[*]}"
    echo "Вложенные файлы которые есть но отличаются: ${nestedDiffContent[*]}"
    echo "Вложенные файлы с проблемами: ${nestedWithProblems[*]}"
}

# ============================================================================
# Main
# ============================================================================
main() {
    initArguments "$@"
    authorize

    processTopLevelStyles
    processMissingStyles
    processDifferentStyles

    loadMigrationVersion
    resolveNestingAccounting
    processNestedResourcesScan
    applyNestedResourcesChanges
    uploadStylesMigrationVersion
    reloadGeoserverIfNeeded

    printSummary
}

main "$@"
