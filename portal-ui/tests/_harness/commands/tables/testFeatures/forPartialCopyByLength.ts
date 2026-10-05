import { cloneDeep } from 'lodash';

import { type NewWfsFeature } from '../../../../../src/app/services/geoserver/wfs/wfs.models';
import { forCopy } from './forCopy';

const sourceGeometry = forCopy[0]?.geometry;

if (!sourceGeometry) {
  throw new Error('У объекта для копирования нет геометрии');
}

function feature(note: string): NewWfsFeature {
  return {
    type: 'Feature',
    geometry: cloneDeep(sourceGeometry),
    properties: { note }
  };
}

export const forPartialCopyByLength: NewWfsFeature[] = [feature('ок'), feature('слишком'), feature('да')];
