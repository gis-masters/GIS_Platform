import { BBOX } from '@fiz/geoserver-types/BBOX';

import { sidebars } from '../../stores/Sidebars.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { WfsFeature } from './wfs.models';
import { http } from '../http.service';
import { patch } from '../util/patch';
import {
  CrgLayer,
  CrgLayersGroup,
  CrgLayerType,
  CrgProject,
  NewCrgLayer,
  NewCrgLayersGroup,
  Rule
} from '../crg/projects.models';
import {
  getGeoServerUrl,
  getProjectGroupsUrl,
  getProjectGroupUrl,
  getProjectLayersUrl,
  getProjectLayerUrl,
  getWmsUrl,
  replaceUrl
} from '../server-urls.service';

interface GeoserverLayerInfo {
  name: string;
  type: CrgLayerType;
  defaultStyle: {
    name: string;
    href: string;
  };
  resource: {
    '@class': string;
    name: string;
    href: string;
  };
  attribution: {
    logoWidth: number;
    logoHeight: number;
  };
}

interface GeoserverCoverage {
  name: string;
  nativeName: string;
  namespace: {
    name: string;
    href: string;
  };
  title: string;
  nativeCRS: {
    '@class': string;
    $: string;
  };
  srs: string;
  nativeBoundingBox: BBOX;
  latLonBoundingBox: BBOX;
  projectionPolicy: string;
  enabled: boolean;
  store: {
    '@class': string;
    name: string;
    href: string;
  };
  serviceConfiguration: boolean;
  grid: {
    '@dimension': string;
    range: {
      low: string;
      high: string;
    };
    transform: {
      scaleX: number;
      scaleY: number;
      shearX: number;
      shearY: number;
      translateX: number;
      translateY: number;
    };
    crs: string;
  };
}

export async function deleteLayer(layerId: number): Promise<void> {
  await http.delete(await getProjectLayerUrl(currentProject.id, layerId));
  if (sidebars.layerForAttributes?.id === layerId) {
    sidebars.closeAttributes();
  }
}

export async function loadLayerLegend(layer: CrgLayer): Promise<void> {
  if (layer.legend || layer.legendIsFetching) {
    return;
  }

  patch(layer, { legendIsFetching: true });

  const styleSld: string = await getStyleSld(layer.styleName);
  const xmlDoc = new DOMParser().parseFromString(styleSld, 'text/xml');
  const rulesWithoutLegend: Omit<Rule, 'legend'>[] = [...xmlDoc.querySelectorAll('Rule')]
    .filter(rule => rule.querySelector('Name') && rule.querySelector('Title'))
    .map(rule => ({
      name: rule.querySelector('Name').innerHTML,
      title: rule.querySelector('Title').innerHTML
    }));
  const rules = await Promise.all(
    rulesWithoutLegend.map(async rule => {
      const blob = await getLegendGraphicByRuleName(layer.complexName, rule.name);
      const img = await createImageFromBlob(blob);

      return {
        ...rule,
        legend: img
      };
    })
  );

  patch(layer, {
    legend: rules,
    legendIsFetching: false
  });
}

export function getFeatureLayer(feature: WfsFeature): CrgLayer {
  const [layerName] = feature.id.split('.');

  return currentProject.vectorLayers.find(l => l.tableName === layerName);
}

function createImageFromBlob(image: Blob): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        resolve(reader.result as string);
      },
      false
    );

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
async function getLegendGraphicByRuleName(complexLayerName: string, ruleName: string): Promise<Blob> {
  const params = {
    REQUEST: 'GetLegendGraphic',
    VERSION: '1.3.0',
    FORMAT: 'image/png',
    WIDTH: '40',
    HEIGHT: '20',
    LAYER: complexLayerName,
    RULE: ruleName
  };

  return http.get(await getWmsUrl(), { responseType: 'blob', params });
}

/**
 * Get the style SLD definition body.
 *
 * @param complexStyleName style name or complex style name ("workspace_name:style_name")
 */
async function getStyleSld(complexStyleName: string): Promise<string> {
  const styleNameArr = complexStyleName.split(':');
  const styleName = styleNameArr.pop();
  const geoServerUrl = await getGeoServerUrl();
  const workspacesUrl = geoServerUrl + '/rest/workspaces/';
  const workspaceName = styleNameArr[0];
  const url: string = workspaceName
    ? `${workspacesUrl}${workspaceName}/styles/${styleName}.sld`
    : `${geoServerUrl}/rest/styles/${styleName}.sld`;

  return http.get<string>(url, {
    headers: { 'Content-Type': 'application/vnd.ogc.sld+xml' },
    responseType: 'text'
  });
}

export function generateNextGroupId(): number {
  return Math.max(...currentProject.groups.map(({ id }) => id), 0) + 1;
}

export function generateNextLayerId(): number {
  return Math.max(...currentProject.layers.map(({ id }) => id), 0) + 1;
}

export async function createLayer(newLayer: NewCrgLayer, project: CrgProject = currentProject): Promise<CrgLayer> {
  return await http.post<CrgLayer>(await getProjectLayersUrl(project.id), newLayer);
}

export async function updateLayer(
  layerId: number,
  patch: Partial<CrgLayer>,
  project: CrgProject = currentProject
): Promise<void> {
  return await http.patch(await getProjectLayerUrl(project.id, layerId), patch);
}

export async function createLayersGroup(
  newGroup: NewCrgLayersGroup,
  project: CrgProject = currentProject
): Promise<CrgLayersGroup> {
  return await http.post<CrgLayersGroup>(await getProjectGroupsUrl(project.id), newGroup);
}

export async function updateLayersGroup(
  groupId: number,
  patch: Partial<CrgLayersGroup>,
  project: CrgProject = currentProject
): Promise<void> {
  return await http.patch(await getProjectGroupUrl(project.id, groupId), patch);
}

export async function deleteLayersGroup(groupId: number, project: CrgProject = currentProject): Promise<void> {
  return await http.delete(await getProjectGroupUrl(project.id, groupId));
}

async function getGeoserverLayerInfo({ complexName, tableName }: CrgLayer): Promise<GeoserverLayerInfo> {
  const workspace = complexName.split(':')[0];

  const result = await http.get<{ layer: GeoserverLayerInfo }>(
    `${await getGeoServerUrl()}/rest/workspaces/${workspace}/layers/${tableName}`
  );

  return result.layer;
}

export async function getLayerCoverage(layer: CrgLayer): Promise<GeoserverCoverage> {
  const geoserverLayerInfo = await getGeoserverLayerInfo(layer);
  const url = await replaceUrl(geoserverLayerInfo.resource.href, true);
  const result = await http.get<{ coverage: GeoserverCoverage }>(url);

  return result.coverage;
}
