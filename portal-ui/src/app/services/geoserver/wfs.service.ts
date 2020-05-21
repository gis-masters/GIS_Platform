import { Observable, defer } from 'rxjs';
import { Coordinate } from 'ol/coordinate';
import GeometryType from 'ol/geom/GeometryType';
import { isEqual } from 'lodash';

import { CrgModels } from '../crg/models';
import { Util } from './util';
import {
  WfsFeature,
  WfsFeatureCollection,
  CoordinateEdited,
  WfsGeometry
} from './wfs-models';
import { services } from '../services';
import { serverProperties } from '../server-properties.service';

type Coord = Coordinate | Coordinate[][] | Coordinate[][][];
type CoordEdited = CoordinateEdited | CoordinateEdited[][] | CoordinateEdited[][][];

export const getFeatureById = async (complexName: string, objectId: string): Promise<WfsFeature> => {
  await services.provided;
  const { httpq } = services;
  const url = await prepareLink(complexName, objectId);
  const featureCollection: WfsFeatureCollection = await httpq.get<WfsFeatureCollection>(url);

  if (featureCollection && featureCollection.features.length > 0) {
    return featureCollection.features[0];
  } else {
    throw new Error('Not found feature by ID: ' + objectId);
  }
};

export const getFeatures = (complexName: string, requestModel?: CrgModels): Observable<WfsFeatureCollection> => {
  const params: { [key: string]: string } = {
    service: 'wfs',
    // version: '2.0.0',
    request: 'GetFeature',
    srsName: 'EPSG:3857',
    outputFormat: 'application/json',
    exceptions: 'application/json',
    typeName: complexName,
    // PROPERTYNAME: fillProp(complexName),
    sortBy: Util.generateSortParam(requestModel)
  };

  if (requestModel && requestModel.page) {
    const countRows = (requestModel.page.pageSize) ? requestModel.page.pageSize.toString() : '100';
    const offset = (requestModel.page.offset) ? requestModel.page.offset.toString() : '0';

    params.startindex = String(Number(offset) * Number(countRows));
    params.count = countRows;
  }

  const cqlFilter = Util.generateFilter(requestModel);
  if (!!cqlFilter) {
    params.CQL_FILTER = cqlFilter;
  }

  return defer(async () => {
    await services.provided;
    const { httpq } = services;
    const url = (await serverProperties.geoServerUrl) + '/wfs';
    const fCollection = await httpq.get<WfsFeatureCollection>(url, { params: params })

    return clearFeatureId(fCollection);
  });
};

/**
 * Выборка объектов слоя по XML фильтру.
 * @param xml Подготовленный, при помощи библиотеки openLayers, XML document конвертированный в строку.
 */
export const getFeaturesByXmlFilter = async (xml: string): Promise<WfsFeatureCollection> => {
  await services.provided;
  const { httpq } = services;
  const url = (await serverProperties.geoServerUrl) + '/wfs';

  return httpq.post<WfsFeatureCollection>(url, xml, { params: { exceptions: 'application/json' } });
};

export const isGeometryValid = (geometry: WfsGeometry): boolean => {
  return isCoordinateValid(geometry.coordinates.flat(5)) && !hasUnclosedPolygons(geometry);
};

const hasUnclosedPolygons = (geometry: WfsGeometry): boolean => {
  if (geometry.type === GeometryType.MULTI_POLYGON) {
    return geometry.coordinates.some(polygon => polygon.some(loop => !isEqual(loop[0], loop[loop.length - 1])))
  } else {
    return false;
  }
}

export const isCoordinateValid = (coord: Coordinate): boolean => {
  return coord.every(isDimensionValid);
};

export const isDimensionValid = (dimension: string | number): boolean => {
  return !isNaN(transformDimension(dimension));
};

export const normalizeCoordinates = (coord: CoordEdited | string | number): Coord | number => {
  if (Array.isArray(coord)) {
    return  (coord as CoordEdited[]).map(normalizeCoordinates) as Coord;
  } else {
    return transformDimension(coord);
  }
};

export const transformDimension = (dimension: number | string) => String(dimension).trim() === '' ? NaN : Number(dimension);

const prepareLink =  async (typeName: string, objectId: string): Promise<string> => {
  const workspaceName = typeName.split(':')[0];

  return (await serverProperties.geoServerUrl) + '/' + workspaceName + '/ows'
    + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + typeName
    + '&outputFormat=application%2Fjson&srsName=EPSG:3857&featureID=' + objectId;
};

const clearFeatureId = (fCollection: WfsFeatureCollection): WfsFeatureCollection => {
  fCollection.features.forEach((feature: WfsFeature) => {
    const splitElement = feature.id.split('.')[1];
    if (splitElement) {
      feature.id = splitElement;
    }
  });

  return fCollection;
};

export const getEmptyGeometry = (geometryType: GeometryType): WfsGeometry<CoordinateEdited> => {
  if (geometryType === GeometryType.POINT) {
    return {
      type: GeometryType.POINT,
      coordinates: ['', '']
    };
  }

  if (geometryType === GeometryType.MULTI_LINE_STRING) {
    return {
      type: GeometryType.MULTI_LINE_STRING,
      coordinates: [[['', ''], ['', '']]]
    };
  }

  if (geometryType === GeometryType.MULTI_POLYGON) {
    return {
      type: GeometryType.MULTI_POLYGON,
      coordinates: [[[['', ''], ['', ''], ['', ''], ['', '']]]]
    };
  }
}
