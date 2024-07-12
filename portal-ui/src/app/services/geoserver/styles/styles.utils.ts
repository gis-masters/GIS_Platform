import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

import { Schema } from '../../data/schema/schema.models';
import { Mime } from '../../util/Mime';
import { GeometryType } from '../wfs/wfs.models';
import { isLinear, isPoint, isPolygonal } from '../wfs/wfs.util';
import { CustomSld } from './CustomSld/CustomSld';
import { CustomStyleDescription, FillGraphicType, LineRule, PointRule, PolygonRule } from './styles.models';

const stroke = 'SvgParameter[name="stroke"]';
const strokeWidth = 'SvgParameter[name="stroke-width"]';

export function createImageFromBlob(image: Blob): Promise<string> {
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

export function buildCustomSld(layerComplexName: string, style: CustomStyleDescription): string {
  return (
    '<?xml version="1.0" encoding="UTF-8"?>' + renderToString(createElement(CustomSld, { layerComplexName, style }))
  );
}

export function parseCustomStyle(sld: string, schema?: Schema): CustomStyleDescription {
  const sldDocument = new DOMParser().parseFromString(sld, 'application/xml');

  const lineSymbolizerNode = sldDocument.querySelector('LineSymbolizer');
  const polygonSymbolizerNode = sldDocument.querySelector('PolygonSymbolizer');
  const pointSymbolizerNode = sldDocument.querySelector('PointSymbolizer');
  const textSymbolizerNode = sldDocument.querySelector('TextSymbolizer');

  const labelProperty = textSymbolizerNode?.querySelector('PropertyName');

  if (pointSymbolizerNode && lineSymbolizerNode && polygonSymbolizerNode) {
    return {
      type: 'all',
      rule: getCustomStyleAllRule(sldDocument, schema)
    };
  }

  if (lineSymbolizerNode) {
    const rule = parseLineSymbolizer(lineSymbolizerNode);

    if (labelProperty?.textContent) {
      rule.labelProperty = schema?.properties.find(({ name }) => name === labelProperty?.textContent);
    }

    return {
      type: 'line',
      rule
    };
  }

  if (polygonSymbolizerNode) {
    const rule = parsePolygonSymbolizer(polygonSymbolizerNode);

    if (labelProperty?.textContent) {
      rule.labelProperty = schema?.properties.find(({ name }) => name === labelProperty?.textContent);
    }

    return {
      type: 'polygon',
      rule
    };
  }

  if (pointSymbolizerNode) {
    const rule = parsePointSymbolizer(pointSymbolizerNode);

    if (labelProperty?.textContent) {
      rule.labelProperty = schema?.properties.find(({ name }) => name === labelProperty?.textContent);
    }

    return {
      type: 'point',
      rule
    };
  }

  throw new Error('Неизвестный тип стиля');
}

function parsePointSymbolizer(pointSymbolizerNode: Element): PointRule {
  const markTypeNode = pointSymbolizerNode.querySelector('Mark > WellKnownName');
  const markSizeNode = pointSymbolizerNode.querySelector('Size');
  const markColorNode = pointSymbolizerNode.querySelector('Mark > Fill > SvgParameter[name="fill"]');
  const strokeNode = pointSymbolizerNode.querySelector(stroke);
  const strokeWidthNode = pointSymbolizerNode.querySelector(strokeWidth);

  if (!markColorNode || !markColorNode.textContent || !markSizeNode || !markTypeNode) {
    throw new Error('Отсутствуют обязательные параметры для стиля точки');
  }

  return {
    markColor: markColorNode.textContent,
    markSize: Number(markSizeNode.textContent),
    markType: markTypeNode.textContent as PointRule['markType'],
    strokeColor: strokeNode?.textContent || '#0f5c1a',
    strokeWidth: strokeWidthNode?.textContent ? Number(strokeWidthNode.textContent) : 2
  };
}

export function getStyleTitle(sldStyle: string): string | null | undefined {
  const xmlDoc = new DOMParser().parseFromString(sldStyle, Mime.XML);
  const rules = xmlDoc.querySelectorAll('Rule');
  let titleNode = xmlDoc.querySelector('NamedLayer Name');

  if (rules.length === 1) {
    titleNode = xmlDoc.querySelector('UserStyle Rule Title');
  }

  return titleNode?.textContent;
}

function parseLineSymbolizer(lineSymbolizerNode: Element): LineRule {
  const strokeNode = lineSymbolizerNode.querySelector(stroke);
  const strokeWidthNode = lineSymbolizerNode.querySelector(strokeWidth);
  const strokeDashArrayNode = lineSymbolizerNode.querySelector('SvgParameter[name="stroke-dasharray"]');

  if (!strokeNode || !strokeWidthNode || !strokeNode.textContent) {
    throw new Error('Отсутствуют обязательные параметры для стиля линии');
  }

  return {
    strokeColor: strokeNode.textContent,
    strokeWidth: Number(strokeWidthNode.textContent),
    strokeDashArray: strokeDashArrayNode?.textContent
      ? strokeDashArrayNode.textContent.split(' ').map(Number)
      : undefined
  };
}

function parsePolygonSymbolizer(polygonSymbolizerNode: Element): PolygonRule {
  const strokeColorNode = polygonSymbolizerNode.querySelector(
    'Stroke > SvgParameter[name="stroke"]:not(Graphic SvgParameter)'
  );
  const strokeWidthNode = polygonSymbolizerNode.querySelector(
    'Stroke > SvgParameter[name="stroke-width"]:not(Graphic SvgParameter)'
  );
  const strokeDashArrayNode = polygonSymbolizerNode.querySelector(
    'Stroke > SvgParameter[name="stroke-dasharray"]:not(Graphic SvgParameter)'
  );
  const fillColorNode = polygonSymbolizerNode.querySelector(
    'Fill > SvgParameter[name="fill"]:not(Graphic SvgParameter)'
  );

  if (!strokeWidthNode || !strokeColorNode || !strokeColorNode.textContent) {
    throw new Error('Отсутствуют обязательные параметры для стиля многоугольника');
  }

  const result: Omit<PolygonRule, 'fillColor'> = {
    strokeWidth: Number(strokeWidthNode.textContent),
    strokeColor: strokeColorNode.textContent,
    strokeDashArray: strokeDashArrayNode?.textContent
      ? strokeDashArrayNode.textContent.split(' ').map(Number)
      : undefined
  };

  let fillColor: string | undefined;

  if (fillColorNode?.textContent) {
    fillColor = fillColorNode.textContent;
  }
  const graphicNode = polygonSymbolizerNode.querySelector('Graphic');

  if (graphicNode) {
    const graphicTypeNode = graphicNode.querySelector('Mark > WellKnownName');
    const graphicStrokeColorNode = graphicNode.querySelector(stroke);
    const graphicStrokeWidthNode = graphicNode.querySelector(strokeWidth);
    const graphicSizeNode = graphicNode.querySelector('Size');

    if (
      !graphicTypeNode ||
      !graphicTypeNode.textContent ||
      !graphicStrokeWidthNode ||
      !graphicSizeNode ||
      !graphicStrokeColorNode ||
      !graphicStrokeColorNode.textContent
    ) {
      throw new Error('Отсутствуют обязательные параметры для штриховки');
    }
    result.fillGraphic = {
      type: graphicTypeNode.textContent.replace('shape://', '') as FillGraphicType,
      strokeWidth: Number(graphicStrokeWidthNode.textContent),
      size: Number(graphicSizeNode.textContent)
    };

    fillColor = graphicStrokeColorNode.textContent;
  }

  if (!fillColor) {
    throw new Error('Отсутствует цвет заливки многоугольника');
  }

  return { ...result, fillColor };
}

export function getSupGeometryType(geometryType: GeometryType): 'line' | 'polygon' | 'point' {
  if (isLinear(geometryType)) {
    return 'line';
  } else if (isPolygonal(geometryType)) {
    return 'polygon';
  } else if (isPoint(geometryType)) {
    return 'point';
  }

  throw new Error('неподдерживаемый тип геометрии ' + geometryType);
}

function getCustomStyleAllRule(sldDocument: Document, schema?: Schema): [PointRule, LineRule, PolygonRule] {
  const sldRules = sldDocument.querySelectorAll('Rule');

  let pointRule: PointRule | undefined;
  let lineRule: LineRule | undefined;
  let polygonRule: PolygonRule | undefined;

  for (const rule of sldRules) {
    const textSymbolizerNode = rule.querySelector('TextSymbolizer');
    const labelProperty = textSymbolizerNode?.querySelector('PropertyName');

    const pointSymbolizer = rule.querySelector('PointSymbolizer');
    if (pointSymbolizer) {
      pointRule = parsePointSymbolizer(pointSymbolizer);

      if (labelProperty?.textContent) {
        pointRule.labelProperty = schema?.properties.find(({ name }) => name === labelProperty?.textContent);
      }
    }

    const lineSymbolizer = rule.querySelector('LineSymbolizer');
    if (lineSymbolizer) {
      lineRule = parseLineSymbolizer(lineSymbolizer);

      if (labelProperty?.textContent) {
        lineRule.labelProperty = schema?.properties.find(({ name }) => name === labelProperty?.textContent);
      }
    }

    const polygonSymbolizer = rule.querySelector('PolygonSymbolizer');
    if (polygonSymbolizer) {
      polygonRule = parsePolygonSymbolizer(polygonSymbolizer);

      if (labelProperty?.textContent) {
        polygonRule.labelProperty = schema?.properties.find(({ name }) => name === labelProperty?.textContent);
      }
    }
  }

  if (!pointRule || !lineRule || !polygonRule) {
    throw new Error('Отсутствуют обязательные параметры для стиля');
  }

  return [pointRule, lineRule, polygonRule];
}
