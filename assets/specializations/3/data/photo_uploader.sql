INSERT INTO
    CRG_TABLE_TEMPLATE (
        shape,
        sender,
        created_by,
        created_at,
        last_modified,
        name,
        photography_time,
        creation_time,
        label,
        user_fill_color,
        user_stroke_color,
        rotation,
        photo
    )
VALUES
    (
        public.st_transform(
            public.st_geomFromGeoJSON(
                '{"type":"Point","coordinates":[3739004.2321,5542401.2076], "crs":{"type":"name","properties":{"name":"EPSG:3857"}}}'
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
                "id": "00104001-0012-0000-0000-000000000000",
                "size": 2319368,
                "title": "photo1.jpg"
            }
        ]'
    ),
    (
        public.st_transform(
            public.st_geomFromGeoJSON(
                '{"type":"Point","coordinates":[3739204.2321,5542231.2076], "crs":{"type":"name","properties":{"name":"EPSG:3857"}}}'
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
                "id": "00104002-0012-0000-0000-000000000000",
                "size": 1875456,
                "title": "photo2.jpg"
            }
        ]'
    ),
    (
        public.st_transform(
            public.st_geomFromGeoJSON(
                '{"type":"Point","coordinates":[3739004.2321,5542201.2076], "crs":{"type":"name","properties":{"name":"EPSG:3857"}}}'
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
                "id": "00104003-0012-0000-0000-000000000000",
                "size": 1795008,
                "title": "photo3.jpg"
            }
        ]'
    ),
    (
        public.st_transform(
            public.st_geomFromGeoJSON(
                '{"type":"Point","coordinates":[3739138.2321,5542351.2076], "crs":{"type":"name","properties":{"name":"EPSG:3857"}}}'
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
                "id": "00104004-0012-0000-0000-000000000000",
                "size": 1834311,
                "title": "photo4.jpg"
            }
        ]'
    ),
    (
        public.st_transform(
            public.st_geomFromGeoJSON(
                '{"type":"Point","coordinates":[3739234.2321,5542201.2076], "crs":{"type":"name","properties":{"name":"EPSG:3857"}}}'
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
                "id": "00104005-0012-0000-0000-000000000000",
                "size": 1928509,
                "title": "photo5.jpg"
            }
        ]'
    );

INSERT INTO
    data.files (
        id,
        title,
        size,
        extension,
        path,
        content_type,
        resource_type, 
        resource_qualifier
    )
VALUES
    (
        '00104001-0012-0000-0000-000000000000',
        'photo1.jpg',
        '2319368',
        'jpg',
        '/opt/crg/specializations/3/files/photo1.jpg',
        'image/jpeg',
        'FEATURE',
        '{}'
    ),
    (
        '00104002-0012-0000-0000-000000000000',
        'photo2.jpg',
        '1875456',
        'jpg',
        '/opt/crg/specializations/3/files/photo2.jpg',
        'image/jpeg',
        'FEATURE',
        '{}'
    ),
    (
        '00104003-0012-0000-0000-000000000000',
        'photo3.jpg',
        '1795008',
        'jpg',
        '/opt/crg/specializations/3/files/photo3.jpg',
        'image/jpeg',
        'FEATURE',
        '{}'
    ),
    (
        '00104004-0012-0000-0000-000000000000',
        'photo4.jpg',
        '1834311',
        'jpg',
        '/opt/crg/specializations/3/files/photo4.jpg',
        'image/jpeg',
        'FEATURE',
        '{}'
    ),
    (
        '00104005-0012-0000-0000-000000000000',
        'photo5.jpg',
        '1928509',
        'jpg',
        '/opt/crg/specializations/3/files/photo5.jpg',
        'image/jpeg',
        'FEATURE',
        '{}'
    );