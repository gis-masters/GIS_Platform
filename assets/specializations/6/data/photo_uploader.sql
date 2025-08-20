INSERT INTO
    CRG_TABLE_TEMPLATE (
        shape,
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
        '0101000020110F000082A4F0B7EEFB4C41B529B5F2C2225541',
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
                "id": "00104010-0012-0000-0000-000000000000",
                "size": 2319368,
                "title": "photo1.jpg"
            }
        ]'
    ),
    (
        '0101000020110F0000520F37FC60FC4C415E106D7DBD225541',
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
                "id": "00104011-0012-0000-0000-000000000000",
                "size": 1875456,
                "title": "photo2.jpg"
            }
        ]'
    ),
    (
        '0101000020110F0000ACBC42CDCAFB4C417BEBC863AF225541',
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
                "id": "00104012-0012-0000-0000-000000000000",
                "size": 1795008,
                "title": "photo3.jpg"
            }
        ]'
    ),
    (
        '0101000020110F0000CAC342CDCAFB4C415E4BC863AF225541',
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
                "id": "00104013-0012-0000-0000-000000000000",
                "size": 1834311,
                "title": "photo4.jpg"
            }
        ]'
    ),
    (
        '0101000020110F0000CA824F6A7CFC4C4153E7AA0AC7225541',
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
                "id": "00104014-0012-0000-0000-000000000000",
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
        '00104010-0012-0000-0000-000000000000',
        'photo1.jpg',
        '2319368',
        'jpg',
        '/opt/crg/specializations/6/data/files/photo1.jpg',
        'image/jpeg',
        'FEATURE',
        '{}'
    ),
    (
        '00104011-0012-0000-0000-000000000000',
        'photo2.jpg',
        '1875456',
        'jpg',
        '/opt/crg/specializations/6/data/files/photo2.jpg',
        'image/jpeg',
        'FEATURE',
        '{}'
    ),
    (
        '00104012-0012-0000-0000-000000000000',
        'photo3.jpg',
        '1795008',
        'jpg',
        '/opt/crg/specializations/6/data/files/photo3.jpg',
        'image/jpeg',
        'FEATURE',
        '{}'
    ),
    (
        '00104013-0012-0000-0000-000000000000',
        'photo4.jpg',
        '1834311',
        'jpg',
        '/opt/crg/specializations/6/data/files/photo4.jpg',
        'image/jpeg',
        'FEATURE',
        '{}'
    ),
    (
        '00104014-0012-0000-0000-000000000000',
        'photo5.jpg',
        '1928509',
        'jpg',
        '/opt/crg/specializations/6/data/files/photo5.jpg',
        'image/jpeg',
        'FEATURE',
        '{}'
    );