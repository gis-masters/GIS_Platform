import { chunk } from 'lodash';
import { and, intersects } from 'ol/format/filter';
import { MultiPolygon } from 'ol/geom';

import { attributesTableStore } from '../../../stores/AttributesTable.store';
import { currentProject } from '../../../stores/CurrentProject.store';
import { currentUser } from '../../../stores/CurrentUser.store';
import { usersService } from '../../auth/users/users.service';
import { getOlProjection } from '../../data/projections/projections.service';
import { getProjectionCode } from '../../data/projections/projections.util';
import { applyView, getGeometryFieldName } from '../../data/schema/schema.utils';
import { CrgVectorLayer } from '../../gis/layers/layers.models';
import { getLayerSchema } from '../../gis/layers/layers.service';
import { selectedFeaturesStore } from '../../map/a-map-mode/selected-features/SelectedFeatures.store';
import { FeatureState, MapSelectionTypes } from '../../map/map.models';
import { PageOptions } from '../../models';
import { WFS } from '../../ol/WFS';
import { buildCql } from '../../util/cql/buildCql';
import { concatCql } from '../../util/cql/concatCql';
import { cql2ol } from '../../util/cql/cql2ol';
import { parseCql } from '../../util/cql/parseCql';
import { filterFeatures } from '../../util/filters/filterObjects';
import { Mime } from '../../util/Mime';
import {
  buildComplexName,
  extractFeatureId,
  extractFeatureTypeNameFromComplexName,
  extractTableNameFromComplexName
} from '../featureType/featureType.util';
import { wfsClient } from './wfs.client';
import { WfsFeature, WfsFeatureCollection } from './wfs.models';
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

export async function updateFeature(payload: string): Promise<string> {
  return wfsClient.update(payload);
}

export async function getFeatureCollection(payload: Record<string, string>): Promise<WfsFeatureCollection> {
  return wfsClient.getFeatureCollection(payload);
}

/**
 * @deprecated
 */
export async function updateProperty(
  tableName: string,
  featureId: string,
  propName: string,
  propValue: string
): Promise<string> {
  await usersService.fetchCurrentUser();

  const complexName = buildComplexName(currentUser.workspaceName, tableName);
  const payload = `<Transaction xmlns="http://www.opengis.net/wfs" service="WFS" version="1.1.0"
                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                    xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd">
        <Update typeName="${complexName}">
          <Property>
              <Name>${propName}</Name>
              <Value>${propValue}</Value>
          </Property>
          <Filter xmlns="http://www.opengis.net/ogc">
              <FeatureId fid="${featureId}"/>
          </Filter>
        </Update>
      </Transaction>`;

  return wfsClient.update(payload);
}

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

  const cqlFilter = concatCql(buildCql(pageOptions.filter), definitionQuery);
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
    const filter = parseCql(definitionQuery);
    features = filterFeatures(features || [], filter);
  }

  return features || [];
}

export async function getFeatureById(
  featureId: string,
  complexName: string,
  definitionQuery = ''
): Promise<WfsFeature> {
  const [feature] = await getFeaturesById([featureId], complexName, definitionQuery);

  return feature;
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

  const isFilterEnabled = !attributesTableStore.filterDisabled[tableName];
  const schema = applyView(baseSchema, layer.view);
  const geometryFieldName = getGeometryFieldName(baseSchema);
  const cqlFilter: string = concatCql(buildCql(attributesTableStore.getLayerFilter(tableName)), schema.definitionQuery);
  const olProjection = await getOlProjection();
  const filterToUse = isFilterEnabled ? cqlFilter : '';

  const olFilter = filterToUse
    ? and(intersects(geometryFieldName, polygon, getProjectionCode(olProjection)), cql2ol(filterToUse))
    : intersects(geometryFieldName, polygon, getProjectionCode(olProjection));
  const filter = olFilter || undefined;

  const featureRequest = new WFS().writeGetFeature({
    srsName,
    featureTypes: [complexName],
    outputFormat: Mime.JSON,
    filter,
    featureNS: '',
    featurePrefix: '',
    maxFeatures:
      selectionType === MapSelectionTypes.REMOVE
        ? undefined
        : Math.max(
            selectedFeaturesStore.limit -
              (selectionType === MapSelectionTypes.ADD ? selectedFeaturesStore.features.length : 0),
            1
          )
  });

  return new XMLSerializer().serializeToString(featureRequest);
}

export async function getEmptyFeature(layer: CrgVectorLayer): Promise<WfsFeature> {
  const schema = await getLayerSchema(layer);
  if (!schema) {
    throw new Error(`Не найден схема для слоя ${layer.title}`);
  }

  // Создаем entries с явной типизацией
  const propertyEntries: Array<[string, null]> = schema.properties.map(
    ({ name }) => [name.toLowerCase(), null] as [string, null]
  );

  // Добавляем флаг пустой сущности с явной типизацией
  const isEmptyFeatureEntry: [string, boolean] = [FeatureState.EMPTY, true];

  // Объединяем entries с явной типизацией
  const allEntries: Array<[string, null | boolean]> = [...propertyEntries, isEmptyFeatureEntry];

  // Создаем объект свойств с правильной типизацией
  const properties: Record<string, null | boolean> = Object.fromEntries(allEntries);
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
