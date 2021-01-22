import { FeatureType } from '@fiz/geoserver-types/feature-types/FeatureType';

import { currentUser } from '../../stores/CurrentUser.store';
import { getGeoServerUrl } from '../server-urls.service';
import { usersService } from '../crg/users.service';
import { CrgLayer } from '../crg/projects.models';
import { getEnvironment } from '../environment';
import { http } from '../http.service';

async function buildUrl(targetName: string): Promise<string> {
  await usersService.fetchCurrentUser();
  const { scratchWorkspaceName } = await getEnvironment();
  const workspace = `${scratchWorkspaceName}_${currentUser.orgId}`;
  const storeName = `database_${currentUser.orgId}_store`;

  return `${await getGeoServerUrl()}/${workspace}/datastores/${storeName}/featuretypes/${targetName}`;
}

export async function getFeatureTypeByLayer(layer: CrgLayer): Promise<FeatureType> {
  const url = await buildUrl(layer.tableName);
  const { featureType } = await http.get<{ featureType: FeatureType }>(url);

  return featureType;
}

export async function deleteFeatureType(featureType: FeatureType): Promise<Object> {
  const url = await buildUrl(featureType.name);

  return http.delete(url);
}
