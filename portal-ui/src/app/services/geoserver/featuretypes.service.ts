import { Injectable } from '@angular/core';

import { CrgLayer } from './layers.service';
import { LocalStorageService } from '../local-storage.service';
import { ServerPropertiesService } from '../server-properties.service';
import { HttpQueue } from '../util/HttpQueue';
import { FeatureType } from '@fiz/geoserver-types/feature-types/FeatureType';
import { ProjectsService } from '../crg/projects.service';

@Injectable({
  providedIn: 'root'
})
export class FeatureTypesService {

  private featureTypesUrl: string;

  constructor(private httpq: HttpQueue,
              private projectsService: ProjectsService,
              private storageService: LocalStorageService,
              private serverProp: ServerPropertiesService) {
    // TODO fixme
    this.serverProp.geoServerUrl.then((geoServerUrl) => {
      this.featureTypesUrl = geoServerUrl + '/rest/workspaces';
    });
  }

  async getByName(layer: CrgLayer): Promise<FeatureType> {
    const currentProject = await this.projectsService.getCurrent();
    const orgId = this.storageService.getOrgId();
    const workspaceName = currentProject.workspaceName;
    const storeName = 'database_' + orgId + '_store';
    const url = `${this.featureTypesUrl}/${workspaceName}/datastores/${storeName}/featuretypes/${layer.name}`;
    const { featureType } = await this.httpq.get<{featureType: FeatureType}>(url);

    return featureType;
  }

  async delete(featureType: FeatureType): Promise<Object> {
    const currentProject = await this.projectsService.getCurrent();
    const orgId = this.storageService.getOrgId();
    const workspaceName = currentProject.workspaceName;
    const storeName = 'database_' + orgId + '_store';
    const url = this.featureTypesUrl + '/' + workspaceName + '/datastores/' + storeName + '/featuretypes/' + featureType.name;

    return await this.httpq.delete(url);
  }
}
