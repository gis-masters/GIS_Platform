import { Coordinate } from 'ol/coordinate';

import { mapStore } from '../../stores/Map.store';
import { Pages, route } from '../../stores/Route.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { getLayerByFeatureInCurrentProject } from '../gis/layers.service';
import { WfsFeature } from '../geoserver/wfs/wfs.models';
import { services } from '../services';
import { sleep } from '../util/sleep';

export async function setMapPositionToUrl(zoom: number, center: Coordinate): Promise<void> {
  await sleep(100);
  if (route.data.page === Pages.MAP) {
    await services.ngZone.run(async () => {
      await services.router.navigate([location.pathname], {
        queryParams: {
          zoom: Number(zoom).toFixed(2),
          center: center.map(Math.round).join(',')
        },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    });
  }
}

export async function setEnabledLayerToUrl(): Promise<void> {
  const currentPath = location.pathname;
  const layers = currentProject.visibleOnMapLayers
    .map(layer => {
      if (layer.payload.enabled === true) {
        return layer.id;
      }
    })
    .filter(Boolean);

  if (layers) {
    await sleep(200);
    if (location.pathname !== currentPath || currentProject.id !== Number(route.params.projectId)) {
      return;
    }

    await services.provided;

    await services.ngZone.run(async () => {
      await services.router.navigate([location.pathname], {
        queryParams: {
          layers: layers.join(',')
        },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    });
  }
}

export function getFeaturesUrlFragment(features: WfsFeature[]): string | null {
  const featuresIds: { [dataset: string]: { [table: string]: number[] } } = {};

  for (const feature of features) {
    const layer = getLayerByFeatureInCurrentProject(feature);
    if (!layer) {
      continue;
    }

    if (!featuresIds[layer.dataset]) {
      featuresIds[layer.dataset] = {};
    }
    if (!featuresIds[layer.dataset][layer.tableName]) {
      featuresIds[layer.dataset][layer.tableName] = [];
    }

    featuresIds[layer.dataset][layer.tableName].push(Number(feature.id.split('.')[1]));
  }

  return features ? JSON.stringify(featuresIds) : null;
}

export async function setSelectedFeaturesToUrl(): Promise<void> {
  await services.ngZone.run(async () => {
    await services.router.navigate([location.pathname], {
      queryParams: {
        features: getFeaturesUrlFragment(mapStore.selectedFeatures),
        queryFilter: null,
        queryLayers: null
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  });
}

export function getFeatureUrl(feature: WfsFeature, projectId: number = currentProject.id): string {
  return `${location.origin}/projects/${projectId}/map/?features=${getFeaturesUrlFragment([feature])}`;
}
