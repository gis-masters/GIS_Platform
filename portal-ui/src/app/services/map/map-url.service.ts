import { type Coordinate } from 'ol/coordinate';

import { currentProject } from '../../stores/CurrentProject.store';
import { Pages, route } from '../../stores/Route.store';
import { selectedFeaturesStore } from '../../stores/SelectedFeatures.store';
import { extractFeatureId } from '../geoserver/featureType/featureType.util';
import { type WfsFeature } from '../geoserver/wfs/wfs.models';
import { isVectorLayer } from '../gis/layers/layers.typeguards';
import { getLayerByFeatureInCurrentProject } from '../gis/layers/layers.utils';
import { services } from '../services';
import { notFalsyFilter } from '../util/NotFalsyFilter';
import { sleep } from '../util/sleep';
import { buildFeaturesUrlFragment, type FeaturesUrlFragment } from './map.util';

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
    .filter(notFalsyFilter);

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
  if (!features) {
    return null;
  }

  const featuresUrlFragment: FeaturesUrlFragment = {};

  for (const feature of features) {
    const layer = getLayerByFeatureInCurrentProject(feature);
    if (!isVectorLayer(layer)) {
      continue;
    }

    buildFeaturesUrlFragment(featuresUrlFragment, layer.dataset, layer.resourceId, [extractFeatureId(feature.id)]);
  }

  return JSON.stringify(featuresUrlFragment);
}

export async function setSelectedFeaturesToUrl(): Promise<void> {
  await services.ngZone.run(async () => {
    await services.router.navigate([location.pathname], {
      queryParams: {
        features: selectedFeaturesStore.features ? getFeaturesUrlFragment(selectedFeaturesStore.features) : null,
        queryFilter: null,
        queryLayers: null
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  });
}
