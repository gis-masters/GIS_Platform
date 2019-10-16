import {Observable,defer} from 'rxjs';
import {Injectable} from '@angular/core';

import {HttpQueue} from '../util/HttpQueue';
import {ServerPropertiesService} from '../server-properties.service';
import {NameHrefProjection} from "./projections";
import {LocalStorageService} from "../local-storage.service";

interface LayerGroups {
  layerGroups: {
    layerGroup: NameHrefProjection[]
  }
}

@Injectable({
  providedIn: 'root'
})
export class LayerGroupService {

  constructor(private httpq: HttpQueue,
              private storageService: LocalStorageService,
              private serverProp: ServerPropertiesService) { }

  fetchLayerGroups(): Observable<NameHrefProjection[]> {
    const currentProject = this.storageService.getProject().crgProject;
    const workspaceName = currentProject.workspaceName;

    return defer(async () => {
      const geoServerUrl = await this.serverProp.geoServerUrl;
      const url = `${geoServerUrl}/rest/workspaces/${workspaceName}/layergroups`;
      const groups = await this.httpq.get<LayerGroups>(url);

      return groups.layerGroups.layerGroup;
    });
  }

}
