import axios from 'axios';
import { type Coordinate } from 'ol/coordinate';

import { Toast } from '../../../components/Toast/Toast';
import { currentProject } from '../../../stores/CurrentProject.store';
import { type WfsFeature } from '../../geoserver/wfs/wfs.models';
import { mapService } from '../../map/map.service';
import { services } from '../../services';
import { isArray } from '../../util/typeGuards/isArray';
import { type NspdGetFeatureInfoResponse } from './nspd-feature-info.models';
import {
  getNspdZouitSearchOptions,
  getRegNumbBorder,
  isNspdZouitFeature,
  isNumericNspdFeatureId,
  isVisibleNspdLayer,
  NSPD_NATIVE_CRS,
  type NspdZouitSearchFeature,
  parseNspdWmsEndpoint,
  toNspdWfsFeature
} from './nspd-feature-info.utils';

const NSPD_FEATURE_COUNT = 10;
/** Тематический поиск НСПД: зоны и территории (ЗОУИТ). */
const NSPD_ZOUIT_THEMATIC_SEARCH_ID = 5;
const NSPD_ZOUIT_SEARCH_API = 'https://nspd.gov.ru/api/geoportal/v2/search/geoportal';
const NSPD_REQUEST_TIMEOUT_MS = 15_000;

interface NspdZouitSearchResponse {
  data?: {
    features?: NspdZouitSearchFeature[];
  };
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
    timeout: NSPD_REQUEST_TIMEOUT_MS
  });

  return response.data;
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

export function hasVisibleNspdLayers(): boolean {
  return currentProject.visibleOnMapLayers.map(({ payload }) => payload).some(isVisibleNspdLayer);
}

/** Полные атрибуты ЗОУИТ по reg_numb_border; при нескольких hit — точное совпадение номера. */
async function getNspdZouitOptionsByRegNumbBorder(regNumbBorder: string): Promise<Record<string, unknown> | null> {
  const params = new URLSearchParams({
    thematicSearchId: String(NSPD_ZOUIT_THEMATIC_SEARCH_ID),
    query: regNumbBorder
  });

  const response = await axios.get<NspdZouitSearchResponse>(`${NSPD_ZOUIT_SEARCH_API}?${params}`, {
    timeout: NSPD_REQUEST_TIMEOUT_MS
  });

  const features = response.data.data?.features || [];
  const match = features.find(feature => {
    const options = getNspdZouitSearchOptions(feature);

    return options !== null && String(options.reg_numb_border) === regNumbBorder;
  });

  if (!match) {
    return null;
  }

  const options = getNspdZouitSearchOptions(match);

  return options ? { ...options } : null;
}

/**
 * Последовательно дозапрашивает полные атрибуты ЗОУИТ (search thematicSearchId=5).
 * Возвращает новый список; исходные WfsFeature не мутирует.
 */
async function enrichNspdZouitFeatures(features: WfsFeature[]): Promise<WfsFeature[]> {
  const enriched: WfsFeature[] = [];

  for (const feature of features) {
    if (!isNspdZouitFeature(feature)) {
      enriched.push(feature);
      continue;
    }

    const regNumbBorder = getRegNumbBorder(feature);
    if (!regNumbBorder) {
      enriched.push(feature);
      continue;
    }

    try {
      const searchOptions = await getNspdZouitOptionsByRegNumbBorder(regNumbBorder);
      if (!searchOptions) {
        services.logger.warn(`НСПД ЗОУИТ: search не нашёл атрибуты для ${regNumbBorder}`);
        enriched.push(feature);
        continue;
      }

      enriched.push({
        ...feature,
        properties: {
          ...feature.properties,
          ...searchOptions
        }
      });
    } catch (error) {
      services.logger.warn(`НСПД ЗОУИТ: ошибка enrichment для ${regNumbBorder}`, error);
      enriched.push(feature);
    }
  }

  return enriched;
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

  return enrichNspdZouitFeatures(collections.flat());
}
