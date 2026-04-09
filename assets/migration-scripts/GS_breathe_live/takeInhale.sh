#!/usr/bin/env bash
set -euo pipefail

BASE_URL='http://localhost:8080'
API_URL='http://localhost'

# внешний логин, который выдает crgAuthCookie
EXT_USER=$1
EXT_PASS=$2

# логин GeoServer
GS_USER=$3
GS_PASS=$4

STYLE_NAME=$5

COOKIE_JAR='./cookies.txt'
STYLE_PAGE_HTML='./style_page.html'
PREVIEW_XML='./preview.xml'
OAUTH_HEADERS='./oauth_headers.txt'
PREVIEW_HEADERS='./preview_headers.txt'
LEGEND_HEADERS='./legend_headers.txt'
OUT_FILE="${STYLE_NAME}_legend.png"
EDITOR_FILE='./style_editor.xml'

rm -f "$COOKIE_JAR" "$STYLE_PAGE_HTML" "$PREVIEW_XML" "$EDITOR_FILE" \
      "$OAUTH_HEADERS" "$PREVIEW_HEADERS" "$LEGEND_HEADERS" "$OUT_FILE"

echo '1) Получаю crgAuthCookie через oauth...'
curl -sS -L \
  -D "$OAUTH_HEADERS" \
  -c "$COOKIE_JAR" \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode "username=$EXT_USER" \
  --data-urlencode "password=$EXT_PASS" \
  --data-urlencode 'grant_type=password' \
  "$API_URL/api/oauth/token" \
  > /dev/null

if ! grep -q 'crgAuthCookie' "$COOKIE_JAR"; then
  echo 'Не удалось получить crgAuthCookie'
  echo 'Заголовки oauth ответа:'
  sed -n '1,30p' "$OAUTH_HEADERS"
  exit 1
fi

echo '2) Получаю стартовую JSESSIONID GeoServer...'
curl -sS \
  -c "$COOKIE_JAR" \
  -b "$COOKIE_JAR" \
  "$BASE_URL/geoserver/web/?0" \
  > /dev/null

echo '3) Логинюсь в GeoServer...'
curl -sS -L \
  -c "$COOKIE_JAR" \
  -b "$COOKIE_JAR" \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H "Origin: $BASE_URL" \
  -H "Referer: $BASE_URL/geoserver/web/?0" \
  --data-urlencode "username=$GS_USER" \
  --data-urlencode "password=$GS_PASS" \
  "$BASE_URL/geoserver/j_spring_security_check" \
  > /dev/null

echo '4) Открываю страницу стиля...'
for attempt in 1 2 3; do
  curl -sS -L \
    -c "$COOKIE_JAR" \
    -b "$COOKIE_JAR" \
    "$BASE_URL/geoserver/web/wicket/bookmarkable/org.geoserver.wms.web.data.StyleEditPage?name=$STYLE_NAME" \
    > "$STYLE_PAGE_HTML"

  if grep -q 'org.geoserver.wms.web.data.StyleEditPage' "$STYLE_PAGE_HTML"; then
    break
  fi

  if [[ "$attempt" -eq 3 ]]; then
    echo 'Не удалось открыть страницу StyleEditPage после повторных попыток'
    sed -n '1,80p' "$STYLE_PAGE_HTML"
    exit 1
  fi

  echo "Страница стиля вернула форму логина, повторяю вход (попытка $((attempt + 1))/3)..."
  curl -sS -L \
    -c "$COOKIE_JAR" \
    -b "$COOKIE_JAR" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -H "Origin: $BASE_URL" \
    -H "Referer: $BASE_URL/geoserver/web/?0" \
    --data-urlencode "username=$GS_USER" \
    --data-urlencode "password=$GS_PASS" \
    "$BASE_URL/geoserver/j_spring_security_check" \
    > /dev/null
done

echo '5) Достаю текущий Wicket page id...'
PAGE_ID="$(
  sed -n 's/.*Wicket\.Ajax\.baseUrl="wicket\/bookmarkable\/org\.geoserver\.wms\.web\.data\.StyleEditPage?\([0-9][0-9]*\)&amp;name=.*/\1/p' "$STYLE_PAGE_HTML" \
  | head -n1
)"

if [[ -z "${PAGE_ID:-}" ]]; then
  echo 'Не удалось извлечь page id'
  exit 1
fi

echo "Найден page id: $PAGE_ID"

REFERER="$BASE_URL/geoserver/web/wicket/bookmarkable/org.geoserver.wms.web.data.StyleEditPage?${PAGE_ID}&name=${STYLE_NAME}"
PREVIEW_URL="$BASE_URL/geoserver/web/wicket/bookmarkable/org.geoserver.wms.web.data.StyleEditPage?${PAGE_ID}-1.0-styleForm-context-panel-preview&name=${STYLE_NAME}"
WICKET_BASE_URL="wicket/bookmarkable/org.geoserver.wms.web.data.StyleEditPage?${PAGE_ID}&name=${STYLE_NAME}"

STYLE_FORM_NAME="$(
  sed -n 's/.*<input class="text" value="\([^"]*\)" name="context:panel:name".*/\1/p' "$STYLE_PAGE_HTML" \
  | head -n1
)"

WORKSPACE_VALUE="$(
  sed -n '/<select name="context:panel:workspace"/,/<\/select>/ s/.*<option selected="selected" value="\([^"]*\)".*/\1/p' "$STYLE_PAGE_HTML" \
  | head -n1
)"

TEMPLATES_VALUE="$(
  sed -n '/<select name="context:panel:templates"/,/<\/select>/ s/.*<option selected="selected" value="\([^"]*\)".*/\1/p' "$STYLE_PAGE_HTML" \
  | head -n1
)"

EXISTING_STYLE_VALUE="$(
  sed -n '/<select[^>]*name="context:panel:existingStyles"/,/<\/select>/ s/.*<option selected="selected" value="\([^"]*\)".*/\1/p' "$STYLE_PAGE_HTML" \
  | head -n1
)"

LEGEND_ONLINE_RESOURCE="$(
  sed -n 's/.*name="context:panel:legendPanel:externalGraphicContainer:list:onlineResource"[^>]*value="\([^"]*\)".*/\1/p' "$STYLE_PAGE_HTML" \
  | head -n1
)"

LEGEND_WIDTH="$(
  sed -n 's/.*name="context:panel:legendPanel:externalGraphicContainer:list:width"[^>]*value="\([^"]*\)".*/\1/p' "$STYLE_PAGE_HTML" \
  | head -n1
)"

LEGEND_HEIGHT="$(
  sed -n 's/.*name="context:panel:legendPanel:externalGraphicContainer:list:height"[^>]*value="\([^"]*\)".*/\1/p' "$STYLE_PAGE_HTML" \
  | head -n1
)"

LEGEND_FORMAT="$(
  sed -n 's/.*name="context:panel:legendPanel:externalGraphicContainer:list:format"[^>]*value="\([^"]*\)".*/\1/p' "$STYLE_PAGE_HTML" \
  | head -n1
)"

sed -n '/<textarea name="styleEditor:editorContainer:editorParent:editor" id="editor">/,/<\/textarea>/p' "$STYLE_PAGE_HTML" \
  | sed '1s/.*<textarea[^>]*>//;$s/<\/textarea>.*//' \
  | sed 's/&lt;/</g; s/&gt;/>/g; s/&quot;/"/g; s/&#39;/'"'"'/g; s/&amp;/\&/g' \
  > "$EDITOR_FILE"

echo '6) Дёргаю preview...'
curl -sS \
  -D "$PREVIEW_HEADERS" \
  -o "$PREVIEW_XML" \
  -b "$COOKIE_JAR" \
  -H 'Wicket-Ajax: true' \
  -H "Wicket-Ajax-BaseURL: $WICKET_BASE_URL" \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'Accept: text/xml, */*; q=0.01' \
  -H "Origin: $BASE_URL" \
  -H "Referer: $REFERER" \
  -F "context:panel:name=${STYLE_FORM_NAME:-$STYLE_NAME}" \
  -F "context:panel:workspace=${WORKSPACE_VALUE:-}" \
  -F "context:panel:templates=${TEMPLATES_VALUE:-}" \
  -F "context:panel:existingStyles=${EXISTING_STYLE_VALUE:-}" \
  -F "context:panel:legendPanel:externalGraphicContainer:list:onlineResource=${LEGEND_ONLINE_RESOURCE:-}" \
  -F "context:panel:legendPanel:externalGraphicContainer:list:width=${LEGEND_WIDTH:-0}" \
  -F "context:panel:legendPanel:externalGraphicContainer:list:height=${LEGEND_HEIGHT:-0}" \
  -F "context:panel:legendPanel:externalGraphicContainer:list:format=${LEGEND_FORMAT:-}" \
  -F "styleEditor:editorContainer:editorParent:editor=<${EDITOR_FILE}" \
  "$PREVIEW_URL"

LEGEND_RELATIVE_URL="$(
  sed -n 's/.*<img id="[^"]*" src="\([^"]*\)".*/\1/p' "$PREVIEW_XML" \
  | sed 's/&amp;/\&/g' \
  | head -n1
)"

if [[ -z "${LEGEND_RELATIVE_URL:-}" ]]; then
  echo 'Не удалось извлечь URL legendImg из AJAX-ответа'
  sed -n '1,80p' "$PREVIEW_HEADERS"
  sed -n '1,120p' "$PREVIEW_XML"
  exit 1
fi

case "$LEGEND_RELATIVE_URL" in
  ./*)
    LEGEND_URL="$BASE_URL/geoserver/web/wicket/bookmarkable/${LEGEND_RELATIVE_URL#./}"
    ;;
  http://*|https://*)
    LEGEND_URL="$LEGEND_RELATIVE_URL"
    ;;
  *)
    LEGEND_URL="$BASE_URL/geoserver/web/wicket/bookmarkable/$LEGEND_RELATIVE_URL"
    ;;
esac

echo "Найден URL legendImg: $LEGEND_RELATIVE_URL"

echo "7) Качаю legendImg..."
curl -sS \
  -D "$LEGEND_HEADERS" \
  -b "$COOKIE_JAR" \
  -H "Referer: $REFERER" \
  -H 'Accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8' \
  -o "$OUT_FILE" \
  "$LEGEND_URL"

echo '8) Проверяю ответ...'
sed -n '1,20p' "$LEGEND_HEADERS"

if ! grep -qi '^Content-Type: image/png' "$LEGEND_HEADERS"; then
  echo 'Сервер вернул не PNG'
  sed -n '1,80p' "$OUT_FILE"
  exit 1
fi

file "$OUT_FILE"
ls -lh "$OUT_FILE"
