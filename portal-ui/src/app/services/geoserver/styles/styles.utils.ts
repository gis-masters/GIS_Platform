import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

import { CustomStyleDescription, FillGraphicType, LineRule, PointRule, PolygonRule } from './styles.models';

import { CustomSld } from './CustomSld/CustomSld';
import { Mime } from '../../util/Mime';

export function buildCustomSld(layerComplexName: string, style: CustomStyleDescription): string {
  return (
    '<?xml version="1.0" encoding="UTF-8"?>' + renderToString(createElement(CustomSld, { layerComplexName, style }))
  );
}

export function parseCustomStyle(sld: string): CustomStyleDescription {
  const sldDocument = new DOMParser().parseFromString(sld, 'application/xml');

  const lineSymbolizerNode = sldDocument.querySelector('LineSymbolizer');
  if (lineSymbolizerNode) {
    return {
      type: 'line',
      rule: parseLineSymbolizer(lineSymbolizerNode)
    };
  }

  const polygonSymbolizerNode = sldDocument.querySelector('PolygonSymbolizer');
  if (polygonSymbolizerNode) {
    return {
      type: 'polygon',
      rule: parsePolygonSymbolizer(polygonSymbolizerNode)
    };
  }

  const pointSymbolizerNode = sldDocument.querySelector('PointSymbolizer');
  if (pointSymbolizerNode) {
    return {
      type: 'point',
      rule: parsePointSymbolizer(pointSymbolizerNode)
    };
  }

  throw new Error('Неизвестный тип стиля');
}

function parsePointSymbolizer(pointSymbolizerNode: Element): PointRule {
  const markTypeNode = pointSymbolizerNode.querySelector('Mark > WellKnownName');
  const markSizeNode = pointSymbolizerNode.querySelector('Size');
  const markColorNode = pointSymbolizerNode.querySelector('Mark > Fill > SvgParameter[name="fill"]');

  if (!markColorNode || !markSizeNode || !markTypeNode) {
    throw new Error('Отсутствуют обязательные параметры для стиля точки');
  }

  return {
    markColor: markColorNode.textContent || undefined,
    markSize: Number(markSizeNode.textContent),
    markType: markTypeNode.textContent as PointRule['markType']
  };
}

export function getStyleTitle(sldStyle: string): string | null | undefined {
  const xmlDoc = new DOMParser().parseFromString(sldStyle, Mime.XML);
  const rules = xmlDoc.querySelectorAll('Rule');
  let styleTitle = xmlDoc.querySelector('NamedLayer Name');

  if (rules.length === 1) {
    styleTitle = xmlDoc.querySelector('UserStyle Rule Title');
  }

  return styleTitle?.textContent;
}

function parseLineSymbolizer(lineSymbolizerNode: Element): LineRule {
  const strokeNode = lineSymbolizerNode.querySelector('SvgParameter[name="stroke"]');
  const strokeWidthNode = lineSymbolizerNode.querySelector('SvgParameter[name="stroke-width"]');
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

  const result: PolygonRule = {
    strokeWidth: strokeWidthNode ? Number(strokeWidthNode.textContent) : undefined,
    strokeColor: strokeColorNode?.textContent || undefined,
    strokeDashArray: strokeDashArrayNode?.textContent
      ? strokeDashArrayNode.textContent.split(' ').map(Number)
      : undefined,
    fillColor: fillColorNode?.textContent || undefined
  };

  const graphicNode = polygonSymbolizerNode.querySelector('Graphic');

  if (graphicNode) {
    const graphicTypeNode = graphicNode.querySelector('Mark > WellKnownName');
    const graphicStrokeColorNode = graphicNode.querySelector('SvgParameter[name="stroke"]');
    const graphicStrokeWidthNode = graphicNode.querySelector('SvgParameter[name="stroke-width"]');
    const graphicStrokeDashArrayNode = graphicNode.querySelector('SvgParameter[name="stroke-dasharray"]');
    const graphicSizeNode = graphicNode.querySelector('Size');

    if (graphicTypeNode) {
      result.fillGraphic = {
        type: graphicTypeNode.textContent as FillGraphicType,
        strokeColor: graphicStrokeColorNode?.textContent || undefined,
        strokeWidth: graphicStrokeWidthNode ? Number(graphicStrokeWidthNode.textContent) : undefined,
        strokeDashArray: graphicStrokeDashArrayNode?.textContent
          ? graphicStrokeDashArrayNode.textContent.split(' ').map(Number)
          : undefined,
        size: graphicSizeNode ? Number(graphicSizeNode.textContent) : undefined
      };
    }
  }

  return result;
}
