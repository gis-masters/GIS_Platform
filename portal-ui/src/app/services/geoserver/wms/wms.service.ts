import { currentProject } from '../../../stores/CurrentProject.store';
import { CrgVectorLayer } from '../../gis/layers/layers.models';
import { getStyleSld } from '../styles/styles.service';
import { cqlBuild } from '../../util/cqlBuild';
import { cql2ol } from '../../util/cql2ol';
import { Mime } from '../../util/Mime';
import { WFS } from '../../ol/WFS';

import { wmsClient } from './wms.client';

export async function getMap(url: string): Promise<Blob> {
  const parsedUrl = new URL(url);
  const featureIdParam = parsedUrl.searchParams.get('featureId');
  const featureIdsNegative = Boolean(parsedUrl.searchParams.get('featureIdsNegative'));
  const cqlFilter = parsedUrl.searchParams.get('CQL_FILTER');

  if (featureIdParam) {
    const ids = featureIdParam.split(',').map(fid => Number(fid.split('.')[1]));
    const idCqlFragment = cqlBuild({ id: { [featureIdsNegative ? '$nin' : '$in']: ids } });
    const newCql = cqlFilter ? `(${idCqlFragment}) AND (${cqlFilter})` : idCqlFragment;
    parsedUrl.searchParams.set('CQL_FILTER', newCql);
  }

  parsedUrl.searchParams.delete('featureId');
  parsedUrl.searchParams.delete('featureIdsNegative');

  return await wmsClient.getMap(parsedUrl.href);
}

/**
 * Запрашиваем карту через xml с подменой стиля.
 * Предполагаем, что в таких запросах всегда только один слой.
 *
 * Имеет проблемы с производительностью из-за бага геосервера.
 * Оставлено на всякий случай (например если геосервер починит другую багу в wms,
 * благодаря которой мы можем фильтровать по id в cql фильтре и не использовать этот метод).
 *
 * @deprecated Не используется.
 */

export async function getMapByXml(url: string): Promise<Blob> {
  const parsedUrl = new URL(url);
  const featureIdParam: string = parsedUrl.searchParams.get('featureId') || '';
  const cqlFilter = parsedUrl.searchParams.get('CQL_FILTER');
  const layerComplexName: string = parsedUrl.searchParams.get('LAYERS') || '';
  const featureIdsNegative = Boolean(parsedUrl.searchParams.get('featureIdsNegative'));
  const [x1, y1, x2, y2] = parsedUrl.searchParams.get('BBOX')?.split(',') || [];
  const width = parsedUrl.searchParams.get('WIDTH');
  const height = parsedUrl.searchParams.get('HEIGHT');
  const filter = cqlFilter ? cql2ol(cqlFilter) : undefined;
  const [, tableName] = layerComplexName.split(':');
  const layer = currentProject.vectorLayers.find(l => l.tableName === tableName);

  if (!featureIdParam || !layerComplexName || !x1 || !y1 || !x2 || !y2) {
    throw new Error('Неверные параметры запроса');
  }

  const getFeatureRequest: Element = new WFS().writeGetFeature({
    featureNS: '',
    featurePrefix: '',
    featureTypes: [layerComplexName],
    featureIds: featureIdParam.split(','),
    featureIdsNegative,
    filter
  }) as Element;

  const queryFilterElement = getFeatureRequest.querySelector('Filter');
  const styleDocument = new DOMParser().parseFromString(await getStyleSld(layer.styleName), 'text/xml');

  styleDocument.querySelector('NamedLayer > Name').innerHTML = layerComplexName;
  const styleSldElement = styleDocument.querySelector('StyledLayerDescriptor');

  const getMapDocument = new DOMParser().parseFromString(
    `<?xml version="1.0" encoding="UTF-8"?><ogc:GetMap xmlns:ogc="http://www.opengis.net/ows" xmlns:gml="http://www.opengis.net/gml" xmlns:sld="http://www.opengis.net/sld" version="1.3.0" service="WMS"><StyledLayerDescriptor version="1.0.0"></StyledLayerDescriptor><BoundingBox srsName="http://www.opengis.net/gml/srs/epsg.xml#3857"><gml:coord><gml:X>${x1}</gml:X><gml:Y>${y1}</gml:Y></gml:coord><gml:coord><gml:X>${x2}</gml:X><gml:Y>${y2}</gml:Y></gml:coord></BoundingBox><Output><Transparent>true</Transparent><Format>image/vnd.jpeg-png8</Format><Size><Width>${width}</Width><Height>${height}</Height></Size></Output></ogc:GetMap>`,
    'text/xml'
  );

  for (const node of styleSldElement.childNodes) {
    getMapDocument.querySelector('StyledLayerDescriptor').append(node);
  }

  const firstRuleElement = styleDocument.createElement('sld:Rule');
  const firstRuleFilterElement = styleDocument.createElement('ogc:Filter');
  if (queryFilterElement.firstChild.nodeName === 'Not') {
    queryFilterElement.firstChild.childNodes.forEach(node => firstRuleFilterElement.append(node.cloneNode(true)));
    firstRuleElement.append(firstRuleFilterElement);
  } else {
    const not = styleDocument.createElement('Not');
    queryFilterElement.childNodes.forEach(node => not.append(node.cloneNode(true)));
    firstRuleFilterElement.append(not);
    firstRuleElement.append(firstRuleFilterElement);
  }

  const featureTypeStyleElement = getMapDocument.querySelector('FeatureTypeStyle');

  const existingRules = featureTypeStyleElement.querySelectorAll('Rule');

  for (const rule of existingRules) {
    if (!rule.querySelector('ElseFilter')) {
      const filter = rule.querySelector('Filter');
      if (filter) {
        const and = getMapDocument.createElement('And');
        filter.childNodes.forEach(filterChild => and.append(filterChild));
        queryFilterElement.childNodes.forEach(node => and.append(node.cloneNode(true)));
        filter.append(and);
      } else {
        const newFilter = styleDocument.createElement('ogc:Filter');
        queryFilterElement.childNodes.forEach(node => newFilter.append(node.cloneNode(true)));
        rule.append(newFilter);
      }
    }
  }

  featureTypeStyleElement.insertBefore(firstRuleElement, featureTypeStyleElement.firstChild);

  const xml = new XMLSerializer().serializeToString(getMapDocument);

  return await wmsClient.getMapByXml(xml);
}

export async function testLayerByWms(layer: CrgVectorLayer): Promise<{ ok: boolean; errors?: string[] }> {
  const url = new URL(wmsClient.getWmsUrl());

  url.searchParams.set('SERVICE', 'WMS');
  url.searchParams.set('VERSION', '1.3.0');
  url.searchParams.set('REQUEST', 'GetMap');
  url.searchParams.set('FORMAT', 'image/vnd.jpeg-png8');
  url.searchParams.set('TRANSPARENT', 'true');
  url.searchParams.set('LAYERS', layer.complexName);
  url.searchParams.set('CRS', 'EPSG:3857');
  url.searchParams.set('STYLES', '');
  url.searchParams.set('WIDTH', '300');
  url.searchParams.set('HEIGHT', '300');
  url.searchParams.set('BBOX', '3778140.58549765,5300522.190056069,3778162.97915828,5300544.5837167');

  const result = await wmsClient.getMap(url.toString());

  if (typeof result === 'string' || result.type === Mime.TEXT_XML) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(typeof result === 'string' ? result : await result.text(), Mime.XML);
    const errors = [...xmlDoc.querySelectorAll('ServiceException')].map(
      (n: Element) => `Ошибка получения данных с сервера: ${n.innerHTML.trim()}`
    );

    return { ok: false, errors };
  }

  return { ok: true };
}

/**
 * Get a graphic that is representative of specific rule by their name.
 *
 * @param complexLayerName  Название слоя в формате 'workspace:layerName'
 * @param ruleName          Название правила в стиле.
 */
export async function getLegendGraphic(complexLayerName: string, ruleName: string, style: string): Promise<Blob> {
  return await wmsClient.getLegendGraphic(complexLayerName, ruleName, style);
}
