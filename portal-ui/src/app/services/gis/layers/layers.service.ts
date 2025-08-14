import { createElement } from 'react';
import { ListItemIcon, Tooltip } from '@mui/material';
import { FilterAltOutlined } from '@mui/icons-material';
import { AxiosError } from 'axios';

import { Toast } from '../../../components/Toast/Toast';
import { currentProject } from '../../../stores/CurrentProject.store';
import { schemaCacheService } from '../../cache/schema-cache.service';
import { getFileInfo } from '../../data/files/files.service';
import { getFileBaseName, getLibraryRecordFiles } from '../../data/files/files.util';
import { getLibraryRecord } from '../../data/library/library.service';
import { PropertyOption, Schema } from '../../data/schema/schema.models';
import { schemaService } from '../../data/schema/schema.service';
import {
  convertGeoserverPropertiesToSchemaProperties,
  getGeometryTypeFromGeoserverAttributes
} from '../../data/schema/schema.utils';
import { getVectorTable } from '../../data/vectorData/vectorData.service';
import { FeatureType } from '../../geoserver/featureType/featureType.model';
import { getFeatureType } from '../../geoserver/featureType/featureType.service';
import { SupportedGeometryType, supportedGeometryTypes } from '../../geoserver/wfs/wfs.models';
import { services } from '../../services';
import { CrgProject } from '../projects/projects.models';
import { layersClient } from './layers.client';
import {
  CrgLayer,
  CrgLayersGroup,
  CrgLayerType,
  CrgRasterLayer,
  NewCrgLayer,
  RelatedVectorLayers
} from './layers.models';
import { isLayerFromFile, isVectorFromFile } from './layers.utils';

export async function getLayers(projectId: number): Promise<CrgLayer[]> {
  return await layersClient.getLayers(projectId);
}

export async function getRelatedLayers(field: string, value: string): Promise<RelatedVectorLayers[]> {
  return await layersClient.getRelatedLayers(field, value);
}

export async function createLayer(newLayer: NewCrgLayer, projectId: number): Promise<CrgLayer> {
  if (isLayerFromFile(newLayer)) {
    if (!newLayer.libraryId || !newLayer.recordId) {
      throw new Error('Ошибка получения данных слоя');
    }

    const document = await getLibraryRecord(newLayer.libraryId, newLayer.recordId);
    const files = getLibraryRecordFiles(document);
    const fileInfo = files.find(({ id }) => id === newLayer.tableName?.split('__')[1]);

    if (!fileInfo) {
      throw new Error('Не найден источник данных файлового слоя');
    }

    const fullFileInfo = await getFileInfo(fileInfo.id);

    if (!fullFileInfo.path) {
      throw new Error('Ошибка получения пути источника данных файлового слоя');
    }

    const pathToFile = fullFileInfo.path.split('/').at(-1);
    const nativeName = pathToFile && getFileBaseName(pathToFile);

    return await layersClient.createLayer({ ...newLayer, nativeName }, projectId);
  }

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

  schemaCacheService.prettyPrint();

  if (layer.type === CrgLayerType.VECTOR) {
    if (!layer.dataset || !layer.tableName) {
      throw new Error('Векторный слой подключен с ошибкой');
    }

    const schemaFromCache = schemaCacheService.getFromCache(layer.tableName);
    if (schemaFromCache) {
      return schemaFromCache;
    }

    const vectorTable = await getVectorTable(layer.dataset, layer.tableName);

    schemaCacheService.addToCache(layer.tableName, vectorTable.schema);

    return vectorTable.schema;
  } else if (layer.type === CrgLayerType.DXF) {
    return await schemaService.getSchema('dxf_schema_v1');
  } else if (layer.type && isVectorFromFile(layer.type)) {
    const featureType: FeatureType = await getFeatureType(layer);

    let attributes = featureType.attributes.attribute;
    if (!Array.isArray(attributes)) {
      attributes = [attributes];
    }

    const properties = convertGeoserverPropertiesToSchemaProperties(attributes);
    const geometryType = getGeometryTypeFromGeoserverAttributes(attributes);
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
