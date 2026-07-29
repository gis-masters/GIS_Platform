import { type AnnotationsType, type TextAlignTypes } from './map-labels.models';

const textAlignTypes = new Set(['left', 'center', 'right', 'justify']);
const annotationsTypes = new Set([
  'length',
  'area',
  'turningPoints',
  'distances',
  'annotations',
  'turningPointsSettings'
]);

export function isTextAlignTypes(value: unknown): value is TextAlignTypes {
  return typeof value === 'string' && textAlignTypes.has(value);
}

export function isAnnotationType(value: unknown): value is AnnotationsType {
  return typeof value === 'string' && annotationsTypes.has(value);
}
