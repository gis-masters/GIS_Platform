import { TextStyleProperties } from '../../map/labels/map-labels.models';

const keyNames = new Set(['fontSize', 'fontColor', 'isBold', 'isItalic', 'textAlign']);

export function isLabelTextProperties(properties: unknown): properties is TextStyleProperties {
  return typeof properties === 'object' && Object.keys(properties).some(key => keyNames.has(key));
}
