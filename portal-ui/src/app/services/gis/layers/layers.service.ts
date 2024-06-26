import { createElement } from 'react';
import { ListItemIcon, Tooltip } from '@mui/material';
import { FilterAltOutlined } from '@mui/icons-material';
import { FeatureType } from '@fiz/geoserver-types/feature-types/FeatureType';
import { AxiosError } from 'axios';

import { Toast } from '../../../components/Toast/Toast';
import { currentProject } from '../../../stores/CurrentProject.store';
import { PropertyOption, Schema } from '../../data/schema/schema.models';
import { schemaService } from '../../data/schema/schema.service';
import {
  convertGeoserverPropertiesToSchemaProperties,
  getGeometryTypeFromGeoserverAttributes
} from '../../data/schema/schema.utils';
import { getVectorTable } from '../../data/vectorData/vectorData.service';
import { getFeatureType } from '../../geoserver/featureType/featureType.service';
import { SupportedGeometryType, supportedGeometryTypes } from '../../geoserver/wfs/wfs.models';
import { services } from '../../services';
import { CrgProject } from '../projects/projects.models';
import { layersClient } from './layers.client';
import { CrgLayer, CrgLayersGroup, CrgLayerType, CrgRasterLayer, NewCrgLayer } from './layers.models';
import { isVectorFromFile } from './layers.utils';

export async function getLayers(projectId: number): Promise<CrgLayer[]> {
  return await layersClient.getLayers(projectId);
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

export async function deleteLayer(layerId: number, project: CrgProject = currentProject): Promise<void> {
  await layersClient.deleteLayer(layerId, project.id);
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

export async function getLayerSchema(layer?: CrgLayer): Promise<Schema | undefined> {
  if (!layer) {
    return undefined;
  }

  if (layer.type === CrgLayerType.VECTOR) {
    if (!layer.dataset || !layer.tableName) {
      throw new Error('Векторный слой подключен с ошибкой');
    }
    const vectorTable = await getVectorTable(layer.dataset, layer.tableName);

    return vectorTable.schema;
  } else if (layer.type === CrgLayerType.DXF) {
    return await schemaService.getSchema('dxf_schema_v1');
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
        styleName: 'generic',
        geometryType: geometryType as SupportedGeometryType
      };
    }

    services.logger.warn(`Тип геометрии: ${geometryType} не поддерживается`);

    return { name: template, title: template, properties, readOnly: true };
  }

  throw new Error(`Тип слоя: ${layer.type} не поддерживается`);
}

export function getViewChoiceOptions(schema: Schema): PropertyOption[] {
  const views = schema.views || [];

  return [
    { title: `${schema.title} (по-умолчанию)`, value: '' },
    ...(views.map(type => ({
      title: type.title || '',
      value: type.id,
      endIcon: type.definitionQuery
        ? createElement(Tooltip, {
            title: createElement(
              'span',
              {},
              'Для этого представления задан определяющий запрос (Definition Query). Будут отображены только объекты, удовлетворяющие условию запроса:',
              createElement('br'),
              createElement('code', { children: type.definitionQuery })
            ),
            children: createElement(ListItemIcon, {}, createElement(FilterAltOutlined, { fontSize: 'small' }))
          })
        : undefined
    })) || [])
  ];
}
