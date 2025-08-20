import { action } from 'mobx';

import { Toast } from '../../components/Toast/Toast';
import { currentProject } from '../../stores/CurrentProject.store';
import { route } from '../../stores/Route.store';
import { sidebars } from '../../stores/Sidebars.store';
import { applyView } from '../data/schema/schema.utils';
import {
  extractFeatureId,
  extractFeatureTypeNameFromComplexName,
  extractTableNameFromComplexName
} from '../geoserver/featureType/featureType.util';
import { WfsFeature } from '../geoserver/wfs/wfs.models';
import { getFeatureCollection, getFeaturesById } from '../geoserver/wfs/wfs.service';
import { CrgLayer } from '../gis/layers/layers.models';
import { getLayerSchema } from '../gis/layers/layers.service';
import { projectsService } from '../gis/projects/projects.service';
import { services } from '../services';
import { Mime } from '../util/Mime';
import { notFalsyFilter } from '../util/NotFalsyFilter';
import { EditFeatureMode } from './a-map-mode/edit-feature/EditFeature.models';
import { mapModeManager } from './a-map-mode/MapModeManager';
import { selectedFeaturesStore } from './a-map-mode/selected-features/SelectedFeatures.store';
import { MapMode } from './map.models';
import { mapService } from './map.service';

export interface FeatureError {
  id: string;
  layerTitle: string;
  message: string;
}

export async function applyMapStateFromNavigator(): Promise<void> {
  // ссылка на включенные слои "?layers="
  if (route.queryParams.layers) {
    restoreRecentOpenLayers();
  }

  // ссылка на открытые ранее на объект(ы) "?features="
  if (route.queryParams.features) {
    await restoreRecentOpenedFeatures();

    return;
  }

  // ссылка на выборку объектов по CQL-фильтру
  if (route.queryParams.queryFilter) {
    const queryLayers = route.queryParams.queryLayers.split(',');
    let layersComplexNames: string[] = [];

    if (queryLayers.length) {
      layersComplexNames = queryLayers
        .map(layer => {
          if (layer.includes(':') && layer.includes('__')) {
            return layer;
          }

          const currentLayerTableName = extractTableNameFromComplexName(layer);
          const currentLayer = currentProject.layers.find(({ tableName }) => tableName === currentLayerTableName);

          return currentLayer?.complexName;
        })
        .filter(notFalsyFilter);
    }

    const layers = layersComplexNames.length
      ? layersComplexNames
      : currentProject.vectorLayers.map(({ complexName }) => complexName);
    const features: WfsFeature[] = [];

    if (!layers.length) {
      Toast.warn({ message: 'Не найдено' });

      return;
    }

    for (const layer of layers) {
      try {
        if (!layer) {
          return;
        }

        const params: Record<string, string> = {
          service: 'wfs',
          request: 'GetFeature',
          outputFormat: Mime.JSON,
          exceptions: Mime.JSON,
          typeName: layer,
          CQL_FILTER: route.queryParams.queryFilter,
          startindex: '0',
          count: String(selectedFeaturesStore.limit)
        };

        const response = await getFeatureCollection(params);

        if (response.features) {
          features.push(...response.features);
        }
      } catch {
        services.logger.warn('Не найдены связанные объекты в слоях ' + layers.join(','));
      }
    }

    if (features.length) {
      await selectFeatures(features);
    } else {
      const details = `Запрос: ${route.queryParams.queryFilter}\n\nСлои:\n${layers.join('\n')}`;
      Toast.warn({ message: 'Не найдено', details });
    }
  }
}

function restoreRecentOpenLayers() {
  const queryParams = route.queryParams as { [key: string]: string };
  const enabledLayers = queryParams.layers?.split(',');

  action(updateEnabledLayer)(enabledLayers, currentProject.layers, currentProject.rawLayersFromApi);
}

function updateEnabledLayer(enabledLayers: string[], allowedLayers: CrgLayer[], allLayers: CrgLayer[]) {
  if (enabledLayers) {
    currentProject.layers.forEach(allowedLayer => {
      enabledLayers.forEach(enabledLayerId => {
        if (Number(enabledLayerId) === allowedLayer.id) {
          allowedLayer.enabled = true;

          if (allowedLayer.parentId) {
            projectsService.enableGroupAndAncestors(allowedLayer.parentId);
          }
        }
      });
    });

    currentProject.visibleOnMapLayers.forEach(
      action(treeItem => {
        treeItem.payload.enabled = enabledLayers.includes(String(treeItem.id));
      })
    );

    showNotAllowedLayersError(allLayers);
  }
}

function showNotAllowedLayersError(allLayers: CrgLayer[]) {
  let enabledLayers: number[] = [];

  try {
    const queryParams = route.queryParams as { [key: string]: string };
    enabledLayers = queryParams.layers ? queryParams.layers.split(',').map(Number) : [];
  } catch {
    services.logger.error('Ошибка получения состояния слоев');
  }

  const allNotAllowedLayers = getNotAllowedLayers(enabledLayers, allLayers);
  let detailsNotAllowedLayers: string = '';
  let detailsNotExistLayers: string = '';

  const { notAllowedLayers, notExistLayers } = allNotAllowedLayers;

  if (notAllowedLayers.length) {
    detailsNotAllowedLayers = `Отсутствуют права на слои: ${notAllowedLayers.join(', ')}. `;
  }

  if (notExistLayers.length) {
    detailsNotExistLayers = `Отсутствуют слои в проекте: ${notExistLayers.join(', ')}`;
  }

  if (detailsNotAllowedLayers || detailsNotExistLayers) {
    Toast.warn({
      message: 'В проекте есть недоступные слои',
      details: detailsNotAllowedLayers || detailsNotExistLayers
    });
  }
}

function getNotAllowedLayers(layers: number[], allLayers: CrgLayer[]): Record<string, number[] | string[]> {
  const notAllowedLayers: string[] = [];
  const notExistLayers: number[] = [];

  layers.forEach(id => {
    if (
      !currentProject.tree.some(visibleTreeLayer => visibleTreeLayer.id === id) &&
      allLayers.some(layer => layer.id === id)
    ) {
      const layer = allLayers.find(layer => layer.id === id);
      if (layer) {
        notAllowedLayers.push(layer.title);
      }
    }

    if (
      !currentProject.visibleOnMapLayers.some(visibleTreeLayer => visibleTreeLayer.id === id) &&
      !allLayers.some(layer => layer.id === id)
    ) {
      notExistLayers.push(id);
    }
  });

  return { notAllowedLayers, notExistLayers };
}

async function restoreRecentOpenedFeatures() {
  const featuresWithNoAccess: FeatureError[] = [];
  const deletedLayers: FeatureError[] = [];
  const deletedFeatures: FeatureError[] = [];
  const features: WfsFeature[] = [];

  let featuresIdsInDatasetsAndTables: { [dataset: string]: { [table: string]: number[] } } = {};

  try {
    featuresIdsInDatasetsAndTables = JSON.parse(route.queryParams.features) as {
      [dataset: string]: { [table: string]: number[] };
    };
  } catch {
    return;
  }

  for (const [dataset, featuresIdsInTables] of Object.entries(featuresIdsInDatasetsAndTables)) {
    for (const [tableName, featuresCutIds] of Object.entries(featuresIdsInTables)) {
      const currentLayer = currentProject.vectorLayers.find(
        layer => layer.tableName === tableName && layer.dataset === dataset
      );

      if (currentLayer?.complexName) {
        const schema = await getLayerSchema(currentLayer);
        const featuresIds = featuresCutIds.map(
          id => `${extractFeatureTypeNameFromComplexName(currentLayer.complexName)}.${id}`
        );
        let layerFeatures: WfsFeature[] = [];
        if (schema) {
          const schemaWithAppliedView = applyView(schema, currentLayer.view);
          layerFeatures = await getFeaturesById(
            featuresIds,
            currentLayer.complexName,
            schemaWithAppliedView.definitionQuery
          );
        }

        deletedFeatures.push(
          ...featuresIds
            .filter(featureId => !layerFeatures.some(({ id }) => featureId === id))
            .map(featureId => ({
              id: String(extractFeatureId(featureId)),
              layerTitle: currentLayer.title,
              message: 'Объект отсутствует'
            }))
        );

        features.push(...layerFeatures);
      } else {
        featuresWithNoAccess.push(
          ...featuresCutIds.map(cutId => ({
            id: String(cutId),
            layerTitle: 'Слой недоступен',
            message: 'Слой недоступен'
          }))
        );
      }
    }
  }

  sidebars.setDeletedFeatures(deletedFeatures);
  sidebars.setNoAccessFeatures(featuresWithNoAccess);
  sidebars.setDeletedLayers(deletedLayers);

  // TODO: надо бы найти кейсы, восстановить логику, добавить e2e тестов.
  // const hasErrors = Boolean(deletedFeatures.length + featuresWithNoAccess.length + deletedLayers.length);

  await selectFeatures(features);
}

async function selectFeatures(features: WfsFeature[]) {
  if (!features || features.length === 0) {
    await mapModeManager.changeMode(MapMode.NONE, undefined, 'RROF selectFeatures === 0');
  }

  await mapModeManager.changeMode(MapMode.SELECTED_FEATURES, { payload: { features } }, 'RROF selectFeatures 1.1');

  if (features.length === 1) {
    await mapModeManager.changeMode(
      MapMode.EDIT_FEATURE,
      {
        payload: {
          features,
          mode: EditFeatureMode.single
        }
      },
      'RROF selectFeatures === 1.2'
    );
  }

  setTimeout(async () => {
    await mapService.positionToFeatures(features);
  }, 200);
}
