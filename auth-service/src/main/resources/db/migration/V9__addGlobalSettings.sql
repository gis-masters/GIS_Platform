INSERT INTO public.organizations(id, name, status, created_at, last_modified, settings)
SELECT -1,
       'zif',
       'PROVISIONED',
       now(),
       now(),
       '{
          "loadXml": true,
          "sedDialog": true,
          "project": {
            "create": true
          }
       }'
WHERE NOT EXISTS(SELECT id FROM public.organizations WHERE id = '-1');
