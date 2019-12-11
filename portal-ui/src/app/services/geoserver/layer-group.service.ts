import { Injectable } from '@angular/core';

import { ServerPropertiesService } from '../server-properties.service';
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
  constructor(private httpq: HttpQueue,
              private serverProp: ServerPropertiesService) { }

  async fetchLayerGroups(project: Project): Promise<NameHrefProjection[]> {
    const { geoserverName } = project;
    const geoServerUrl = await this.serverProp.geoServerUrl;
    const url = `${geoServerUrl}/rest/workspaces/${geoserverName}/layergroups`;
    const groups = await this.httpq.get<LayerGroups>(url);

    return groups.layerGroups.layerGroup;
  }
}
