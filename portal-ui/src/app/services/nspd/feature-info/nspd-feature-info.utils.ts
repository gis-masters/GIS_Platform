import { createFeatureId, extractResourceIdFromFeatureId } from '../../geoserver/featureType/featureType.util';
import {
  GeometryType,
  type WfsFeature,
  type WfsGeometry,
  type WfsLineStringGeometry,
  type WfsMultiLineStringGeometry,
  type WfsMultiPointGeometry,
  type WfsMultiPolygonGeometry,
  type WfsPointGeometry,
  type WfsPolygonGeometry
} from '../../geoserver/wfs/wfs.models';
import { type CrgExternalLayer, CrgLayerType } from '../../gis/layers/layers.models';
import { isArray } from '../../util/typeGuards/isArray';
import {
  getNspdKnownLayer,
  type NspdGetFeatureInfoFeature,
  type NspdGetFeatureInfoGeometry
} from './nspd-feature-info.models';

const NSPD_LAYER_ID_PATH_RE = /\/aeggis\/v\d+\/(\d+)\/wms/i;
export const NSPD_NATIVE_CRS = 'EPSG:3857';
const NSPD_ZOUIT_SCHEMA_NAME = 'nspd_zouit';

export interface NspdWmsEndpoint {
  layerId: string;
  wmsUrl: string;
}

export interface NspdZouitSearchFeature {
  id?: string | number;
  properties?: {
    options?: Record<string, unknown>;
    [key: string]: unknown;
  };
}

export function parseNspdWmsEndpoint(dataSourceUri: string): NspdWmsEndpoint | null {
  try {
    const url = new URL(dataSourceUri);
    const pathMatch = NSPD_LAYER_ID_PATH_RE.exec(url.pathname);
    const layerId = pathMatch?.[1] || url.searchParams.get('LAYERS') || url.searchParams.get('layers');

    if (!layerId) {
      return null;
    }

    return {
      layerId,
      wmsUrl: `${url.origin}${url.pathname}`
    };
  } catch {
    return null;
  }
}

export function normalizeNspdProperties(properties: NspdGetFeatureInfoFeature['properties']): Record<string, unknown> {
  if (!properties) {
    return {};
  }

  const { options } = properties;
  if (options && typeof options === 'object' && !isArray(options)) {
    return { ...options };
  }

  return {};
}

export function normalizeNspdGeometry(geometry: NspdGetFeatureInfoGeometry | undefined): WfsGeometry | undefined {
  if (!geometry?.type || geometry.coordinates === undefined) {
    return undefined;
  }

  switch (geometry.type) {
    case GeometryType.POINT: {
      return {
        type: GeometryType.POINT,
        coordinates: geometry.coordinates as WfsPointGeometry['coordinates']
      };
    }
    case GeometryType.MULTI_POINT: {
      return {
        type: GeometryType.MULTI_POINT,
        coordinates: geometry.coordinates as WfsMultiPointGeometry['coordinates']
      };
    }
    case GeometryType.LINE_STRING: {
      return {
        type: GeometryType.MULTI_LINE_STRING,
        coordinates: [geometry.coordinates as WfsLineStringGeometry['coordinates']]
      };
    }
    case GeometryType.MULTI_LINE_STRING: {
      return {
        type: GeometryType.MULTI_LINE_STRING,
        coordinates: geometry.coordinates as WfsMultiLineStringGeometry['coordinates']
      };
    }
    case GeometryType.POLYGON: {
      return {
        type: GeometryType.MULTI_POLYGON,
        coordinates: [geometry.coordinates as WfsPolygonGeometry['coordinates']]
      };
    }
    case GeometryType.MULTI_POLYGON: {
      return {
        type: GeometryType.MULTI_POLYGON,
        coordinates: geometry.coordinates as WfsMultiPolygonGeometry['coordinates']
      };
    }
    default: {
      return undefined;
    }
  }
}

export function isNumericNspdFeatureId(id: string | number): boolean {
  if (typeof id === 'number') {
    return Number.isInteger(id) && Number.isFinite(id);
  }

  return /^\d+$/.test(id.trim());
}

export function toNspdWfsFeature(feature: NspdGetFeatureInfoFeature, resourceId: string): WfsFeature | null {
  if (feature.id === undefined || feature.id === null || feature.id === '') {
    return null;
  }

  return {
    type: 'Feature',
    id: createFeatureId(resourceId, NSPD_NATIVE_CRS, String(feature.id).trim()),
    geometry: normalizeNspdGeometry(feature.geometry),
    geometry_name: 'geometry',
    properties: normalizeNspdProperties(feature.properties)
  };
}

export function isVisibleNspdLayer(layer: {
  type?: CrgLayerType;
  resourceId?: string;
  dataSourceUri?: string;
}): layer is CrgExternalLayer {
  return layer.type === CrgLayerType.EXTERNAL_NSPD && !!layer.resourceId && !!layer.dataSourceUri;
}

export function isNspdZouitFeature(feature: WfsFeature): boolean {
  try {
    const resourceId = extractResourceIdFromFeatureId(feature.id);

    return getNspdKnownLayer(resourceId)?.schemaName === NSPD_ZOUIT_SCHEMA_NAME;
  } catch {
    return false;
  }
}

export function getRegNumbBorder(feature: WfsFeature): string | null {
  const value = feature.properties?.reg_numb_border;
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  return null;
}

export function getNspdZouitSearchOptions(feature: NspdZouitSearchFeature): Record<string, unknown> | null {
  const { options } = feature.properties || {};
  if (!options || typeof options !== 'object' || isArray(options)) {
    return null;
  }

  return options;
}
