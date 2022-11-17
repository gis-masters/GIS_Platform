import { chunk } from 'lodash';

import { generateWfsSortParam } from './wfs.util';
import { getGeoServerUrl, getWfsUrl } from '../server-urls.service';
import { WfsFeature, WfsFeatureCollection } from './wfs.models';
import { PageOptions } from '../models';
import { CrgVectorLayer } from '../gis/projects.models';
import { buildCqlFilter } from '../util/cql';
import { cql2ol } from '../util/cql2ol';
import { http } from '../http.service';
import { Mime } from '../util/Mime';
import { WFS } from '../ol/WFS';

export const WFS_FEATURE_ID_DELIMITER = '.';

export async function getFeatureById(complexName: string, objectId: string): Promise<WfsFeature> {
  const url = await prepareLink(complexName, objectId);
  const featureCollection: WfsFeatureCollection = await http.get<WfsFeatureCollection>(url);

  if (featureCollection && featureCollection.features.length > 0) {
    return featureCollection.features[0];
  }

  throw new Error('Not found feature by ID: ' + objectId);
}

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

  const cqlFilter = buildCqlFilter(pageOptions.filter);
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

  const collection = await getFeaturesCollectionByXmlFilter(xml);
  const totalPages = Math.ceil(collection.numberMatched / pageOptions.pageSize);
  let featuresTotal = collection.totalFeatures;

  // при включенных фильтрах геосервер врёт насчёт totalFeatures
  if (cqlFilter || featureIds?.length) {
    const { ...paramsForTotalCount } = params;
    paramsForTotalCount.startindex = '0';
    paramsForTotalCount.count = '1';
    const totalResponse = await http.get<WfsFeatureCollection>(await getWfsUrl(), { params: paramsForTotalCount });
    featuresTotal = totalResponse.totalFeatures;
  }

  return [collection.features || [], totalPages, collection.numberMatched, featuresTotal];
}

/**
 * Выборка объектов слоя по XML фильтру.
 * @param xml Подготовленный, при помощи библиотеки openLayers, XML document конвертированный в строку.
 */
export async function getFeaturesCollectionByXmlFilter(xml: string): Promise<WfsFeatureCollection> {
  return http.post<WfsFeatureCollection>(await getWfsUrl(), xml, {
    headers: { 'Content-Type': Mime.XML },
    params: {
      exceptions: Mime.JSON,
      outputFormat: Mime.JSON
    },
    cache: { clear: false, disabled: false }
  });
}

export async function getFeaturesById(ids: string[], complexName: string): Promise<WfsFeature[]> {
  const limit = 100;

  if (ids.length > limit) {
    const result: WfsFeature[] = [];

    for (const batch of chunk(ids, limit)) {
      const features = await getFeaturesById(batch, complexName);
      result.push(...features);
    }

    return result;
  }

  const headers = { 'Content-Type': Mime.JSON };
  const params = {
    outputFormat: Mime.JSON,
    service: 'wfs',
    version: '2.0.0',
    request: 'GetFeature',
    typeNames: complexName,
    featureID: ids.join(',')
  };

  const { features } = await http.get<WfsFeatureCollection>(await getWfsUrl(), { headers, params });

  return features;
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
