-- Удаление устаревших шаблонов схем НСПД (имена с суффиксом _nspd).
-- Новые шаблоны с префиксом nspd_ поднимаются из system_schemas/*.json.
DELETE FROM data.schemas
WHERE name IN (
    'ter_zone_nspd',
    'zouit_nspd',
    'zu_nspd',
    'border_nspd',
    'oks_nspd'
);
