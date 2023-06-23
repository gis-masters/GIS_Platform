import { action } from 'mobx';

import { route } from '../../stores/Route.store';
import { mapStore } from '../../stores/Map.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { EditFeatureMode, sidebars } from '../../stores/Sidebars.store';
import { mapSelectionService } from './map-selection.service';
import { WfsFeature, WfsFeatureCollection } from '../geoserver/wfs/wfs.models';
import { getFeaturesById } from '../geoserver/wfs/wfs.service';
import { getWfsUrl } from '../api/server-urls.service';
import { mapService } from './map.service';
import { services } from '../services';
import { http } from '../api/http.service';
import { Mime } from '../util/Mime';
import { Toast } from '../../components/Toast/Toast';
import { CrgLayer } from '../gis/layers/layers.models';
import { projectsService } from '../gis/projects/projects.service';
import { applyView } from '../data/schema/schema.utils';
import { schemaService } from '../data/schema/schema.service';

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
    const layers =
      route.queryParams.queryLayers.split(',') || currentProject.vectorLayers.map(({ complexName }) => complexName);

    const details = `Запрос: ${route.queryParams.queryFilter}\n\nСлои:\n${layers.join('\n')}`;
    const features: WfsFeature[] = [];

    for (const layer of layers) {
      try {
        const params: Record<string, string> = {
          service: 'wfs',
          request: 'GetFeature',
          outputFormat: Mime.JSON,
          exceptions: Mime.JSON,
          typeName: layer,
          CQL_FILTER: route.queryParams.queryFilter,
          startindex: '0',
          count: String(mapStore.selectingFeaturesLimit)
        };

        const response = await http.get<WfsFeatureCollection>(getWfsUrl(), { params });

        features.push(...response.features);
      } catch {
        services.logger.warn('Не найдены связанные объекты в слоях ' + layers.join(','));
      }
    }

    if (features.length) {
      selectFeatures(features);
    } else {
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
  let detailsNotAllowedLayers: string;
  let detailsNotExistLayers: string;

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
      notAllowedLayers.push(allLayers.find(layer => layer.id === id).title);
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

      if (currentLayer) {
        const schema = applyView(await schemaService.getSchema(currentLayer.schemaId), currentLayer.view);
        const featuresIds = featuresCutIds.map(cutId => `${currentLayer.tableName}.${cutId}`);
        const layerFeatures = await getFeaturesById(featuresIds, currentLayer.complexName, schema?.definitionQuery);

        deletedFeatures.push(
          ...featuresIds
            .filter(featureId => !layerFeatures.some(({ id }) => featureId === id))
            .map(featureId => ({
              id: featureId.split('.')[1],
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

  const hasErrors = Boolean(deletedFeatures.length + featuresWithNoAccess.length + deletedLayers.length);

  selectFeatures(features, hasErrors);
}

function selectFeatures(features: WfsFeature[], hasErrors?: boolean) {
  mapSelectionService.selectFeatures(features);

  if (!hasErrors && !route.queryParams.center) {
    if (features.length === 1) {
      sidebars.openEdit({
        features,
        mode: EditFeatureMode.single
      });
    }
    setTimeout(() => {
      mapService.positionToFeatures(features);
    }, 200);
  }
}
