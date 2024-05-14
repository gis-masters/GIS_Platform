import { describe, expect, test } from '@jest/globals';

import { getProjectionTitle, projectionUnit } from './projection.util';

const srs4326 =
  'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]';
const srs28406 =
  'PROJCS["Pulkovo 1942 / Gauss-Kruger zone 6",GEOGCS["Pulkovo 1942",DATUM["Pulkovo_1942",SPHEROID["Krassowsky 1940",6378245,298.3,AUTHORITY["EPSG","7024"]],TOWGS84[23.92,-141.27,-80.9,0,0.35,0.82,-0.12],AUTHORITY["EPSG","6284"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4284"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",0],PARAMETER["central_meridian",33],PARAMETER["scale_factor",1],PARAMETER["false_easting",6500000],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AUTHORITY["EPSG","28406"]]';

describe('Получение данных системы координат из srtext(WKT)', () => {
  test('Получение системы координат из srtext при наличии только "GEOGCS"', () => {
    expect('WGS 84').toBe(getProjectionTitle(srs4326));
  });

  test('Получение системы координат из srtext при наличии "PROJCS" и "GEOGCS"', () => {
    expect('Pulkovo 1942 / Gauss-Kruger zone 6').toBe(getProjectionTitle(srs28406));
  });

  test('Получение единиц измерения (градусы) из srtext', () => {
    expect('градусы').toBe(projectionUnit(srs4326));
  });

  test('Получение единиц измерения (метры) из srtext', () => {
    expect('метры').toBe(projectionUnit(srs28406));
  });
});
