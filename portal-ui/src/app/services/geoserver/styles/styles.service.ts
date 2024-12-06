import { cloneDeep } from 'lodash';

import { attributesTableStore } from '../../../stores/AttributesTable.store';
import { applyView } from '../../data/schema/schema.utils';
import { CrgVectorLayer } from '../../gis/layers/layers.models';
import { getLayerSchema } from '../../gis/layers/layers.service';
import { mapService } from '../../map/map.service';
import { services } from '../../services';
import { buildCql } from '../../util/cql/buildCql';
import { concatCql } from '../../util/cql/concatCql';
import { Mime } from '../../util/Mime';
import { notFalsyFilter } from '../../util/NotFalsyFilter';
import { GeometryType } from '../wfs/wfs.models';
import { getLegendGraphic } from '../wms/wms.service';
import { stylesClient } from './styles.client';
import {
  CUSTOM_STYLE_NAME,
  FilteredStylesLayerRequest,
  FilteredStylesResponse,
  StyleFilter,
  StyleFilterOperator,
  StyleRule
} from './styles.models';
import { getSupGeometryType } from './styles.utils';

const parsedStyles: Record<string, Promise<StyleRule[]>> = {};

export async function getLayerStyleRules(layer: CrgVectorLayer): Promise<StyleRule[]> {
  const schema = await getLayerSchema(layer);
  const styleName = layer.styleName || schema?.styleName;

  if (!styleName || styleName === CUSTOM_STYLE_NAME) {
    return [];
  }

  if (!parsedStyles[styleName]) {
    parsedStyles[styleName] = loadLayerStyleRules(layer.styleName, layer.complexName);
  }

  return await parsedStyles[styleName];
}

export async function loadLayerStyleRules(styleName?: string, layerComplexName?: string): Promise<StyleRule[]> {
  if (!styleName) {
    return [];
  }

  const sldStyle = await getStyleSld(styleName);
  const xmlDoc = new DOMParser().parseFromString(sldStyle, Mime.XML);

  const rulesWithoutLegend: Omit<StyleRule, 'legend'>[] = [...xmlDoc.querySelectorAll('Rule')]
    .filter(ruleNode => ruleNode.querySelector('Name') && ruleNode.querySelector('Title'))
    .map(ruleNode => ({
      name: ruleNode.querySelector('Name')?.innerHTML || '',
      title: ruleNode.querySelector('Title')?.innerHTML || '',
      filter: ruleNode.querySelector('ElseFilter')
        ? { operator: StyleFilterOperator.ELSE }
        : parseFilter(ruleNode.querySelector('Filter')?.firstElementChild)
    }));

  return await Promise.all(
    rulesWithoutLegend.map(async rule => {
      if (!layerComplexName || !styleName) {
        throw new Error('Невозможно получить легенду: нет имени слоя или стиля');
      }

      const legend = await getLegendGraphic(layerComplexName, rule.name, styleName);

      return { ...rule, legend };
    })
  );
}

function parseFilter(xmlFilter?: Element | null): StyleFilter | undefined {
  if (!xmlFilter) {
    return;
  }

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
      filters: [...xmlFilter.children].map(parseFilter).filter(notFalsyFilter)
    };
  }
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

  // не хранить promise, который поймал ошибку, и при повторном вызове делать новый запрос
  sldStyles[complexStyleName].catch(() => {
    delete sldStyles[complexStyleName];
  });

  return await sldStyles[complexStyleName];
}

export async function filterLegendForCurrentMapView(layers: CrgVectorLayer[]): Promise<FilteredStylesResponse[]> {
  if (!mapService.view) {
    throw new Error('Карта не инициализирована');
  }

  const [x1, y1, x2, y2] = mapService.getCurrentExtend();
  const filterDisabled = cloneDeep(attributesTableStore.filterDisabled);
  const requestData: FilteredStylesLayerRequest[] = await Promise.all(
    layers.map(async layer => {
      const schema = await getLayerSchema(layer);

      if (!schema) {
        throw new Error(`Не удалось получить схему для слоя ${layer.tableName}`);
      }

      const { definitionQuery } = applyView(schema, layer.view);

      let ecqlFilter: string | undefined = definitionQuery;

      if (!filterDisabled[layer.tableName]) {
        ecqlFilter = concatCql(ecqlFilter, buildCql(attributesTableStore.getLayerFilter(layer.tableName)));
      }

      return {
        dataset: layer.dataset,
        identifier: layer.tableName,
        ecqlFilter,
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
      };
    })
  );

  return stylesClient.getLegendForMapView(requestData.filter(({ rules }) => rules.length));
}

const stylesList: Record<'line' | 'polygon' | 'point', string[]> = {
  line: [],
  point: [],
  polygon: []
};

export async function getSimpleStylesListForGeometryType(geometryType: GeometryType): Promise<string[]> {
  const supGeometryType = getSupGeometryType(geometryType);
  if (!stylesList[supGeometryType].length) {
    const dirtyStylesList = await stylesClient.getStylesList();

    stylesList[supGeometryType].push(
      ...dirtyStylesList.styles.style.filter(el => el.name.startsWith(`simple_${supGeometryType}_`)).map(el => el.name)
    );
  }

  return stylesList[supGeometryType];
}
