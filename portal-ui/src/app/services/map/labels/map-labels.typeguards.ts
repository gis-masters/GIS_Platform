import { type TextAlignTypes } from './map-labels.models';

const textAlignTypes = new Set(['left', 'center', 'right', 'justify']);

export function isTextAlignTypes(value: unknown): value is TextAlignTypes {
  return typeof value === 'string' && textAlignTypes.has(value);
}
