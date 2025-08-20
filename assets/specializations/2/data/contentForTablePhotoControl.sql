INSERT INTO CRG_TABLE_TEMPLATE (shape, sender, created_by, created_at, last_modified, name, photography_time, creation_time, label, user_fill_color, user_stroke_color, rotation, photo)
VALUES
    (public.st_transform(
        public.st_geomFromGeoJSON(
            '{"type":"Point","coordinates":[3793718.2633,5616822.3359], "crs":{"type":"name","properties":{"name":"EPSG:3857"}}}'
        ),
        3857
    ),
    2,
    NULL,
    now(),
    now(),
    '_006.jpg',
    '2023-10-20 00:00:00',
    now(),
    'Пример фотофиксации',
    'c5d3ad',
    '16919a',
    '158.5',
    '[
        {
            "id": "b577abf5-c3e9-421c-bddb-462d61e266d4",
            "size": 2319368,
            "title": "_006.jpg"
        }
    ]'),

    (public.st_transform(
        public.st_geomFromGeoJSON(
            '{"type":"Point","coordinates":[3793636.663,5617044.8237], "crs":{"type":"name","properties":{"name":"EPSG:3857"}}}'
        ),
        3857
    ),
    2,
    NULL,
    now(),
    now(),
    '_036.jpg',
    '2023-10-20 00:00:00',
    now(),
    'Пример фотофиксации',
    'c5d3ad',
    '16919a',
    '158.5',
    '[
        {
            "id": "3fcdb40d-208c-4fac-9342-292e2f9d5cf1",
            "size": 1875456,
            "title": "_036.jpg"
        }
    ]'),

    (public.st_transform(
        public.st_geomFromGeoJSON(
            '{"type":"Point","coordinates":[3793718.2633,5616822.3359], "crs":{"type":"name","properties":{"name":"EPSG:3857"}}}'
        ),
        3857
    ),
    2,
    NULL,
    now(),
    now(),
    '_067.jpg',
    '2023-10-20 00:00:00',
    now(),
    'Пример фотофиксации',
    'c5d3ad',
    '16919a',
    '158.5',
    '[
        {
            "id": "4e8d30bd-d0f4-4273-b0b5-cfe83b99ad8b",
            "size": 1795008,
            "title": "_067.jpg"
        }
    ]'),

    (public.st_transform(
        public.st_geomFromGeoJSON(
            '{"type":"Point","coordinates":[3793705.6842,5616803.1395], "crs":{"type":"name","properties":{"name":"EPSG:3857"}}}'
        ),
        3857
    ),
    2,
    NULL,
    now(),
    now(),
    '_098.jpg',
    '2023-10-20 00:00:00',
    now(),
    'Пример фотофиксации',
    'c5d3ad',
    '16919a',
    '158.5',
    '[
        {
            "id": "39ed5dd2-0d65-43fc-93db-569f13ea8754",
            "size": 1834311,
            "title": "_098.jpg"
        }
    ]'),

    (public.st_transform(
        public.st_geomFromGeoJSON(
            '{"type":"Point","coordinates":[3793563.0808,5616828.6254], "crs":{"type":"name","properties":{"name":"EPSG:3857"}}}'
        ),
        3857
    ),
    2,
    NULL,
    now(),
    now(),
    '_128.jpg',
    '2023-10-20 00:00:00',
    now(),
    'Пример фотофиксации',
    'c5d3ad',
    '16919a',
    '158.5',
    '[
        {
            "id": "128e7f80-650b-48c7-aee7-d688d24625d6",
            "size": 1928509,
            "title": "_128.jpg"
        }
    ]');


    INSERT INTO data.files (id, title, size, extension, path, content_type, resource_type, resource_qualifier)
VALUES
    (
	'b577abf5-c3e9-421c-bddb-462d61e266d4',
	'_006.jpg',
	'2319368',
	'jpg',
	'/opt/crg/file_storage/organization_42/feature/photo_uploader_3_7a9c3/18874547_photo_1068810117.jpg',
	'image/jpeg',
	'FEATURE',
	'{
  		"field": null,
  		"table": "photo_uploader_3_7a9c3",
  		"schema": "dataset_90c0f8",
  		"recordId": 18874547
	}'
    ),

    (
	'3fcdb40d-208c-4fac-9342-292e2f9d5cf1',
	'_036.jpg',
	'1875456',
	'jpg',
	'/opt/crg/file_storage/organization_42/feature/photo_uploader_3_7a9c3/18874548_photo_1475682903.jpg',
	'image/jpeg',
	'FEATURE',
	'{
  		"field": null,
  		"table": "photo_uploader_3_7a9c3",
  		"schema": "dataset_90c0f8",
  		"recordId": 18874555
	}'
    ),

    (
	'4e8d30bd-d0f4-4273-b0b5-cfe83b99ad8b',
	'_067.jpg',
	'1795008',
	'jpg',
	'/opt/crg/file_storage/organization_42/feature/photo_uploader_3_7a9c3/18874549_photo_416112565.jpg',
	'image/jpeg',
	'FEATURE',
	'{
  		"field": null,
  		"table": "photo_uploader_3_7a9c3",
  		"schema": "dataset_90c0f8",
  		"recordId": 18874549
	}'
    ),

    (
	'39ed5dd2-0d65-43fc-93db-569f13ea8754',
	'_098.jpg',
	'1834311',
	'jpg',
	'/opt/crg/file_storage/organization_42/feature/photo_uploader_3_7a9c3/18874550_photo_1099775895.jpg',
	'image/jpeg',
	'FEATURE',
	'{
  		"field": null,
  		"table": "photo_uploader_3_7a9c3",
  		"schema": "dataset_90c0f8",
  		"recordId": 18874550
	}'
    ),

    (
	'128e7f80-650b-48c7-aee7-d688d24625d6',
	'_128.jpg',
	'1928509',
	'jpg',
	'/opt/crg/file_storage/organization_42/feature/photo_uploader_3_7a9c3/18874551_photo_202662426.jpg',
	'image/jpeg',
	'FEATURE',
	'{
  		"field": null,
  		"table": "photo_uploader_3_7a9c3",
  		"schema": "dataset_90c0f8",
  		"recordId": 18874551
	}'
    );
	