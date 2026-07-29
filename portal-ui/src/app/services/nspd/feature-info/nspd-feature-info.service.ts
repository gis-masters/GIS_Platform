import axios from 'axios';
import { type Coordinate } from 'ol/coordinate';

import { Toast } from '../../../components/Toast/Toast';
import { currentProject } from '../../../stores/CurrentProject.store';
import { createFeatureId } from '../../geoserver/featureType/featureType.util';
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
import { mapService } from '../../map/map.service';
import { services } from '../../services';
import { isArray } from '../../util/typeGuards/isArray';
import {
  type NspdGetFeatureInfoFeature,
  type NspdGetFeatureInfoGeometry,
  type NspdGetFeatureInfoResponse
} from './nspd-feature-info.models';

const NSPD_LAYER_ID_PATH_RE = /\/aeggis\/v\d+\/(\d+)\/wms/i;
const NSPD_FEATURE_COUNT = 10;
const NSPD_NATIVE_CRS = 'EPSG:3857';

interface NspdWmsEndpoint {
  layerId: string;
  wmsUrl: string;
}

function parseNspdWmsEndpoint(dataSourceUri: string): NspdWmsEndpoint | null {
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

export async function getNspdFeatureInfo(
  dataSourceUri: string,
  coordinate: Coordinate
): Promise<NspdGetFeatureInfoResponse> {
  const endpoint = parseNspdWmsEndpoint(dataSourceUri);
  if (!endpoint) {
    throw new Error('Некорректный URL НСПД-слоя');
  }

  const size = mapService.map.getSize();
  if (!size?.[0] || !size[1]) {
    throw new Error('Не удалось получить размер карты для GetFeatureInfo НСПД');
  }

  const view = mapService.map.getView();
  const extent = view.calculateExtent(size);
  const pixel = mapService.map.getPixelFromCoordinate(coordinate);

  if (!pixel) {
    throw new Error('Не удалось получить пиксель клика для GetFeatureInfo НСПД');
  }

  const params = new URLSearchParams({
    REQUEST: 'GetFeatureInfo',
    SERVICE: 'WMS',
    VERSION: '1.3.0',
    FORMAT: 'image/png',
    STYLES: '',
    TRANSPARENT: 'true',
    LAYERS: endpoint.layerId,
    QUERY_LAYERS: endpoint.layerId,
    INFO_FORMAT: 'application/json',
    FEATURE_COUNT: String(NSPD_FEATURE_COUNT),
    I: String(Math.round(pixel[0])),
    J: String(Math.round(pixel[1])),
    WIDTH: String(Math.round(size[0])),
    HEIGHT: String(Math.round(size[1])),
    CRS: NSPD_NATIVE_CRS,
    BBOX: extent.join(',')
  });

  const response = await axios.get<NspdGetFeatureInfoResponse>(`${endpoint.wmsUrl}?${params}`, {
    timeout: 15_000
  });

  return response.data;
}

function normalizeNspdProperties(properties: NspdGetFeatureInfoFeature['properties']): Record<string, unknown> {
  if (!properties) {
    return {};
  }

  const { options } = properties;
  if (options && typeof options === 'object' && !isArray(options)) {
    return { ...options };
  }

  return {};
}

function normalizeNspdGeometry(geometry: NspdGetFeatureInfoGeometry | undefined): WfsGeometry | undefined {
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

function isNumericNspdFeatureId(id: string | number): boolean {
  if (typeof id === 'number') {
    return Number.isInteger(id) && Number.isFinite(id);
  }

  return /^\d+$/.test(id.trim());
}

function toNspdWfsFeature(feature: NspdGetFeatureInfoFeature, resourceId: string): WfsFeature | null {
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

function parseNspdFeatureInfoResponse(data: NspdGetFeatureInfoResponse, resourceId: string): WfsFeature[] {
  if (data?.type !== 'FeatureCollection' || !isArray(data.features)) {
    return [];
  }

  const features: WfsFeature[] = [];
  let skippedInvalidId = 0;

  for (const raw of data.features) {
    if (raw.id !== undefined && raw.id !== null && raw.id !== '' && !isNumericNspdFeatureId(raw.id)) {
      skippedInvalidId++;
      services.logger.warn(`Пропуск объекта НСПД с нечисловым id: ${String(raw.id)} (слой ${resourceId})`);
      continue;
    }

    const feature = toNspdWfsFeature(raw, resourceId);
    if (feature) {
      features.push(feature);
    }
  }

  if (skippedInvalidId > 0) {
    Toast.warn({
      message: 'Часть объектов НСПД пропущена: некорректный идентификатор'
    });
  }

  return features;
}

function isVisibleNspdLayer(layer: {
  type?: CrgLayerType;
  resourceId?: string;
  dataSourceUri?: string;
}): layer is CrgExternalLayer {
  return layer.type === CrgLayerType.EXTERNAL_NSPD && !!layer.resourceId && !!layer.dataSourceUri;
}

export function hasVisibleNspdLayers(): boolean {
  return currentProject.visibleOnMapLayers.map(({ payload }) => payload).some(isVisibleNspdLayer);
}

export async function fetchVisibleNspdFeatures(coordinate: Coordinate): Promise<WfsFeature[]> {
  const nspdLayers = currentProject.visibleOnMapLayers.map(({ payload }) => payload).filter(isVisibleNspdLayer);

  if (!nspdLayers.length) {
    return [];
  }

  const collections = await Promise.all(
    nspdLayers.map(async layer => {
      try {
        const data = await getNspdFeatureInfo(layer.dataSourceUri, coordinate);

        return parseNspdFeatureInfoResponse(data, layer.resourceId);
      } catch (error) {
        services.logger.warn(
          `Ошибка GetFeatureInfo НСПД: ${layer.title} (${layer.resourceId || 'без resourceId'})`,
          error
        );

        return [];
      }
    })
  );

  return collections.flat();
}
