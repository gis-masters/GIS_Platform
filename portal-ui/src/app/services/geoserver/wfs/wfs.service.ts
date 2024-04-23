import { chunk } from 'lodash';
import { and, intersects } from 'ol/format/filter';
import { MultiPolygon } from 'ol/geom';

import { attributesTableStore } from '../../../stores/AttributesTable.store';
import { currentProject } from '../../../stores/CurrentProject.store';
import { mapStore } from '../../../stores/Map.store';
import { applyView, getGeometryFieldName } from '../../data/schema/schema.utils';
import { CrgVectorLayer } from '../../gis/layers/layers.models';
import { getLayerSchema } from '../../gis/layers/layers.service';
import { MapSelectionTypes } from '../../map/map.models';
import { PageOptions } from '../../models';
import { WFS } from '../../ol/WFS';
import { cql2ol } from '../../util/cql2ol';
import { cqlBuild } from '../../util/cqlBuild';
import { cqlConcat } from '../../util/cqlConcat';
import { cqlParse } from '../../util/cqlParse';
import { filterFeatures } from '../../util/filterObjects';
import { Mime } from '../../util/Mime';
import {
  extractFeatureId,
  extractFeatureTypeNameFromComplexName,
  extractTableNameFromComplexName
} from '../feature.util';
import { olProjection } from '../projections.service';
import { wfsClient } from './wfs.client';
import { CoordinateEdited, WfsFeature, WfsFeatureCollection } from './wfs.models';
import { generateWfsSortParam, getEmptyGeometry } from './wfs.util';

function getBaseWfsParams(layer: CrgVectorLayer): { [key: string]: string } {
  if (!layer.complexName) {
    throw new Error('Нет complexName');
  }

  return layer.nativeCRS
    ? {
        service: 'wfs',
        request: 'GetFeature',
        outputFormat: Mime.JSON,
        exceptions: Mime.JSON,
        typeName: layer.complexName,
        srsName: layer.nativeCRS
      }
    : {
        service: 'wfs',
        request: 'GetFeature',
        outputFormat: Mime.JSON,
        exceptions: Mime.JSON,
        typeName: layer.complexName
      };
}

const MAX_PAGE_SIZE = 10_000;

/**
 * Get features by wfs
 * @returns {Promise<[WfsFeature[], number, number, number]>} features, total pages, features matched, features total
 */
export async function getFeatures(
  layer: CrgVectorLayer,
  pageOptions: PageOptions,
  definitionQuery = '',
  featureIds: string[] = [],
  featureIdsNegative = false
): Promise<[WfsFeature[], number, number, number]> {
  if (pageOptions.pageSize > MAX_PAGE_SIZE) {
    const pagedResultFeatures: WfsFeature[] = [];
    let pagedResult: [WfsFeature[], number, number, number] | undefined = undefined;

    for (let page = 0; page < pageOptions.pageSize / MAX_PAGE_SIZE - 1; page++) {
      pagedResult = await getFeatures(
        layer,
        { ...pageOptions, page, pageSize: MAX_PAGE_SIZE },
        definitionQuery,
        featureIds,
        featureIdsNegative
      );
      if (pagedResult[0].length) {
        pagedResultFeatures.push(...pagedResult[0]);
      } else {
        break;
      }
    }

    if (!Array.isArray(pagedResult)) {
      throw new TypeError('Ошибка пагинации');
    }

    return [pagedResultFeatures, ...(pagedResult.slice(1) as [number, number, number])];
  }

  const params: { [key: string]: string } = {
    ...getBaseWfsParams(layer),
    sortBy: generateWfsSortParam(pageOptions),
    startindex: String(pageOptions.page * pageOptions.pageSize),
    count: String(pageOptions.pageSize)
  };

  const cqlFilter = cqlConcat(cqlBuild(pageOptions.filter), definitionQuery);
  const filter = cqlFilter ? cql2ol(cqlFilter) : undefined;

  if (!layer.complexName) {
    throw new Error('Нет complexName');
  }

  const { sort, sortOrder, pageSize, page } = pageOptions;

  const featureRequest = new WFS().writeGetFeature({
    viewParams: '',
    srsName: layer.nativeCRS,
    featureNS: '',
    featurePrefix: '',
    featureTypes: [layer.complexName],
    startIndex: page * pageSize,
    maxFeatures: pageSize,
    sort: (sort && sortOrder && { propertyName: sort, order: sortOrder }) || undefined,
    featureIds,
    featureIdsNegative,
    filter
  });

  const xml = new XMLSerializer().serializeToString(featureRequest);

  const collection = await getFeatureCollectionByXmlFilter(xml);
  const totalPages = Math.ceil(collection.numberMatched / pageSize);
  let featuresTotal = collection.totalFeatures;

  // при включенных фильтрах геосервер врёт насчёт totalFeatures
  if (cqlFilter || featureIds?.length) {
    const { ...paramsForTotalCount } = params;
    paramsForTotalCount.startindex = '0';
    paramsForTotalCount.count = '1';
    if (definitionQuery) {
      paramsForTotalCount.cql_filter = definitionQuery;
    }
    const totalResponse = await wfsClient.getFeatureCollection(paramsForTotalCount);
    featuresTotal = totalResponse.totalFeatures;
  }

  return [collection.features || [], totalPages, collection.numberMatched, featuresTotal];
}

/**
 * Выборка объектов слоя по XML фильтру.
 * @param xml Подготовленный, при помощи библиотеки openLayers, XML document конвертированный в строку.
 */
export async function getFeatureCollectionByXmlFilter(xml: string): Promise<WfsFeatureCollection> {
  return wfsClient.getFeatureCollectionByXmlFilter(xml);
}

export async function getFeaturesById(ids: string[], complexName: string, definitionQuery = ''): Promise<WfsFeature[]> {
  const limit = 100;
  const tableName = extractTableNameFromComplexName(complexName);

  if (ids.length > limit) {
    const result: WfsFeature[] = [];

    for (const batch of chunk(ids, limit)) {
      const features = await getFeaturesById(batch, complexName, definitionQuery);
      result.push(...features);
    }

    return result;
  }

  const params: Record<string, string> = {
    outputFormat: Mime.JSON,
    service: 'wfs',
    version: '2.0.0',
    request: 'GetFeature',
    typeNames: complexName,
    featureID: ids.map(id => `${tableName}.${extractFeatureId(id)}`).join(',')
  };

  let { features } = await wfsClient.getFeatureCollection(params);

  if (definitionQuery) {
    const filter = cqlParse(definitionQuery);
    features = filterFeatures(features || [], filter);
  }

  return features || [];
}

export async function makeXmlPolygonIntersect(
  complexName: string,
  polygon: MultiPolygon,
  srsName: string,
  selectionType: MapSelectionTypes
): Promise<string> {
  const tableName = extractTableNameFromComplexName(complexName);
  const layer = currentProject.getLayerByTableNameFromVisibleVectorLayers(tableName);
  const baseSchema = await getLayerSchema(layer as CrgVectorLayer);
  if (!baseSchema) {
    throw new Error(`Не найдена схема для слоя ${layer.title}`);
  }
  const schema = applyView(baseSchema, layer.view);
  const geometryFieldName = getGeometryFieldName(baseSchema);
  const cqlFilter: string = cqlConcat(cqlBuild(attributesTableStore.getLayerFilter(tableName)), schema.definitionQuery);
  const olFilter = cqlFilter
    ? and(intersects(geometryFieldName, polygon, olProjection.id), cql2ol(cqlFilter))
    : intersects(geometryFieldName, polygon, olProjection.id);

  const featureRequest = new WFS().writeGetFeature({
    srsName,
    featureTypes: [complexName],
    outputFormat: Mime.JSON,
    filter: olFilter,
    featureNS: '',
    featurePrefix: '',
    maxFeatures:
      selectionType === MapSelectionTypes.REMOVE
        ? undefined
        : Math.max(
            mapStore.selectingFeaturesLimit -
              (selectionType === MapSelectionTypes.ADD ? mapStore.selectedFeatures.length : 0),
            1
          )
  });

  return new XMLSerializer().serializeToString(featureRequest);
}

export async function getEmptyFeature(layer: CrgVectorLayer): Promise<WfsFeature<CoordinateEdited>> {
  const schema = await getLayerSchema(layer);
  if (!schema) {
    throw new Error(`Не найден схема для слоя ${layer.title}`);
  }

  const properties = Object.fromEntries(schema.properties.map(({ name }) => [name.toLowerCase(), null]));

  if (!schema.geometryType) {
    throw new Error(`Не задан тип геометрии для слоя ${layer.title}`);
  }

  return {
    type: 'Feature',
    id: `${extractFeatureTypeNameFromComplexName(layer.complexName)}.0`,
    geometry: getEmptyGeometry(schema.geometryType),
    geometry_name: getGeometryFieldName(schema),
    properties
  };
}
