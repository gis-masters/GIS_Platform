INSERT INTO data.base_maps (name, title, thumbnail_urn, type)
SELECT 'empty', 'Без подложки', '/assets/images/thumbnail-empty.jpg', 'XYZ'
WHERE NOT EXISTS(SELECT id FROM data.base_maps WHERE name = 'empty');

INSERT INTO data.base_maps (name, title, thumbnail_urn, type)
SELECT 'osm', 'Open street map', '/assets/images/thumbnail-osm.jpg', 'OSM'
WHERE NOT EXISTS(SELECT id FROM data.base_maps WHERE name = 'osm');

INSERT INTO data.base_maps (name, title, thumbnail_urn, type, url)
SELECT 'esri',
       'ESRI Карта',
       '/assets/images/thumbnail-esri.jpg',
       'XYZ',
       'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
WHERE NOT EXISTS(SELECT id FROM data.base_maps WHERE name = 'esri');

INSERT INTO data.base_maps (name, title, thumbnail_urn, type, url)
SELECT 'esriImagery',
       'ESRI Спутник',
       '/assets/images/thumbnail-our.jpg',
       'XYZ',
       'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
WHERE NOT EXISTS(SELECT id FROM data.base_maps WHERE name = 'esriImagery');
