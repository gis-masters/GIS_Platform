INSERT INTO data.base_maps (name, title, thumbnail_urn, type, url)
SELECT 'yaSatellite',
       'Яндекс Спутник',
       '/assets/images/thumbnail-our.jpg',
       'XYZ',
       'https://core-sat.maps.yandex.net/tiles?l=sat&lang=ru_RU&x={x}&y={y}&z={z}'
WHERE NOT EXISTS(SELECT id FROM data.base_maps WHERE name = 'yaSatellite');

INSERT INTO data.base_maps (name, title, thumbnail_urn, type, url)
SELECT 'yaMap',
       'Яндекс Карта',
       '/assets/images/thumbnail-yandex-map.jpg',
       'XYZ',
       'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&v=22.06.18-1-b220606200930&x={x}&y={y}&z={z}&scale=1&lang=ru_RU&ads=enabled'
WHERE NOT EXISTS(SELECT id FROM data.base_maps WHERE name = 'yaMap');

INSERT INTO data.base_maps (name, title, thumbnail_urn, type, url)
SELECT 'gooSatHyb',
       'Google Гибрид',
       '/assets/images/thumbnail-google-hybrid.jpg',
       'XYZ',
       'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
    WHERE NOT EXISTS(SELECT id FROM data.base_maps WHERE name = 'gooSatHyb');

UPDATE data.base_maps
SET thumbnail_urn = '/assets/images/thumbnail-esri-sputnik.jpg'
WHERE title LIKE 'ESRI Спутник' AND thumbnail_urn LIKE '/assets/images/thumbnail-our.jpg'
