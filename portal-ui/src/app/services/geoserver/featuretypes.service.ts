import { FeatureType } from '@fiz/geoserver-types/feature-types/FeatureType';

import { usersService } from '../crg/users.service';
import { getEnvironment } from '../environment';
import { serverProperties } from '../server-properties.service';
import { currentUser } from '../../stores/CurrentUser.store';
import { CrgLayer } from '../crg/projects.models';
import { http } from '../http.service';

async function buildUrl(targetName: string): Promise<string> {
  await usersService.fetchCurrent();

  const { scratchWorkspaceName } = await getEnvironment();
  const featureTypesUrl = await serverProperties.geoServerUrl;
  const workspace = `${scratchWorkspaceName}_${currentUser.orgId}`;
  const storeName = `database_${currentUser.orgId}_store`;

  return `${featureTypesUrl}/${workspace}/datastores/${storeName}/featuretypes/${targetName}`;
}

export async function getFeatureTypeByLayer(layer: CrgLayer): Promise<FeatureType> {
  const url = await this.buildUrl(layer.internalName);
  const { featureType } = await http.get<{ featureType: FeatureType }>(url);

  return featureType;
}

export async function deleteFeatureType(featureType: FeatureType): Promise<Object> {
  const url = await this.buildUrl(featureType.name);

  return http.delete(url);
}
