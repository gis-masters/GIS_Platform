import { AnnotationsType } from '../../map/labels/map-labels.models';

const AnnotationsTypes = ['length', 'area', 'turningPoints', 'distances', 'annotations', 'turningPointsSettings'];

export function isAnnotationType(value: unknown): value is AnnotationsType {
  return typeof value === 'string' && Object.values(AnnotationsTypes).includes(value);
}
