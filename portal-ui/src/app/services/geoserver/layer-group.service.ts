import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServerPropertiesService} from '../server-properties.service';
import {NameHrefProjection} from "./projections";
import {LocalStorageService} from "../local-storage.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LayerGroupService {

  constructor(private http: HttpClient,
              private storageService: LocalStorageService,
              private serverProp: ServerPropertiesService) {
  }

  fetchLayerGroups(): Observable<NameHrefProjection[]> {
    const currentProject = this.storageService.getProject().crgProject;
    const workspaceName = currentProject.workspaceName;

    let url = this.serverProp.geoServerUrl + '/rest/workspaces/' + workspaceName + '/layergroups';

    return this.http
               .get<LayerGroups>(url)
               .pipe(
                 map((groups: LayerGroups) => groups.layerGroups.layerGroup)
               );
  }

}

interface LayerGroups {
  layerGroups: {
    layerGroup: NameHrefProjection[]
  }
}
