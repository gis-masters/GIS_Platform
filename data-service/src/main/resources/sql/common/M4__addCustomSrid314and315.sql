INSERT INTO public.spatial_ref_sys(srid, auth_name, auth_srid, srtext, proj4text)
SELECT '314314',
       'fiz',
       '314314',
       'PROJCS["Pulkovo 1942 / CS63 zone X5",GEOGCS["Pulkovo 1942",DATUM["Pulkovo_1942",SPHEROID["Krassowsky 1940",6378245,298.3,AUTHORITY["EPSG","7024"]],TOWGS84[23.92,-141.27,-80.9,0,0.35,0.82,-0.12],AUTHORITY["EPSG","6284"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4284"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",0.08333333333333333],PARAMETER["central_meridian",35.5],PARAMETER["scale_factor",1],PARAMETER["false_easting",5300000],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AUTHORITY["EPSG","7829"]]',
       '+proj=tmerc +lat_0=0.08333333333333333 +lon_0=35.5 +k=1 +x_0=5300000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,0,0.35,0.82,-0.12 +units=m +no_defs'
WHERE NOT EXISTS(SELECT srid FROM public.spatial_ref_sys WHERE srid = 314314);

INSERT INTO public.spatial_ref_sys(srid, auth_name, auth_srid, srtext, proj4text)
SELECT '314315',
       'fiz',
       '314315',
       'PROJCS["Pulkovo 1942 / CS63 zone X4",GEOGCS["Pulkovo 1942",DATUM["Pulkovo_1942",SPHEROID["Krassowsky 1940",6378245,298.3,AUTHORITY["EPSG","7024"]],TOWGS84[23.92,-141.27,-80.9,0,0.35,0.82,-0.12],AUTHORITY["EPSG","6284"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4284"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",0.08333333333333333],PARAMETER["central_meridian",32.5],PARAMETER["scale_factor",1],PARAMETER["false_easting",4300000],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AUTHORITY["EPSG","7828"]]',
       '+proj=tmerc +lat_0=0.08333333333333333 +lon_0=35.5 +k=1 +x_0=5300000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,0,0.35,0.82,-0.12 +units=m +no_defs'
WHERE NOT EXISTS(SELECT srid FROM public.spatial_ref_sys WHERE srid = 314315);
