import { FeatureType } from '@fiz/geoserver-types/feature-types/FeatureType';

import { currentProject } from '../../stores/CurrentProject.store';
import { serverProperties } from '../server-properties.service';
import { currentUser } from '../../stores/CurrentUser.store';
import { projectsService } from '../crg/projects.service';
import { CrgLayer } from '../crg/projects.models';
import { http } from '../http.service';

async function buildUrl(targetName: string): Promise<string> {
  await projectsService.fetchCurrent();
  const featureTypesUrl = await serverProperties.geoServerUrl;
  const workspaceName = currentProject.internalName;
  const storeName = `database_${currentUser.orgId}_store`;

  return `${featureTypesUrl}/${workspaceName}/datastores/${storeName}/featuretypes/${targetName}`;
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
