import { isObject } from 'lodash';

import { type GeoserverPublicationData, type PlaceFileProcess } from './processes.models';

export function isGeoserverPublicationData(obj: unknown): obj is GeoserverPublicationData {
  return (
    isObject(obj) &&
    'workspaceName' in obj &&
    typeof obj.workspaceName === 'string' &&
    'storeName' in obj &&
    typeof obj.storeName === 'string' &&
    'featureTypeName' in obj &&
    typeof obj.featureTypeName === 'string' &&
    'nativeName' in obj &&
    typeof obj.nativeName === 'string'
  );
}

export function isPlaceFileProcess(obj: unknown): obj is PlaceFileProcess {
  return (
    isObject(obj) &&
    'geoserverPublicationData' in obj &&
    typeof obj.geoserverPublicationData === 'object' &&
    isGeoserverPublicationData(obj.geoserverPublicationData)
  );
}
