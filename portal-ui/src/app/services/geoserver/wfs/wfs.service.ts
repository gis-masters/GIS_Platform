import { area, feature, featureCollection, intersect } from '@turf/turf';
import type { MultiPolygon as GeoMultiPolygon, Polygon as GeoPolygon } from 'geojson';
import { chunk } from 'lodash';
import { and, intersects } from 'ol/format/filter';
import GeoJSON from 'ol/format/GeoJSON';
import { MultiPolygon, Polygon } from 'ol/geom';

import { attributesTableStore } from '../../../stores/AttributesTable.store';
import { currentProject } from '../../../stores/CurrentProject.store';
import { currentUser } from '../../../stores/CurrentUser.store';
import { usersService } from '../../auth/users/users.service';
import { getOlProjection, getProjectionByCode } from '../../data/projections/projections.service';
import { getProjectionCode } from '../../data/projections/projections.util';
import { applyView } from '../../data/schema/utils/applyView';
import { getGeometryFieldName } from '../../data/schema/utils/getGeometryFieldName';
import { type CrgVectorLayer } from '../../gis/layers/layers.models';
import { getLayerSchema } from '../../gis/layers/layers.service';
import { selectedFeaturesStore } from '../../map/a-map-mode/selected-features/SelectedFeatures.store';
import { FeatureState, MapSelectionTypes } from '../../map/map.models';
import { type PageOptions } from '../../models';
import { WFS } from '../../ol/WFS';
import { buildCql } from '../../util/cql/buildCql';
import { concatCql } from '../../util/cql/concatCql';
import { cql2ol } from '../../util/cql/cql2ol';
import { parseCql } from '../../util/cql/parseCql';
import { filterFeatures } from '../../util/filters/filterObjects';
import { Mime } from '../../util/Mime';
import { wfsGeometryToGeometry } from '../../util/open-layers.util';
import { isArray } from '../../util/typeGuards/isArray';
import {
  buildComplexName,
  extractFeatureId,
  extractFeatureTypeNameFromComplexName,
  extractResourceIdFromComplexName
} from '../featureType/featureType.util';
import { wfsClient } from './wfs.client';
import {
  type GetWfsIntersectionsOptions,
  type WfsFeature,
  type WfsFeatureCollection,
  type WfsLayerIntersectionItem
} from './wfs.models';
import { explodePolygons, generateWfsSortParam, getEmptyGeometry, isArealWfsGeometry } from './wfs.util';

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

    if (!isArray(pagedResult)) {
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
  const tableName = extractResourceIdFromComplexName(complexName);

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
  selectionType: MapSelectionTypes,
  options?: { skipMaxFeaturesLimit?: boolean }
): Promise<string> {
  const tableName = extractResourceIdFromComplexName(complexName);
  const layer = currentProject.getLayerByResourceIdFromAllVectorableLayers(tableName);
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

  const subtractForLimit = selectionType === MapSelectionTypes.ADD ? selectedFeaturesStore.features.length : 0;
  const maxFeatures =
    options?.skipMaxFeaturesLimit || selectionType === MapSelectionTypes.REMOVE
      ? undefined
      : Math.max(selectedFeaturesStore.limit - subtractForLimit, 1);

  const featureRequest = new WFS().writeGetFeature({
    srsName,
    featureTypes: [complexName],
    outputFormat: Mime.JSON,
    filter,
    featureNS: '',
    featurePrefix: '',
    maxFeatures
  });

  return new XMLSerializer().serializeToString(featureRequest);
}

async function computeArealOverlap(
  sourceFeature: WfsFeature,
  sourceLayer: CrgVectorLayer,
  targetFeature: WfsFeature,
  targetLayer: CrgVectorLayer
): Promise<{ intersectionArea: number; intersectionAreaPercent: number }> {
  const srcGeom = sourceFeature.geometry;
  const tgtGeom = targetFeature.geometry;

  if (!isArealWfsGeometry(srcGeom) || !isArealWfsGeometry(tgtGeom)) {
    throw new Error('Ожидались площадные геометрии для расчета площади пересечения');
  }

  await getProjectionByCode(sourceLayer.nativeCRS);
  await getProjectionByCode(targetLayer.nativeCRS);

  const olSrc = wfsGeometryToGeometry(srcGeom);
  const olTgt = wfsGeometryToGeometry(tgtGeom);
  olSrc.transform(sourceLayer.nativeCRS, 'EPSG:4326');
  olTgt.transform(targetLayer.nativeCRS, 'EPSG:4326');

  const format = new GeoJSON();
  const srcJson = format.writeGeometryObject(olSrc) as GeoPolygon | GeoMultiPolygon;
  const tgtJson = format.writeGeometryObject(olTgt) as GeoPolygon | GeoMultiPolygon;

  const srcPolys = explodePolygons(srcJson);
  const tgtPolys = explodePolygons(tgtJson);

  let intersectionArea = 0;

  for (const pa of srcPolys) {
    for (const pb of tgtPolys) {
      const fc = featureCollection([feature(pa), feature(pb)]);
      const inter = intersect(fc);

      if (inter?.geometry) {
        intersectionArea += area(inter);
      }
    }
  }

  const sourceTotal = srcPolys.reduce((s, p) => s + area(feature(p)), 0);
  const intersectionAreaPercent = sourceTotal > 0 ? Math.round((intersectionArea / sourceTotal) * 100 * 100) / 100 : 0;

  return {
    intersectionArea: Math.round(intersectionArea * 100) / 100,
    intersectionAreaPercent
  };
}

function sourceFeatureToMapMultiPolygon(
  sourceFeature: WfsFeature,
  sourceLayer: CrgVectorLayer,
  mapProjCode: string
): MultiPolygon {
  const g = sourceFeature.geometry;

  if (!isArealWfsGeometry(g)) {
    throw new Error('Исходная фича должна иметь геометрию Polygon или MultiPolygon');
  }

  const olGeom = wfsGeometryToGeometry(g);
  let multi: MultiPolygon;

  if (olGeom instanceof MultiPolygon) {
    multi = olGeom;
  } else if (olGeom instanceof Polygon) {
    multi = new MultiPolygon([olGeom.getCoordinates()]);
  } else {
    throw new TypeError('Исходная геометрия должна быть Polygon или MultiPolygon');
  }

  multi.transform(sourceLayer.nativeCRS, mapProjCode);

  return multi;
}

export async function getWfsIntersectionsForFeature(
  sourceFeature: WfsFeature,
  sourceLayer: CrgVectorLayer,
  targetLayer: CrgVectorLayer,
  options?: GetWfsIntersectionsOptions
): Promise<WfsLayerIntersectionItem[]> {
  if (!targetLayer.complexName) {
    throw new Error(`У целевого слоя ${targetLayer.title} не задан complexName`);
  }

  if (!isArealWfsGeometry(sourceFeature.geometry)) {
    throw new Error('Исходная фича должна иметь геометрию Polygon или MultiPolygon');
  }

  await getProjectionByCode(sourceLayer.nativeCRS);
  const olProj = await getOlProjection();
  const mapCode = getProjectionCode(olProj);
  const buffer = sourceFeatureToMapMultiPolygon(sourceFeature, sourceLayer, mapCode);

  const xml = await makeXmlPolygonIntersect(
    targetLayer.complexName,
    buffer,
    targetLayer.nativeCRS,
    MapSelectionTypes.REPLACE,
    { skipMaxFeaturesLimit: options?.skipMaxFeaturesLimit ?? false }
  );

  const { features = [] } = await getFeatureCollectionByXmlFilter(xml);
  const sourceIsArealFeature = isArealWfsGeometry(sourceFeature.geometry);

  const items: WfsLayerIntersectionItem[] = [];

  for (const f of features) {
    const geometryType = f.geometry?.type ?? 'unknown';
    const base: WfsLayerIntersectionItem = { feature: f, geometryType };

    if (!options?.skipAreaComputation && sourceIsArealFeature && isArealWfsGeometry(f.geometry)) {
      const { intersectionArea, intersectionAreaPercent } = await computeArealOverlap(
        sourceFeature,
        sourceLayer,
        f,
        targetLayer
      );
      base.intersectionArea = intersectionArea;
      base.intersectionAreaPercent = intersectionAreaPercent;
    }

    items.push(base);
  }

  return items;
}

export async function getEmptyFeature(layer: CrgVectorLayer): Promise<WfsFeature> {
  const schema = await getLayerSchema(layer);
  if (!schema) {
    throw new Error(`Не найден схема для слоя ${layer.title}`);
  }

  // Создаем entries с явной типизацией
  const propertyEntries: Array<[string, null]> = schema.properties.map(({ name }) => [name.toLowerCase(), null]);

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
