UPDATE data.base_maps
SET projection = 'EPSG:3395'
WHERE projection IS NULL
  AND url IN (
              'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&v=22.06.18-1-b220606200930&x={x}&y={y}&z={z}&scale=1&lang=ru_RU&ads=enabled',
              'https://core-sat.maps.yandex.net/tiles?l=sat&lang=ru_RU&x={x}&y={y}&z={z}'
    );