import { BBOX } from '@fiz/geoserver-types/BBOX';
import { Coordinate } from 'ol/coordinate';
import { AxiosError } from 'axios';

import { sidebars } from '../../stores/Sidebars.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { CoordinateEdited, WfsFeature } from './wfs.models';
import { http } from '../http.service';
import {
  CrgLayer,
  CrgLayersGroup,
  CrgLayerType,
  CrgProject,
  NewCrgLayer,
  NewCrgLayersGroup
} from '../crg/projects.models';
import {
  getGeoServerUrl,
  getProjectGroupsUrl,
  getProjectGroupUrl,
  getProjectLayersUrl,
  getProjectLayerUrl,
  replaceUrl
} from '../server-urls.service';
import { Toast } from '../../components/Toast/Toast';
import { services } from '../services';

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

export async function deleteLayer(layerId: number): Promise<void> {
  await http.delete(await getProjectLayerUrl(currentProject.id, layerId));
  if (sidebars.layerForAttributes?.id === layerId) {
    sidebars.closeAttributes();
  }
}

export function getFeatureLayer(feature: WfsFeature<Coordinate | CoordinateEdited>): CrgLayer {
  const [layerName] = feature.id.split('.');

  return currentProject.vectorLayers.find(l => l.tableName === layerName);
}

export function generateNextGroupId(): number {
  return Math.max(...currentProject.groups.map(({ id }) => id), 0) + 1;
}

export function generateNextLayerId(): number {
  return Math.max(...currentProject.layers.map(({ id }) => id), 0) + 1;
}

export async function createLayer(newLayer: NewCrgLayer, projectId: number): Promise<CrgLayer> {
  return await http.post<CrgLayer>(await getProjectLayersUrl(projectId), newLayer);
}

export async function updateLayer(
  layerId: number,
  patch: Partial<CrgLayer>,
  project: CrgProject = currentProject
): Promise<void> {
  return await http.patch(await getProjectLayerUrl(project.id, layerId), patch);
}

export async function createLayersGroup(newGroup: NewCrgLayersGroup, projectId: number): Promise<CrgLayersGroup> {
  return await http.post<CrgLayersGroup>(await getProjectGroupsUrl(projectId), newGroup);
}

export async function updateLayersGroup(
  groupId: number,
  patch: Partial<CrgLayersGroup>,
  project: CrgProject = currentProject
): Promise<void> {
  return await http.patch(await getProjectGroupUrl(project.id, groupId), patch);
}

export async function deleteLayersGroup(groupId: number, project: CrgProject = currentProject): Promise<void> {
  return await http.delete(await getProjectGroupUrl(project.id, groupId));
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
  payload: Record<string, unknown>,
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

  const details = e.response?.data?.message
    ? e.response.data.message
    : `Запрос: \n${responseDetails} \n\nДанные: \n${payloadDetails}`;

  Toast.error({ message, details });
  services.logger.error(message, e);
}
