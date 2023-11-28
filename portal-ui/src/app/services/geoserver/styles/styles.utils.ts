import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

import { CustomSld } from './CustomSld/CustomSld';
import { Mime } from '../../util/Mime';

import { CustomStyleDescription, FillGraphicType, LineRule, PointRule, PolygonRule } from './styles.models';

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

  if (!markColorNode || !markColorNode.textContent || !markSizeNode || !markTypeNode) {
    throw new Error('Отсутствуют обязательные параметры для стиля точки');
  }

  return {
    markColor: markColorNode.textContent,
    markSize: Number(markSizeNode.textContent),
    markType: markTypeNode.textContent as PointRule['markType']
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
    const graphicStrokeColorNode = graphicNode.querySelector('SvgParameter[name="stroke"]');
    const graphicStrokeWidthNode = graphicNode.querySelector('SvgParameter[name="stroke-width"]');
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
