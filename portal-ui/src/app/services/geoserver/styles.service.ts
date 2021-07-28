import { getGeoServerUrl, getWmsUrl } from '../server-urls.service';
import { CrgLayer } from '../crg/projects.models';
import { http } from '../http.service';

import { currentProject } from '../../stores/CurrentProject.store';
import { sleep } from '../util/sleep';
import { patch } from '../util/patch';

export interface Rule {
  name: string;
  title: string;
  legend: string;
}

const sldStyles: Record<string, Promise<string>> = {};

export async function loadAllLayersStyles(): Promise<void> {
  for (const { payload: layer } of currentProject.visibleLayersWithoutRasters) {
    await loadLayerStyle(layer);
  }
}

export async function loadLayerStyle(layer: CrgLayer): Promise<void> {
  if (sldStyles[layer.styleName]) {
    await sldStyles[layer.styleName];
    await sleep(0);

    return;
  }

  sldStyles[layer.styleName] = getStyleSld(layer.styleName);
  const sldStyle = await sldStyles[layer.styleName];
  const xmlDoc = new DOMParser().parseFromString(sldStyle, 'text/xml');
  const rulesWithoutLegend: Omit<Rule, 'legend'>[] = [...xmlDoc.querySelectorAll('Rule')]
    .filter(ruleXml => ruleXml.querySelector('Name') && ruleXml.querySelector('Title'))
    .map(ruleXml => ({
      name: ruleXml.querySelector('Name').innerHTML,
      title: ruleXml.querySelector('Title').innerHTML
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

  patch(layer, { style: rules });
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
 * @param ruleName          Название правила в стиле.
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
  const geoServerUrl = await getGeoServerUrl();
  const workspacesUrl = geoServerUrl + '/rest/workspaces/';
  const names = complexStyleName.split(':');
  names.reverse();
  const [styleName, workspaceName] = names;
  const url = workspaceName
    ? `${workspacesUrl}${workspaceName}/styles/${styleName}.sld`
    : `${geoServerUrl}/rest/styles/${styleName}.sld`;

  return http.get<string>(url, {
    headers: { 'Content-Type': 'application/vnd.ogc.sld+xml' },
    responseType: 'text'
  });
}
