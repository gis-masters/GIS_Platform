import { HttpParams } from '@angular/common/http';
import { cloneDeep } from 'lodash';

import { serverProperties } from '../server-properties.service';
import { services } from '../services';
import { CrgLayer, CrgGroup, Rule } from '../crg/projects.models';
import { WfsFeature } from '../geoserver/wfs-models';
import { currentProject } from '../../stores/CurrentProject.store';

export interface GeoserverLayer {
  name: string;
  type: string;
  defaultStyle: { name: string, href: string };
  resource: any;
  attribution: any;
}

export async function deleteLayer (layer: CrgLayer) {
  await services.httpq.delete(`${await serverProperties.projectsUrl}/${currentProject.id}/layers/${layer.id}`);
  currentProject.deleteLayer(layer);
}

export async function loadLayerLegend (layer: CrgLayer) {
  if (layer.legend || layer.legendIsFetching) {
    return;
  }

  currentProject.patch(layer, { legendIsFetching: true });

  const styleSld: string = await getStyleSld(layer.styleName);
  const xmlDoc = new DOMParser().parseFromString(styleSld, 'text/xml');
  const rules: Rule[] = Array.from(xmlDoc.querySelectorAll('Rule'))
    .filter(rule => rule.querySelector('Name') && rule.querySelector('Title'))
    .map(rule => ({
      name: rule.querySelector('Name').innerHTML,
      title: rule.querySelector('Title').innerHTML
    }));
  const rulesWithLegend = await Promise.all(rules.map(async rule => {
    const blob = await getLegendGraphicByRuleName(layer.complexName, rule.name);
    const img = await createImageFromBlob(blob);

    return {
      ...rule,
      legend: img
    };
  }));

  currentProject.patch(layer, {
    legend: rulesWithLegend,
    legendIsFetching: false,
  });
}

export function getFeatureLayer (feature: WfsFeature): CrgLayer {
  const [ layerName ] = feature.id.split('.');

  return currentProject.layers.find(l => l.internalName === layerName);
}

// на будущее
async function updateLayerOrGroup <T extends (CrgLayer | CrgGroup)>(item: T, patch: Partial<T>, isGroup: boolean) {
  await services.provided;
  const backup = cloneDeep(item);
  const path = isGroup ? 'groups' : 'layers';
  currentProject.patch(item, patch);
  try {
    const url = `${await serverProperties.projectsUrl}/${currentProject.id}/${path}/${item.id}`;
    await services.httpq.patch(url, patch);
  } catch (err) {
    currentProject.patch(item, backup);
  }
}

function createImageFromBlob (image: Blob): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      resolve(reader.result as string);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  });
}

/**
 * Get a graphic that is representative of specific rule by their name.
 *
 * @param complexLayerName  Название слоя в формате 'workspace:layerName'
 * @param ruleName          Название правила в стиле. Ожидаем что в названии стиля будет использован атрибут на
 *                          основе которого сделан фильтр.
 */
async function getLegendGraphicByRuleName (complexLayerName: string, ruleName: string): Promise<Blob> {
  const params = new HttpParams()
    .set('REQUEST', 'GetLegendGraphic')
    .set('VERSION', '1.3.0')
    .set('FORMAT', 'image/png')
    .set('WIDTH', '40')
    .set('HEIGHT', '20')
    .set('LAYER', complexLayerName)
    .set('RULE', ruleName);

  return services.httpq.get(`${await serverProperties.geoServerUrl}/wms`, { responseType: 'blob', params });
}

/**
 * Get the style SLD definition body.
 *
 * @param complexStyleName style name or complex style name ("workspace_name:style_name")
 */
async function getStyleSld (complexStyleName: string): Promise<string> {
  const styleNameArr = complexStyleName.split(':');
  const styleName = styleNameArr.pop();
  const geoServerUrl = await serverProperties.geoServerUrl;
  const workspacesUrl = geoServerUrl + '/rest/workspaces/';
  const workspaceName = styleNameArr[0];
  const url: string = workspaceName ?
                        `${workspacesUrl}${workspaceName}/styles/${styleName}.sld` :
                        `${geoServerUrl}/rest/styles/${styleName}.sld`;

  return services.httpq.get<string>(
      url,
      { headers: { 'Content-Type': 'application/vnd.ogc.sld+xml' }, responseType: 'text' }
  );
}
