import { cloneDeep } from 'lodash';

import { sidebars } from '../../stores/Sidebars.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { CrgLayer, CrgLayersGroup, CrgProject, NewCrgLayersGroup, Rule } from '../crg/projects.models';
import { serverProperties } from '../server-properties.service';
import { WfsFeature } from '../geoserver/wfs-models';
import { patch } from '../util/patch';
import { http } from '../http.service';
import { services } from '../services';

export async function deleteLayer(layerId: number) {
  await http.delete(`${await serverProperties.projectsUrl}/${currentProject.id}/layers/${layerId}`);
  if (sidebars.layerForAttributes?.id === layerId) {
    sidebars.closeAttributes();
  }
}

export async function loadLayerLegend(layer: CrgLayer) {
  if (layer.legend || layer.legendIsFetching) {
    return;
  }

  patch(layer, { legendIsFetching: true });

  const styleSld: string = await getStyleSld(layer.styleName);
  const xmlDoc = new DOMParser().parseFromString(styleSld, 'text/xml');
  const rules: Rule[] = Array.from(xmlDoc.querySelectorAll('Rule'))
    .filter(rule => rule.querySelector('Name') && rule.querySelector('Title'))
    .map(rule => ({
      name: rule.querySelector('Name').innerHTML,
      title: rule.querySelector('Title').innerHTML
    }));
  const rulesWithLegend = await Promise.all(
    rules.map(async rule => {
      const blob = await getLegendGraphicByRuleName(layer.complexName, rule.name);
      const img = await createImageFromBlob(blob);

      return {
        ...rule,
        legend: img
      };
    })
  );

  patch(layer, {
    legend: rulesWithLegend,
    legendIsFetching: false
  });
}

export function getFeatureLayer(feature: WfsFeature): CrgLayer {
  const [layerName] = feature.id.split('.');

  return currentProject.vectorLayers.find(l => l.internalName === layerName);
}

// на будущее
async function updateLayerOrGroup<T extends CrgLayer | CrgLayersGroup>(
  item: T,
  itemPatch: Partial<T>,
  isGroup: boolean
) {
  await services.provided;
  const backup = cloneDeep(item);
  const path = isGroup ? 'groups' : 'layers';
  patch(item, itemPatch);
  try {
    const url = `${await serverProperties.projectsUrl}/${currentProject.id}/${path}/${item.id}`;
    await http.patch(url, itemPatch);
  } catch (err) {
    patch(item, backup);
  }
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

  return http.get(`${await serverProperties.geoServerUrl}/wms`, { responseType: 'blob', params });
}

/**
 * Get the style SLD definition body.
 *
 * @param complexStyleName style name or complex style name ("workspace_name:style_name")
 */
async function getStyleSld(complexStyleName: string): Promise<string> {
  const styleNameArr = complexStyleName.split(':');
  const styleName = styleNameArr.pop();
  const geoServerUrl = await serverProperties.geoServerUrl;
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

export async function updateLayer(
  layerId: number,
  patch: Partial<CrgLayer>,
  project: CrgProject = currentProject
): Promise<void> {
  return await http.patch(`${await serverProperties.projectsUrl}/${project.id}/layers/${layerId}`, patch);
}

export async function createLayersGroup(
  newGroup: NewCrgLayersGroup,
  project: CrgProject = currentProject
): Promise<CrgLayersGroup> {
  return await http.post<CrgLayersGroup>(`${await serverProperties.projectsUrl}/${project.id}/groups/`, newGroup);
}

export async function updateLayersGroup(
  groupId: number,
  patch: Partial<CrgLayersGroup>,
  project: CrgProject = currentProject
): Promise<void> {
  return await http.patch(`${await serverProperties.projectsUrl}/${project.id}/groups/${groupId}`, patch);
}

export async function deleteLayersGroup(groupId: number, project: CrgProject = currentProject): Promise<void> {
  return await http.delete(`${await serverProperties.projectsUrl}/${project.id}/groups/${groupId}`);
}
