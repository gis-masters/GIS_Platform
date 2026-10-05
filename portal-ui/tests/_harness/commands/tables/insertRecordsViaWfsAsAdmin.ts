import { type Coordinate } from 'ol/coordinate';

import { usersClient } from '../../../../src/app/services/auth/users/users.client';
import { PropertyType } from '../../../../src/app/services/data/schema/schema.models';
import { environment } from '../../../../src/app/services/environment';
import { buildComplexName } from '../../../../src/app/services/geoserver/featureType/featureType.util';
import { wfsClient } from '../../../../src/app/services/geoserver/wfs/wfs.client';
import {
  GeometryType,
  type NewWfsFeature,
  type WfsMultiPolygonGeometry
} from '../../../../src/app/services/geoserver/wfs/wfs.models';
import { isAxiosError } from '../../../../src/app/services/util/typeGuards/isAxiosError';
import { requestAsAdmin } from '../requestAs';
import { getVectorTable } from './getVectorTable';

export async function insertRecordsViaWfsAsAdmin(
  datasetIdentifier: string,
  vectorTableIdentifier: string,
  features: NewWfsFeature[]
): Promise<void> {
  if (!environment.scratchWorkspaceName) {
    throw new Error('Не задан scratchWorkspaceName');
  }

  const table = await getVectorTable(datasetIdentifier, vectorTableIdentifier);
  if (!table.crs) {
    throw new Error(`У таблицы "${vectorTableIdentifier}" нет СК`);
  }

  const geometryProperty = table.schema.properties?.find(property => property.propertyType === PropertyType.GEOMETRY);
  if (!geometryProperty) {
    throw new Error(`В схеме таблицы "${vectorTableIdentifier}" нет поля геометрии`);
  }

  const currentUser = await requestAsAdmin(usersClient.getCurrentUser);
  const workspace = `${environment.scratchWorkspaceName}_${currentUser.orgId}`;
  const typeName = buildComplexName(workspace, vectorTableIdentifier, table.crs);
  const featureTypeName = typeName.split(':')[1];
  if (!featureTypeName) {
    throw new Error(`Некорректный typeName "${typeName}"`);
  }

  for (const feature of features) {
    const xml = buildInsertXml(workspace, featureTypeName, geometryProperty.name, table.crs, feature);

    try {
      const response = await requestAsAdmin(wfsClient.update, xml);
      assertWfsInserted(response);
    } catch (error) {
      if (!isAxiosError(error)) {
        throw error;
      }

      throw new Error(`WFS Insert не записал объект: ${errorBody(error.response?.data)}`, { cause: error });
    }
  }
}

function buildInsertXml(
  workspace: string,
  featureTypeName: string,
  geometryName: string,
  crs: string,
  feature: NewWfsFeature
): string {
  const geometry = feature.geometry;
  if (!geometry) {
    throw new Error('У объекта для WFS Insert нет геометрии');
  }
  if (geometry.type !== GeometryType.MULTI_POLYGON) {
    throw new Error(`Геометрия ${geometry.type} не поддержана для WFS Insert`);
  }

  const properties = propertiesXml(workspace, geometryName, feature.properties);
  const geometryXml = multiPolygonGml(geometry, crs);

  return (
    '<wfs:Transaction service="WFS" version="1.1.0" xmlns:wfs="http://www.opengis.net/wfs" ' +
    `xmlns:gml="http://www.opengis.net/gml" xmlns:${workspace}="http://${workspace}">` +
    `<wfs:Insert><${workspace}:${featureTypeName}>${properties}` +
    `<${workspace}:${geometryName}>${geometryXml}</${workspace}:${geometryName}>` +
    `</${workspace}:${featureTypeName}></wfs:Insert></wfs:Transaction>`
  );
}

function propertiesXml(workspace: string, geometryName: string, properties: Record<string, unknown>): string {
  return Object.entries(properties)
    .filter(([name, value]) => name !== geometryName && value !== undefined && value !== null)
    .map(([name, value]) => {
      if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
        throw new TypeError(`Свойство ${name} нельзя записать через WFS Insert`);
      }

      return `<${workspace}:${name}>${escapeXml(String(value))}</${workspace}:${name}>`;
    })
    .join('');
}

function multiPolygonGml(geometry: WfsMultiPolygonGeometry, crs: string): string {
  const polygons = geometry.coordinates.map(polygonGml).join('');

  return `<gml:MultiPolygon srsName="${crs}">${polygons}</gml:MultiPolygon>`;
}

function polygonGml(rings: Coordinate[][]): string {
  const [exterior, ...interiors] = rings;
  if (!exterior) {
    throw new Error('У полигона нет внешнего кольца');
  }

  const holes = interiors.map(ring => ringGml('interior', ring)).join('');

  return `<gml:polygonMember><gml:Polygon>${ringGml('exterior', exterior)}${holes}</gml:Polygon></gml:polygonMember>`;
}

function ringGml(kind: 'exterior' | 'interior', ring: Coordinate[]): string {
  const posList = ring.map(formatPosition).join(' ');

  return `<gml:${kind}><gml:LinearRing><gml:posList>${posList}</gml:posList></gml:LinearRing></gml:${kind}>`;
}

function formatPosition(point: Coordinate): string {
  const [x, y] = point;
  if (x === undefined || y === undefined) {
    throw new Error('В кольце нет пары координат');
  }

  return `${x} ${y}`;
}

function assertWfsInserted(response: string): void {
  if (response.includes('ExceptionReport') || !response.includes('totalInserted>1<')) {
    throw new Error(`WFS Insert не добавил объект: ${response}`);
  }
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function errorBody(data: unknown): string {
  if (typeof data === 'string') {
    return data;
  }

  try {
    return JSON.stringify(data);
  } catch {
    return 'не удалось прочитать ответ WFS';
  }
}
