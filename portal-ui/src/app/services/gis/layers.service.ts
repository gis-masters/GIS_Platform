import { BBOX } from '@fiz/geoserver-types/BBOX';
import { Coordinate } from 'ol/coordinate';
import { AxiosError } from 'axios';

import { currentProject } from '../../stores/CurrentProject.store';
import { CoordinateEdited, WfsFeature } from '../geoserver/wfs.models';
import { http } from '../http.service';
import {
  CrgLayer,
  CrgLayersGroup,
  CrgLayerType,
  CrgProject,
  CrgRasterLayer,
  CrgVectorLayer,
  NewCrgLayer
} from './projects.models';
import { getGeoServerUrl, getProjectLayersUrl, getProjectLayerUrl, replaceUrl } from '../server-urls.service';
import { Toast } from '../../components/Toast/Toast';
import { services } from '../services';
import { PropertyType, Schema } from '../data/schema.models';

interface GeoserverLayerInfo {
  name: string;
  type: CrgLayerType;
  defaultStyle: {
    name: string;
    href: string;
  };
  resource: {
    '@class': string;
    name: string;
    href: string;
  };
  attribution: {
    logoWidth: number;
    logoHeight: number;
  };
}

interface GeoserverCoverage {
  name: string;
  nativeName: string;
  namespace: {
    name: string;
    href: string;
  };
  title: string;
  nativeCRS: {
    '@class': string;
    $: string;
  };
  srs: string;
  nativeBoundingBox: BBOX;
  latLonBoundingBox: BBOX;
  projectionPolicy: string;
  enabled: boolean;
  store: {
    '@class': string;
    name: string;
    href: string;
  };
  serviceConfiguration: boolean;
  grid: {
    '@dimension': string;
    range: {
      low: string;
      high: string;
    };
    transform: {
      scaleX: number;
      scaleY: number;
      shearX: number;
      shearY: number;
      translateX: number;
      translateY: number;
    };
    crs: string;
  };
}

export const crgLayerSchema: Schema = {
  properties: [
    {
      name: 'title',
      title: 'Название слоя',
      propertyType: PropertyType.STRING
    },
    {
      name: 'minZoom',
      title: 'Минимальный уровень масштабирования',
      maxValue: 40,
      description: 'Слой будет скрыт при уровне масштаба меньше указанного',
      propertyType: PropertyType.INT
    },
    {
      name: 'maxZoom',
      title: 'Максимальный уровень масштабирования',
      maxValue: 40,
      description: 'Слой будет скрыт при уровне масштаба больше указанного',
      propertyType: PropertyType.INT
    }
  ]
};

export async function deleteLayer(layerId: number): Promise<void> {
  await http.delete(await getProjectLayerUrl(currentProject.id, layerId));
}

export function getLayerByFeatureInCurrentProject(
  feature: WfsFeature<Coordinate | CoordinateEdited>
): CrgVectorLayer | undefined {
  const [tableName] = feature.id.split('.');

  return currentProject.vectorableLayers.find(l => l.tableName === tableName);
}

export function generateNextLayerId(): number {
  return Math.max(...currentProject.layers.map(({ id }) => id), 0) + 1;
}

export async function createLayer(newLayer: NewCrgLayer, projectId: number): Promise<CrgLayer> {
  return await http.post<CrgLayer>(await getProjectLayersUrl(projectId), newLayer);
}

export async function createRasterLayer(layer: CrgRasterLayer, projectId: number): Promise<CrgLayer> {
  return await http.post<CrgLayer>(await getProjectLayersUrl(projectId), layer);
}

export async function updateLayer(
  layerId: number,
  patch: Partial<CrgLayer>,
  project: CrgProject = currentProject
): Promise<void> {
  return await http.patch(await getProjectLayerUrl(project.id, layerId), patch);
}

async function getGeoserverLayerInfo({ complexName, tableName }: CrgLayer): Promise<GeoserverLayerInfo> {
  const workspace = complexName.split(':')[0];

  const result = await http.get<{ layer: GeoserverLayerInfo }>(
    `${await getGeoServerUrl()}/rest/workspaces/${workspace}/layers/${tableName}`
  );

  return result.layer;
}

export async function getLayerCoverage(layer: CrgLayer): Promise<GeoserverCoverage> {
  const geoserverLayerInfo = await getGeoserverLayerInfo(layer);
  const url = await replaceUrl(geoserverLayerInfo.resource.href, true);
  const result = await http.get<{ coverage: GeoserverCoverage }>(url);

  return result.coverage;
}

export function alertLayerOperationError(
  e: AxiosError<{ errors: Record<string, unknown>[]; message?: string }>,
  payload: Record<string, unknown> | CrgLayersGroup,
  actionText: string,
  actionName: string
): void {
  const payloadDetails = JSON.stringify(payload, null, 2);
  let responseDetails = '-';
  if (e.response) {
    const responseData = JSON.stringify(
      {
        ...e.response,
        request: undefined,
        config: undefined,
        headers: undefined
      },
      null,
      2
    );
    responseDetails = `${e.response.config?.url} \n${responseData}`;
  }

  const message = `Не удалось ${actionText} "${actionName}"`;

  const details = e.response?.data?.message || `Запрос: \n${responseDetails} \n\nДанные: \n${payloadDetails}`;

  Toast.error({ message, details });
  services.logger.error(message, e);
}
