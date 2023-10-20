import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

import { CustomStyleDescription } from './styles.models';

import { CustomSld } from './CustomSld/CustomSld';

export function buildSimpleSld(layerComplexName: string, style: CustomStyleDescription): string {
  return (
    '<?xml version="1.0" encoding="UTF-8"?>' + renderToString(createElement(CustomSld, { layerComplexName, style }))
  );
}

export function parseCustomStyle(sld: string): CustomStyleDescription {
  throw new Error('Ещё не реализовано, будет в #910' + sld);
}
