import { http } from '../api/http.service';
import { getGeoserverFeatureTypesUrl, getGeoserverFeatureTypeUrl } from '../api/server-urls.service';

import { Toast } from '../../components/Toast/Toast';
import { currentUser } from '../../stores/CurrentUser.store';

export interface FeatureTypeHref {
  name: string;
  href: string;
}

export async function getFeatureTypesFromScratchDatastore(): Promise<FeatureTypeHref[]> {
  const { workspaceName, datastoreName } = currentUser;
  const url = getGeoserverFeatureTypesUrl(workspaceName, datastoreName);

  try {
    const response = await http.get<{ featureTypes: { featureType: FeatureTypeHref[] } }>(url, {
      cache: { disabled: true }
    });

    return response.featureTypes.featureType;
  } catch {
    Toast.error({
      message: 'Не удалось получить featureTypes с геосервера',
      canBeSuppressed: true
    });
  }
}

export async function deleteFeatureTypeFromScratchDatastore(feature: string): Promise<void> {
  const { workspaceName, datastoreName } = currentUser;
  const url = getGeoserverFeatureTypeUrl(workspaceName, datastoreName, feature);

  try {
    await http.delete(url, { params: { recurse: 'true' } });
  } catch {
    Toast.error({
      message: `Не удалось удалить featureType: ${feature}`,
      canBeSuppressed: true
    });
  }
}
