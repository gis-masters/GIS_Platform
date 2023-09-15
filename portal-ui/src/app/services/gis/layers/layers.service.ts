import { AxiosError } from 'axios';

import { currentProject } from '../../../stores/CurrentProject.store';
import { services } from '../../services';
import { CrgProject } from '../projects/projects.models';
import { Toast } from '../../../components/Toast/Toast';

import { CrgLayer, CrgLayersGroup, CrgLayerType, CrgRasterLayer, CrgVectorLayer, NewCrgLayer } from './layers.models';
import { layersClient } from './layers.client';
import { Schema } from '../../data/schema/schema.models';
import { convertGeoserverProperties, getGeometryType } from '../../data/schema/schema.utils';
import { getFeatureType } from '../../geoserver/featuretypes.service';
import { FeatureType } from '@fiz/geoserver-types/feature-types/FeatureType';
import { schemaService } from '../../data/schema/schema.service';

export async function deleteLayer(layerId: number, project: CrgProject = currentProject): Promise<void> {
  await layersClient.deleteLayer(layerId, project.id);
}

export async function createLayer(newLayer: NewCrgLayer, projectId: number): Promise<CrgLayer> {
  return await layersClient.createLayer(newLayer, projectId);
}

export async function createRasterLayer(layer: Omit<CrgRasterLayer, 'id'>, projectId: number): Promise<CrgLayer> {
  return await layersClient.createLayer(layer, projectId);
}

export async function updateLayer(
  layerId: number,
  patch: Partial<CrgLayer>,
  project: CrgProject = currentProject
): Promise<void> {
  await layersClient.updateLayer(layerId, patch, project.id);
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

export async function getLayerSchema(layer: CrgVectorLayer): Promise<Schema> {
  const type = layer.type;
  if (type === CrgLayerType.VECTOR) {
    return await schemaService.getSchema(layer.schemaId);
  } else if (type === CrgLayerType.VECTOR_FROM_FILE || type === CrgLayerType.SHP) {
    const featureType: FeatureType = await getFeatureType(layer);

    const properties = convertGeoserverProperties(featureType.attributes.attribute);
    const geometryType = getGeometryType(featureType.attributes.attribute);

    return { name: 'shp_schema', properties, geometryType } as Schema;
  }
}

// for autotests
if (typeof window !== 'undefined') {
  Object.assign(window, { updateLayer });
}
