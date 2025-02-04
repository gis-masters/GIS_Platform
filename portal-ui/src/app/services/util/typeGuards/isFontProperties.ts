import { FontProperties, isTextAlignTypes } from '../../map/labels/map-labels.models';

export function isFontProperties(value: unknown): value is FontProperties {
  return (
    !!value &&
    typeof value === 'object' &&
    'fontSize' in value &&
    'fontColor' in value &&
    'isBold' in value &&
    'isItalic' in value &&
    'textAlign' in value &&
    isTextAlignTypes(value.textAlign)
  );
}
