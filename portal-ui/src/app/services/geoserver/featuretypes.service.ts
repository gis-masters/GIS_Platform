import { Injectable } from '@angular/core';

import { localStorageService } from '../local-storage.service';
import { serverProperties } from '../server-properties.service';
import { HttpQueue } from '../util/HttpQueue';
import { FeatureType } from '@fiz/geoserver-types/feature-types/FeatureType';
import { projectsService } from '../crg/projects.service';
import { CrgLayer } from '../crg/projects.models';
import { currentProject } from '../../stores/CurrentProject.store';

@Injectable({
  providedIn: 'root'
})
export class FeatureTypesService {

  private featureTypesUrl: string;

  constructor(private httpq: HttpQueue) {
    // TODO fixme
    serverProperties.geoServerUrl.then((geoServerUrl) => {
      this.featureTypesUrl = geoServerUrl + '/rest/workspaces';
    });
  }

  async getByName(layer: CrgLayer): Promise<FeatureType> {
    await projectsService.fetchCurrent();
    const orgId = localStorageService.getOrgId();
    const workspaceName = currentProject.internalName;
    const storeName = 'database_' + orgId + '_store';
    const url = `${this.featureTypesUrl}/${workspaceName}/datastores/${storeName}/featuretypes/${layer.internalName}`;
    const { featureType } = await this.httpq.get<{featureType: FeatureType}>(url);

    return featureType;
  }

  async delete(featureType: FeatureType): Promise<Object> {
    await projectsService.fetchCurrent();
    const orgId = localStorageService.getOrgId();
    const workspaceName = currentProject.internalName;
    const storeName = 'database_' + orgId + '_store';
    const url = `${this.featureTypesUrl}/${workspaceName}/datastores/${storeName}/featuretypes/${featureType.name}`;

    return this.httpq.delete(url);
  }
}
