#!/usr/bin/env bash

# внешний логин, который выдает crgAuthCookie
EXT_USER=$1
EXT_PASS=$2

# логин GeoServer
GS_USER=$3
GS_PASS=$4

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

"$SCRIPT_DIR/takeInhale.sh" "$EXT_USER" "$EXT_PASS" "$GS_USER" "$GS_PASS" heritageprotectionzone_698 || true

"$SCRIPT_DIR/takeInhale.sh" "$EXT_USER" "$EXT_PASS" "$GS_USER" "$GS_PASS" admenp_123 || true

"$SCRIPT_DIR/takeInhale.sh" "$EXT_USER" "$EXT_PASS" "$GS_USER" "$GS_PASS" electricpowerstation_point_123
