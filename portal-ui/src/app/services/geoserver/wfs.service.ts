import { Coordinate } from 'ol/coordinate';
import GeometryType from 'ol/geom/GeometryType';
import { isEqual } from 'lodash';

import { WfsFeature, WfsFeatureCollection, CoordinateEdited, WfsGeometry } from './wfs.models';
import { getGeoServerUrl, getWfsUrl } from '../server-urls.service';
import { generateFilter, generateSortParam } from './wfs.util';
import { CrgModels } from '../models';
import { http } from '../http.service';

export const WFS_FEATURE_ID_DELIMITER = '.';

type Coords = Coordinate | Coordinate[][] | Coordinate[][][];
type CoordsEdited = CoordinateEdited | CoordinateEdited[][] | CoordinateEdited[][][];

export async function getFeatureById(complexName: string, objectId: string): Promise<WfsFeature> {
  const url = await prepareLink(complexName, objectId);
  const featureCollection: WfsFeatureCollection = await http.get<WfsFeatureCollection>(url);

  if (featureCollection && featureCollection.features.length > 0) {
    return featureCollection.features[0];
  } else {
    throw new Error('Not found feature by ID: ' + objectId);
  }
}

export async function getFeatures(
  complexName: string,
  requestModel?: CrgModels,
  srsName?: string
): Promise<WfsFeatureCollection> {
  const params: { [key: string]: string } = {
    service: 'wfs',
    // version: '2.0.0',
    request: 'GetFeature',
    outputFormat: 'application/json',
    exceptions: 'application/json',
    typeName: complexName,
    // PROPERTYNAME: fillProp(complexName),
    sortBy: generateSortParam(requestModel),
    srsName
  };

  if (requestModel && requestModel.page) {
    const countRows = requestModel.page.pageSize ? requestModel.page.pageSize.toString() : '100';
    const offset = requestModel.page.offset ? requestModel.page.offset.toString() : '0';

    params.startindex = String(Number(offset) * Number(countRows));
    params.count = countRows;
  }

  const cqlFilter = generateFilter(requestModel);
  if (!!cqlFilter) {
    params.CQL_FILTER = cqlFilter;
  }
  const fCollection = await http.get<WfsFeatureCollection>(await getWfsUrl(), { params: params });

  return clearFeatureId(fCollection);
}

/**
 * Выборка объектов слоя по XML фильтру.
 * @param xml Подготовленный, при помощи библиотеки openLayers, XML document конвертированный в строку.
 */
export async function getFeaturesByXmlFilter(xml: string): Promise<WfsFeatureCollection> {
  return http.post<WfsFeatureCollection>(await getWfsUrl(), xml, {
    headers: { 'Content-type': 'application/xml' },
    params: { exceptions: 'application/json' }
  });
}

export async function getFeaturesById(ids: string[], namespace: string): Promise<WfsFeature[]> {
  const headers = { 'Content-type': 'application/json' };
  const params = {
    outputFormat: 'application/json',
    service: 'wfs',
    version: '2.0.0',
    request: 'GetFeature',
    typeNames: namespace,
    featureID: ids.join(',')
  };

  const { features } = await http.get<WfsFeatureCollection>(await getWfsUrl(), { headers, params });

  return features;
}

export function isGeometryValid(geometry: WfsGeometry): boolean {
  return isCoordinateValid(geometry.coordinates.flat(5) as Coordinate) && !hasUnclosedPolygons(geometry);
}

function hasUnclosedPolygons(geometry: WfsGeometry): boolean {
  if (geometry.type === GeometryType.MULTI_POLYGON) {
    return geometry.coordinates.some(polygon => polygon.some(loop => !isEqual(loop[0], loop[loop.length - 1])));
  } else {
    return false;
  }
}

export function isCoordinateValid(coord: Coordinate): boolean {
  return coord?.every(isDimensionValid);
}

export function isDimensionValid(dimension: string | number): boolean {
  return !isNaN(transformDimension(dimension));
}

export function normalizeCoordinates(coord: CoordsEdited | string | number): Coords | number {
  if (Array.isArray(coord)) {
    return (coord as CoordsEdited[]).map(normalizeCoordinates) as Coords;
  } else {
    return transformDimension(coord);
  }
}

export function transformDimension(dimension: number | string) {
  return String(dimension).trim() === '' ? NaN : Number(dimension);
}

async function prepareLink(typeName: string, objectId: string): Promise<string> {
  const workspaceName = typeName.split(':')[0];

  return (
    (await getGeoServerUrl()) +
    '/' +
    workspaceName +
    '/ows' +
    '?service=WFS&version=1.0.0&request=GetFeature&typeName=' +
    typeName +
    '&outputFormat=application%2Fjson&featureID=' +
    objectId
  );
}

function clearFeatureId(fCollection: WfsFeatureCollection): WfsFeatureCollection {
  fCollection.features.forEach((feature: WfsFeature) => {
    const splitElement = feature.id.split('.')[1];
    if (splitElement) {
      feature.id = splitElement;
    }
  });

  return fCollection;
}
