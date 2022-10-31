UPDATE public.users
    SET password='$2a$10$LcXR3RrsUtZfPpRBspwZIuDvuglfCzcQaqXLa4ko0BTcwMKiOmoI.'
WHERE id = 1;

UPDATE public.authorities
    SET authority = 'SYSTEM_ADMIN'
WHERE authority = 'GLOBAL_ADMIN';

UPDATE public.organizations
    SET settings='{
            "downloadXml": false,
            "createProject": false,
            "downloadFiles": false,
            "dataManagement": false,
            "editProjectLayer": false,
            "createLibraryItem": false
        }';

DO
$$
    DECLARE
        orgSettingTemplate TEXT := '{
        "id": orgIdTemplate,
        "settings": orgSettingsTemplate
    }';

    BEGIN
        DROP TABLE IF EXISTS tmp_table;
        CREATE TABLE tmp_table AS
        SELECT replace(
                       replace(
                               orgSettingTemplate,
                               'orgIdTemplate',
                               id::TEXT),
                       'orgSettingsTemplate',
                       org.settings::TEXT
                   ) AS org_settings,
               *
        FROM public.organizations AS org
        WHERE id > 0;
    END
$$;

SELECT '['::TEXT || string_agg(org_settings, ', ') || ']'::TEXT
    FROM tmp_table;


WITH subquery AS (SELECT '['::TEXT || string_agg(org_settings, ', ') || ']'::TEXT AS result_sttings
                  FROM tmp_table)
UPDATE public.organizations AS org
    SET settings = subquery.result_sttings::jsonb
FROM subquery
    WHERE org.id = -1;

DROP TABLE IF EXISTS tmp_table;
