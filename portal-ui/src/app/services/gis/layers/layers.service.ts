import { AxiosError } from 'axios';
import { FeatureType } from '@fiz/geoserver-types/feature-types/FeatureType';

import { currentProject } from '../../../stores/CurrentProject.store';
import { services } from '../../services';
import { CrgProject } from '../projects/projects.models';
import { Toast } from '../../../components/Toast/Toast';

import { layersClient } from './layers.client';
import { isVectorFromFile } from './layers.utils';
import { Schema } from '../../data/schema/schema.models';
import {
  convertGeoserverPropertiesToSchemaProperties,
  getGeometryTypeFromGeoserverAttributes
} from '../../data/schema/schema.utils';
import { schemaService } from '../../data/schema/schema.service';
import { getFeatureType } from '../../geoserver/featuretypes.service';
import { SupportedGeometryType, supportedGeometryTypes } from '../../geoserver/wfs/wfs.models';
import { CrgLayer, CrgLayersGroup, CrgLayerType, CrgRasterLayer, NewCrgLayer } from './layers.models';

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

export async function getLayerSchema(layer: CrgLayer): Promise<Schema> {
  if (layer.type === CrgLayerType.VECTOR) {
    if (!layer.schemaId) {
      throw new Error('Схема не указана у слоя ' + layer.complexName);
    }

    return await schemaService.getSchema(layer.schemaId);
  } else if (layer.type && isVectorFromFile(layer.type)) {
    const featureType: FeatureType = await getFeatureType(layer);
    const properties = convertGeoserverPropertiesToSchemaProperties(featureType.attributes.attribute);
    const geometryType = getGeometryTypeFromGeoserverAttributes(featureType.attributes.attribute);
    const template = `schema_template_${layer.id}_${layer.id}`;
    if (supportedGeometryTypes.includes(geometryType)) {
      return {
        name: template,
        title: template,
        properties,
        readOnly: true,
        geometryType: geometryType as SupportedGeometryType
      };
    }

    services.logger.warn(`Тип геометрии: ${geometryType} не поддерживается`);

    return { name: template, title: template, properties, readOnly: true };
  }

  throw new Error(`Тип слоя: ${layer.type} не поддерживается`);
}
