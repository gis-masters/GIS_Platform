import { cloneDeep } from 'lodash';

import { attributesTableStore } from '../../../stores/AttributesTable.store';
import { CrgVectorLayer } from '../../gis/layers/layers.models';
import { getLegendGraphic } from '../wms/wms.service';
import { mapService } from '../../map/map.service';
import { GeometryType } from '../wfs/wfs.models';
import { cqlBuild } from '../../util/cqlBuild';
import { services } from '../../services';
import { Mime } from '../../util/Mime';

import {
  FilteredStylesLayerRequest,
  FilteredStylesResponse,
  StyleFilter,
  StyleFilterOperator,
  StyleRule
} from './styles.models';
import { stylesClient } from './styles.client';

const parsedStyles: Record<string, Promise<StyleRule[]>> = {};

export async function getLayerStyleRules(layer: CrgVectorLayer): Promise<StyleRule[]> {
  if (!parsedStyles[layer.styleName]) {
    parsedStyles[layer.styleName] = loadLayerStyleRules(layer);
  }

  return await parsedStyles[layer.styleName];
}

async function loadLayerStyleRules(layer: CrgVectorLayer): Promise<StyleRule[]> {
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
      const blob = await getLegendGraphic(layer.complexName, rule.name, layer.styleName);
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
    const propertyNameElement = xmlFilter.querySelector('PropertyName');
    const literalElement = xmlFilter.querySelector('Literal');
    if (!propertyNameElement || !literalElement) {
      services.logger.warn('Не удалось распарсить легенду: ', xmlFilter);

      return;
    }

    return {
      operator,
      propertyName: propertyNameElement.innerHTML,
      literal: literalElement.innerHTML
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
      filters: [...xmlFilter.children].map(parseFilter).filter(Boolean)
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

// sld's cache
const sldStyles: Record<string, Promise<string>> = {};

/**
 * Get the style SLD definition body.
 *
 * @param complexStyleName style name or complex style name ("workspace_name:style_name")
 */
export async function getStyleSld(complexStyleName: string): Promise<string> {
  if (!sldStyles[complexStyleName]) {
    sldStyles[complexStyleName] = stylesClient.getStyleSld(complexStyleName);
  }

  return await sldStyles[complexStyleName];
}

export async function filterLegendForCurrentMapView(layers: CrgVectorLayer[]): Promise<FilteredStylesResponse[]> {
  const [x1, y1, x2, y2] = mapService.view.calculateExtent();
  const filterDisabled = cloneDeep(attributesTableStore.filterDisabled);
  const requestData: FilteredStylesLayerRequest[] = await Promise.all(
    layers.map(async layer => ({
      dataset: layer.dataset,
      identifier: layer.tableName,
      ecqlFilter: filterDisabled[layer.tableName]
        ? null
        : cqlBuild(attributesTableStore.getLayerFilter(layer.tableName)),
      filter: {
        operator: StyleFilterOperator.INTERSECTS,
        propertyName: 'shape',
        literal: {
          type: GeometryType.MULTI_POLYGON,
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
  );

  return stylesClient.getLegendForMapView(requestData);
}
