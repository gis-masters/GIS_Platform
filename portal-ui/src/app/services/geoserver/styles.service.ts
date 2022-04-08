import { getActualLegendUrl, getGeoServerUrl, getWmsUrl } from '../server-urls.service';
import { CrgVectorLayer } from '../crg/projects.models';
import { mapService } from '../map/map.service';
import { WfsGeometry } from './wfs.models';
import { http } from '../http.service';
import { Mime } from '../util/Mime';

export interface StyleRule {
  name: string;
  title: string;
  legend: string;
  filter: StyleFilter;
}

export interface FilteredStylesResponse {
  dataset: string;
  identifier: string;
  rules: string[];
}

enum StyleFilterOperator {
  AND = 'And',
  OR = 'Or',
  NOT = 'Not',
  EQUAL_TO = 'PropertyIsEqualTo',
  NOT_EQUAL_TO = 'PropertyIsNotEqualTo',
  LESS_THAN = 'PropertyIsLessThan',
  LESS_THAN_OR_EQUAL_TO = 'PropertyIsLessThanOrEqualTo',
  GREATER_THEN = 'PropertyIsGreaterThan',
  GREATER_THEN_OR_EQUAL_TO = 'PropertyIsGreaterThanOrEqualTo',
  LIKE = 'PropertyIsLike',
  INTERSECTS = 'Intersects',
  ELSE = 'ElseFilter'
}

type StyleFilter = StyleFilterLogical | StyleFilterComparison | StyleFilterSpatial | StyleFilterElse;

interface StyleFilterLogical {
  operator: StyleFilterOperator.AND | StyleFilterOperator.OR | StyleFilterOperator.NOT;
  filters: StyleFilter[];
}

interface StyleFilterComparison {
  operator:
    | StyleFilterOperator.EQUAL_TO
    | StyleFilterOperator.NOT_EQUAL_TO
    | StyleFilterOperator.LESS_THAN
    | StyleFilterOperator.LESS_THAN_OR_EQUAL_TO
    | StyleFilterOperator.GREATER_THEN
    | StyleFilterOperator.GREATER_THEN_OR_EQUAL_TO
    | StyleFilterOperator.LIKE;
  propertyName: string;
  literal: string | number;
  matchCase?: boolean;
}

interface StyleFilterSpatial {
  operator: StyleFilterOperator.INTERSECTS;
  propertyName?: string;
  literal: WfsGeometry;
}

interface StyleFilterElse {
  operator: StyleFilterOperator.ELSE;
}

const sldStyles: Record<string, Promise<StyleRule[]>> = {};

export async function getLayerStyleRules(layer: CrgVectorLayer): Promise<StyleRule[]> {
  if (!sldStyles[layer.styleName]) {
    sldStyles[layer.styleName] = _loadLayerStyle(layer);
  }

  return await sldStyles[layer.styleName];
}

async function _loadLayerStyle(layer: CrgVectorLayer): Promise<StyleRule[]> {
  const sldStyle = await getStyleSld(layer.styleName);
  const xmlDoc = new DOMParser().parseFromString(sldStyle, Mime.XML);

  const rulesWithoutLegend: Omit<StyleRule, 'legend'>[] = [...xmlDoc.querySelectorAll('Rule')]
    .filter(ruleXml => ruleXml.querySelector('Name') && ruleXml.querySelector('Title'))
    .map(ruleXml => ({
      name: ruleXml.querySelector('Name').innerHTML,
      title: ruleXml.querySelector('Title').innerHTML,
      filter: ruleXml.querySelector('ElseFilter')
        ? { operator: StyleFilterOperator.ELSE }
        : parseFilter(ruleXml.querySelector('Filter')?.firstElementChild)
    }));

  return await Promise.all(
    rulesWithoutLegend.map(async rule => {
      const blob = await getLegendGraphicByRuleName(layer.complexName, rule.name);
      const img = await createImageFromBlob(blob);

      return {
        ...rule,
        legend: img
      };
    })
  );
}

function parseFilter(xmlFilter?: Element): StyleFilter | undefined {
  let operator = xmlFilter?.tagName;

  if (operator?.includes(':')) {
    operator = operator.split(':')[1];
  }

  if (
    operator === StyleFilterOperator.EQUAL_TO ||
    operator === StyleFilterOperator.NOT_EQUAL_TO ||
    operator === StyleFilterOperator.EQUAL_TO ||
    operator === StyleFilterOperator.NOT_EQUAL_TO ||
    operator === StyleFilterOperator.LESS_THAN ||
    operator === StyleFilterOperator.LESS_THAN_OR_EQUAL_TO ||
    operator === StyleFilterOperator.GREATER_THEN ||
    operator === StyleFilterOperator.GREATER_THEN_OR_EQUAL_TO
  ) {
    return {
      operator,
      propertyName: xmlFilter.querySelector('PropertyName').innerHTML,
      literal: xmlFilter.querySelector('Literal').innerHTML
    };
  }

  if (operator === StyleFilterOperator.INTERSECTS) {
    // not implemented
    return;
  }

  if (
    operator === StyleFilterOperator.AND ||
    operator === StyleFilterOperator.OR ||
    operator === StyleFilterOperator.NOT
  ) {
    return {
      operator,
      filters: [...xmlFilter.children].map(parseFilter).filter(filter => filter)
    };
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
    headers: { 'Content-Type': Mime.SLD },
    responseType: 'text'
  });
}

export async function filterLegendForCurrentMapView(layers: CrgVectorLayer[]): Promise<FilteredStylesResponse[]> {
  const [x1, y1, x2, y2] = mapService.view.calculateExtent();

  return http.post<FilteredStylesResponse[]>(
    await getActualLegendUrl(),
    await Promise.all(
      layers.map(async layer => ({
        dataset: layer.dataset,
        identifier: layer.tableName,
        filter: {
          operator: 'Intersects',
          propertyName: 'shape',
          literal: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [x1, y1],
                  [x2, y1],
                  [x2, y2],
                  [x1, y2],
                  [x1, y1]
                ]
              ]
            ]
          }
        },
        rules: await getLayerStyleRules(layer)
      }))
    ),
    { cache: { disabled: false, clear: false } }
  );
}
