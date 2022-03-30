import { AxiosError } from 'axios';

import { route } from '../../stores/Route.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { EditFeatureMode, sidebars } from '../../stores/Sidebars.store';
import { WfsFeature, WfsFeatureCollection } from '../geoserver/wfs.models';
import { getFeatureLayer } from '../geoserver/layers.service';
import { getFeaturesById } from '../geoserver/wfs.service';
import { getWfsUrl } from '../server-urls.service';
import { GeoserverException } from '../models';
import { mapService } from './map.service';
import { http } from '../http.service';
import { Mime } from '../util/Mime';
import { Toast } from '../../components/Toast/Toast';

export interface FeatureError {
  id: string;
  layerTitle: string;
  message: string;
}

export const MAP_QUERY_PARAMS_DELIMITER = '~';

export async function applyMapStateFromNavigator(): Promise<void> {
  // ссылка открытые ранее на объект(ы) "?features="
  if (route.queryParams.features) {
    await restoreRecentOpenedFeatures();

    return;
  }

  // ссылка на выборку объектов по CQL-фильтру
  if (route.queryParams.queryFilter) {
    const layerNames =
      route.queryParams.queryLayers || currentProject.vectorLayers.map(({ complexName }) => complexName).join(',');

    const params: Record<string, string> = {
      service: 'wfs',
      request: 'GetFeature',
      outputFormat: Mime.JSON,
      exceptions: Mime.JSON,
      typeName: layerNames,
      CQL_FILTER: route.queryParams.queryFilter,
      startindex: '0',
      count: '100'
    };

    const details = `Запрос: ${route.queryParams.queryFilter}\n\nСлои:\n${layerNames.split(',').join('\n')}`;

    try {
      const { features } = await http.get<WfsFeatureCollection>(await getWfsUrl(), { params });

      if (features.length) {
        showFeatures(features);
      } else {
        Toast.warn({ message: 'Не найдено', details });
      }
    } catch (error) {
      const exceptions = ((error as AxiosError)?.response?.data as { exceptions: GeoserverException[] })?.exceptions;

      Toast.error({
        message: 'Не найдено',
        details: `${details}\n\nОшибка: ${
          exceptions?.map(({ text }) => text)?.join('\n') ||
          String((error as AxiosError)?.response?.data) ||
          (error as AxiosError)?.message ||
          String(error)
        }`
      });
    }
  }
}

async function restoreRecentOpenedFeatures() {
  const featuresInLayers: Record<string, string[]> = {};
  const featuresWithNoAccess: FeatureError[] = [];
  const deletedLayers: FeatureError[] = [];
  const deletedFeatures: FeatureError[] = [];
  const features: WfsFeature[] = [];

  route.queryParams.features.split(',').forEach(feature => {
    const [featureId, workspace] = feature.split(MAP_QUERY_PARAMS_DELIMITER);

    if (!featuresInLayers[workspace]) {
      featuresInLayers[workspace] = [featureId];
    } else {
      featuresInLayers[workspace].push(featureId);
    }
  });

  for (const key in featuresInLayers) {
    const featureLayer = currentProject.vectorLayers.find(layer => layer.tableName === key.split(':')[1]);

    if (featureLayer) {
      const layerFeatures = await getFeaturesById(featuresInLayers[key], key);

      deletedFeatures.push(
        ...(featuresInLayers[key] || [])
          .filter(feature => !layerFeatures.map(item => item.id).includes(feature))
          .map(featureString => ({
            id: featureString.split('.')[1],
            layerTitle: currentProject.vectorLayers.find(layer => layer.complexName === key)?.title,
            message: 'Объект удален'
          }))
      );

      features.push(...layerFeatures);
    } else {
      const layerInProject = currentProject.layers.find(layer => layer.tableName === key.split(':')[1]);

      if (layerInProject) {
        featuresInLayers[key].forEach(feature => {
          featuresWithNoAccess.push({
            id: feature.split('.')[1],
            layerTitle: layerInProject.title,
            message: 'Слой недоступен'
          });
        });
      } else {
        featuresInLayers[key].forEach(feature => {
          deletedLayers.push({
            id: feature.split('.')[1],
            layerTitle: key.split(':')[1],
            message: 'Слой удален'
          });
        });
      }
    }
  }

  sidebars.setDeletedFeatures(deletedFeatures);
  sidebars.setNoAccessFeatures(featuresWithNoAccess);
  sidebars.setDeletedLayers(deletedLayers);

  const hasErrors = Boolean(deletedFeatures.length + featuresWithNoAccess.length + deletedLayers.length);

  showFeatures(features, hasErrors);
}

function showFeatures(features: WfsFeature[], hasErrors?: boolean) {
  mapService.highlightFeatures(features);

  if (features.length === 1 && !hasErrors) {
    sidebars.openEdit({
      features,
      mode: EditFeatureMode.single
    });
    setTimeout(() => {
      mapService.positionToFeature(features[0]);
    }, 200);
  } else if ((features.length === 1 && hasErrors) || features.length > 1) {
    sidebars.openFeatures(features);
  } else if ((!features.length && hasErrors) || features.length > 1) {
    sidebars.openFeaturesWithError();
  }
}

export function getFeatureUrl(feature: WfsFeature, projectId: number = currentProject.id): string {
  const complexName = getFeatureLayer(feature)?.complexName;
  const param = `${feature.id}${MAP_QUERY_PARAMS_DELIMITER}${complexName}`;

  if (!complexName) {
    Toast.warn('Ошибка получения слоя объекта');
    throw new Error('Ошибка получения слоя объекта');
  }

  return `${location.origin}/projects/${projectId}/map/?features=${param}`;
}
