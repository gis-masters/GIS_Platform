import { chunk } from 'lodash';
import { MultiPolygon } from 'ol/geom';
import { intersects, and } from 'ol/format/filter';

import { currentProject } from '../../../stores/CurrentProject.store';
import { MapSelectionTypes, mapStore } from '../../../stores/Map.store';
import { attributesTableStore } from '../../../stores/AttributesTable.store';
import { applyView, getGeometryFieldName } from '../../data/schema/schema.utils';
import { schemaService } from '../../data/schema/schema.service';
import { CrgVectorLayer } from '../../gis/layers/layers.models';
import { filterFeatures } from '../../util/filterObjects';
import { olProjection } from '../projections.service';
import { cqlConcat } from '../../util/cqlConcat';
import { cqlBuild } from '../../util/cqlBuild';
import { cqlParse } from '../../util/cqlParse';
import { PageOptions } from '../../models';
import { cql2ol } from '../../util/cql2ol';
import { Mime } from '../../util/Mime';
import { WFS } from '../../ol/WFS';

import { WfsFeature, WfsFeatureCollection } from './wfs.models';
import { generateWfsSortParam } from './wfs.util';
import { wfsClient } from './wfs.client';

function getBaseWfsParams(layer: CrgVectorLayer): { [key: string]: string } {
  return {
    service: 'wfs',
    request: 'GetFeature',
    outputFormat: Mime.JSON,
    exceptions: Mime.JSON,
    typeName: layer.complexName,
    srsName: layer.nativeCRS
  };
}

const MAX_PAGE_SIZE = 10_000;

/**
 * Get features by wfs
 * @returns {Promise<[WfsFeature[], number, number, number]} features, total pages, features matched, features total
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
    let pagedResult: [WfsFeature[], number, number, number];

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

  const featureRequest = new WFS().writeGetFeature({
    viewParams: '',
    srsName: layer.nativeCRS,
    featureNS: '',
    featurePrefix: '',
    featureTypes: [layer.complexName],
    startIndex: pageOptions.page * pageOptions.pageSize,
    maxFeatures: pageOptions.pageSize,
    sort: pageOptions.sort && { propertyName: pageOptions.sort, order: pageOptions.sortOrder },
    featureIds,
    featureIdsNegative,
    filter
  });

  const xml = new XMLSerializer().serializeToString(featureRequest);

  const collection = await getFeatureCollectionByXmlFilter(xml);
  const totalPages = Math.ceil(collection.numberMatched / pageOptions.pageSize);
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
    featureID: ids.join(',')
  };

  let { features } = await wfsClient.getFeatureCollection(params);

  if (definitionQuery) {
    const filter = cqlParse(definitionQuery);
    features = filterFeatures(features, filter);
  }

  return features;
}

export async function makeXmlPolygonIntersect(
  complexName: string,
  polygon: MultiPolygon,
  srsName: string,
  selectionType: MapSelectionTypes
): Promise<string> {
  const tableName = complexName.split(':')[1];
  const layer = currentProject.getLayerByTableName(tableName);
  const baseSchema = await schemaService.getSchema(layer.schemaId);
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
