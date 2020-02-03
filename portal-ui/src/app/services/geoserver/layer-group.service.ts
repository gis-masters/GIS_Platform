import { Injectable } from '@angular/core';

import { serverProperties } from '../server-properties.service';
import { NameHrefProjection } from './projections';
import { HttpQueue } from '../../services/util/HttpQueue';
import { Project } from '../../stores/ProjectsList.store';

interface LayerGroups {
  layerGroups: {
    layerGroup: NameHrefProjection[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class LayerGroupService {
  constructor(private httpq: HttpQueue) { }

  async fetchLayerGroups(project: Project): Promise<NameHrefProjection[]> {
    const { internalName } = project;
    const geoServerUrl = await serverProperties.geoServerUrl;
    const url = `${geoServerUrl}/rest/workspaces/${internalName}/layergroups`;
    const groups = await this.httpq.get<LayerGroups>(url);

    return groups.layerGroups.layerGroup;
  }
}
