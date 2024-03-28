import { describe, expect, test } from '@jest/globals';
import { epsgTitle, epsgUnit } from './epsg';

const epsg4326 =
  'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]';
const epsg28406 =
  'PROJCS["Pulkovo 1942 / Gauss-Kruger zone 6",GEOGCS["Pulkovo 1942",DATUM["Pulkovo_1942",SPHEROID["Krassowsky 1940",6378245,298.3,AUTHORITY["EPSG","7024"]],TOWGS84[23.92,-141.27,-80.9,0,0.35,0.82,-0.12],AUTHORITY["EPSG","6284"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4284"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",0],PARAMETER["central_meridian",33],PARAMETER["scale_factor",1],PARAMETER["false_easting",6500000],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AUTHORITY["EPSG","28406"]]';

describe('Получение данных epsg из srtext', () => {
  test('Получение системы координат из srtext при наличии только "GEOGCS"', () => {
    const expectedEpsgTitle = 'WGS 84';
    const currentEpsgTitle = epsgTitle(epsg4326);

    expect(expectedEpsgTitle).toBe(currentEpsgTitle);
  });

  test('Получение системы координат из srtext при наличии "PROJCS" и "GEOGCS"', () => {
    const expectedEpsgTitle = 'Pulkovo 1942 / Gauss-Kruger zone 6';
    const currentEpsgTitle = epsgTitle(epsg28406);

    expect(expectedEpsgTitle).toBe(currentEpsgTitle);
  });

  test('Получение единиц измерения (градусы) из srtext', () => {
    const expectedEpsgUnits = 'градусы';
    const currentEpsgUnits = epsgUnit(epsg4326);

    expect(expectedEpsgUnits).toBe(currentEpsgUnits);
  });

  test('Получение единиц измерения (метры) из srtext', () => {
    const expectedEpsgUnits = 'метры';
    const currentEpsgUnits = epsgUnit(epsg28406);

    expect(expectedEpsgUnits).toBe(currentEpsgUnits);
  });
});
