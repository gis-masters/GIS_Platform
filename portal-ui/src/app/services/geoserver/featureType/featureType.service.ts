import { debounce } from 'lodash';

import { Toast } from '../../../components/Toast/Toast';
import { CrgLayer } from '../../gis/layers/layers.models';
import { featureTypeClient } from './featureType.client';
import { FeatureType, FeatureTypeHref } from './featureType.model';

export async function getFeatureType(layer: CrgLayer): Promise<FeatureType> {
  return await featureTypeClient.getFeatureType(layer);
}

export async function getFeatureTypesFromScratchDatastore(
  workspaceName: string,
  datastoreName: string
): Promise<FeatureTypeHref[] | undefined> {
  try {
    const response = await featureTypeClient.getFeatureTypes(workspaceName, datastoreName);

    return response.featureTypes.featureType;
  } catch {
    Toast.error({
      message: 'Не удалось получить featureTypes с геосервера',
      canBeSuppressed: true
    });
  }
}

export async function deleteFeatureTypeFromScratchDatastore(
  workspaceName: string,
  datastoreName: string,
  feature: string
): Promise<void> {
  try {
    await featureTypeClient.deleteRecursively(workspaceName, datastoreName, feature);
  } catch {
    Toast.error({
      message: `Не удалось удалить featureType: ${feature}`,
      canBeSuppressed: true
    });
  }
}

export async function recalculateBboxAndGetFeatureType(
  layer: CrgLayer,
  withoutMessage?: boolean
): Promise<FeatureType | undefined> {
  try {
    await featureTypeClient.recalculateBbox(layer);

    return await featureTypeClient.getFeatureType(layer);
  } catch {
    if (!withoutMessage) {
      const showWarning = debounce(() => {
        Toast.warn({
          message: `Не удалось пересчитать bbox для слоя "${layer.title}"`
        });
      }, 1000);

      showWarning();
    }

    return;
  }
}
