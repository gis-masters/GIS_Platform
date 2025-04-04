import { currentProject } from '../../../stores/CurrentProject.store';
import { defaultOlProjectionCode } from '../../data/projections/projections.models';
import { CrgLayer, CrgLayerType } from '../../gis/layers/layers.models';
import { getLayerByComplexNameInCurrentProject } from '../../gis/layers/layers.utils';
import { buildCql } from '../../util/cql/buildCql';
import { Mime } from '../../util/Mime';
import { extractFeatureId, extractFeatureTypeNameFromComplexName } from '../featureType/featureType.util';
import { CUSTOM_STYLE_NAME } from '../styles/styles.models';
import { getStyleSld } from '../styles/styles.service';
import { createImageFromBlob } from '../styles/styles.utils';
import { wmsClient } from './wms.client';
import { getXmlFilterFromCql } from './wms.utils';

export async function getMap(url: string): Promise<Blob> {
  const parsedUrl = new URL(url);
  const featureIdParam = parsedUrl.searchParams.get('featureId');
  const featureIdsNegative = Boolean(parsedUrl.searchParams.get('featureIdsNegative'));
  const cqlFilter = parsedUrl.searchParams.get('CQL_FILTER');
  const layerComplexName: string = parsedUrl.searchParams.get('LAYERS') || '';
  const layerStyleName: string = parsedUrl.searchParams.get('STYLES') || '';

  if (featureIdParam) {
    const ids = featureIdParam.split(',').map(fid => Number(extractFeatureId(fid)));
    const idCqlFragment = buildCql({ id: { [featureIdsNegative ? '$nin' : '$in']: ids } });
    const newCql = cqlFilter ? `(${idCqlFragment}) AND (${cqlFilter})` : idCqlFragment;
    parsedUrl.searchParams.set('CQL_FILTER', newCql);
  }

  parsedUrl.searchParams.delete('featureId');
  parsedUrl.searchParams.delete('featureIdsNegative');

  if (layerStyleName === CUSTOM_STYLE_NAME) {
    parsedUrl.searchParams.delete('STYLES');
    const layer = getLayerByComplexNameInCurrentProject(layerComplexName);

    if (!layer) {
      throw new Error('Не найден слой');
    }

    if (!layer.style) {
      throw new Error('Отсутствует пользовательский стиль у слоя ' + layerComplexName);
    }

    parsedUrl.searchParams.set('SLD_BODY', layer.style);
  }

  return await wmsClient.getMap(parsedUrl.href);
}

/**
 * Запрашиваем карту через xml с подменой стиля.
 * Предполагаем, что в таких запросах всегда только один слой.
 *
 * Может иметь проблемы с производительностью на сложных стилях из-за бага геосервера.
 *
 * @deprecated не доделано
 *
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
  const featureTypeName = extractFeatureTypeNameFromComplexName(layerComplexName);
  const layer = currentProject.vectorLayers.find(
    l => extractFeatureTypeNameFromComplexName(l.complexName) === featureTypeName
  );

  if (!layer || !layerComplexName || !x1 || !y1 || !x2 || !y2) {
    throw new Error('Неверные параметры запроса');
  }

  if (!layer.styleName) {
    throw new Error('Не указан стиль для слоя');
  }

  const featureIds = featureIdParam ? featureIdParam.split(',') : [];
  const queryFilterElement: Element | null = getXmlFilterFromCql(cqlFilter || '', featureIds, featureIdsNegative);

  const styleDocument = new DOMParser().parseFromString(await getStyleSld(layer.styleName), 'text/xml');
  const nameNode = styleDocument.querySelector('NamedLayer > Name');
  const styleSldNode = styleDocument.querySelector('StyledLayerDescriptor');

  if (!nameNode || !styleSldNode) {
    throw new Error('Некорректный стиль');
  }

  nameNode.innerHTML = layerComplexName;

  const getMapDocument = new DOMParser().parseFromString(
    `<?xml version="1.0" encoding="UTF-8"?><ogc:GetMap xmlns:ogc="http://www.opengis.net/ows" xmlns:gml="http://www.opengis.net/gml" xmlns:sld="http://www.opengis.net/sld" version="1.3.0" service="WMS"><StyledLayerDescriptor version="1.0.0"></StyledLayerDescriptor><BoundingBox srsName="http://www.opengis.net/gml/srs/epsg.xml#3857"><gml:coord><gml:X>${x1}</gml:X><gml:Y>${y1}</gml:Y></gml:coord><gml:coord><gml:X>${x2}</gml:X><gml:Y>${y2}</gml:Y></gml:coord></BoundingBox><Output><Transparent>true</Transparent><Format>image/vnd.jpeg-png8</Format><Size><Width>${width}</Width><Height>${height}</Height></Size></Output></ogc:GetMap>`,
    'text/xml'
  );

  const sldInGetMapNode = getMapDocument.querySelector('StyledLayerDescriptor');

  if (!sldInGetMapNode) {
    throw new Error('Отсутствует style descriptor в GetMap');
  }

  for (const node of styleSldNode.childNodes) {
    sldInGetMapNode.append(node);
  }

  if (queryFilterElement) {
    // в начало списка правил добавляется правило, скрывающее объекты, не попадающие под фильтр
    const additionalFirstRuleNode = styleDocument.createElement('sld:Rule');
    const additionalFirstRuleFilterNode = styleDocument.createElement('ogc:Filter');

    if (queryFilterElement.firstChild?.nodeName === 'Not') {
      queryFilterElement.firstChild.childNodes.forEach(node =>
        additionalFirstRuleFilterNode.append(node.cloneNode(true))
      );
      additionalFirstRuleNode.append(additionalFirstRuleFilterNode);
    } else {
      const not = styleDocument.createElement('Not');
      queryFilterElement.childNodes.forEach(node => not.append(node.cloneNode(true)));
      additionalFirstRuleFilterNode.append(not);
      additionalFirstRuleNode.append(additionalFirstRuleFilterNode);
    }

    const featureTypeStyleNode = getMapDocument.querySelector('FeatureTypeStyle');

    if (!featureTypeStyleNode) {
      throw new Error('Отсутствует FeatureTypeStyle в GetMap');
    }

    const existingRules = featureTypeStyleNode.querySelectorAll('Rule');

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

    featureTypeStyleNode.insertBefore(additionalFirstRuleNode, featureTypeStyleNode.firstChild);
  }
  const xml = new XMLSerializer().serializeToString(getMapDocument);

  return await wmsClient.getMapByXml(xml);
}

export async function testLayerByWms(layer: CrgLayer): Promise<{ ok: boolean; errors?: string[] }> {
  if (!layer.complexName) {
    return { ok: false, errors: ['Не указан complexName у слоя'] };
  }

  if (layer.type === CrgLayerType.VECTOR || layer.type === CrgLayerType.DXF || layer.type === CrgLayerType.SHP) {
    const url = new URL(wmsClient.getWmsUrl());

    url.searchParams.set('SERVICE', 'WMS');
    url.searchParams.set('VERSION', '1.3.0');
    url.searchParams.set('REQUEST', 'GetMap');
    url.searchParams.set('FORMAT', 'image/vnd.jpeg-png8');
    url.searchParams.set('TRANSPARENT', 'true');
    url.searchParams.set('LAYERS', layer.complexName);
    url.searchParams.set('CRS', defaultOlProjectionCode);

    if (layer.styleName && layer.styleName !== CUSTOM_STYLE_NAME) {
      url.searchParams.set('STYLES', layer.styleName);
    }

    if (layer.styleName === CUSTOM_STYLE_NAME && layer.style) {
      url.searchParams.set('SLD_BODY', layer.style);
    }

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
  } else if (
    layer.type === CrgLayerType.EXTERNAL_GEOSERVER ||
    layer.type === CrgLayerType.EXTERNAL ||
    layer.type === CrgLayerType.EXTERNAL_NSPD
  ) {
    if (!layer.errorText) {
      return { ok: true };
    }

    if (!layer.dataSourceUri) {
      return { ok: false, errors: ['Не указан dataSourceUri у слоя'] };
    }

    const url = new URL(layer.dataSourceUri);
    url.searchParams.set('F', 'Image');
    url.searchParams.set('FORMAT', 'PNG32');
    url.searchParams.set('TRANSPARENT', 'true');
    url.searchParams.set('LAYERS', layer.complexName);
    url.searchParams.set('SIZE', '1024,1024');
    url.searchParams.set('BBOX', '3740789.9457623847,5618140.688217526,3740809.055019456,5618159.797474598');
    url.searchParams.set('bboxSR', '102100');
    url.searchParams.set('imageSR', '102100');
    url.searchParams.set('DPI', '360');

    const errors = [layer.errorText];
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return { ok: false, errors };
      }
    } catch {
      return { ok: false, errors };
    }

    return { ok: true };
  }

  return { ok: true };
}

/**
 * Get a graphic that is representative of specific rule by their name.
 *
 * @param complexLayerName  Название слоя в формате 'workspace:layerName'
 * @param ruleName          Название правила в стиле
 * @param styleName         Название стиля
 * @param style             Стиль в sld
 */
export async function getLegendGraphic(
  complexLayerName: string,
  ruleName?: string,
  styleName?: string,
  style?: string
): Promise<string> {
  return await createImageFromBlob(await wmsClient.getLegendGraphic(complexLayerName, ruleName, styleName, style));
}
