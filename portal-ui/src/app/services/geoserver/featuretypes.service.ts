import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {CrgLayer} from './layers.service';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from '../local-storage.service';
import {ServerPropertiesService} from '../server-properties.service';
import {FeatureType} from '@fiz/geoserver-types/feature-types/FeatureType';

@Injectable({
  providedIn: 'root'
})
export class FeatureTypesService {

  private featureTypesUrl: string;

  constructor(private http: HttpClient,
              private storageService: LocalStorageService,
              private serverProp: ServerPropertiesService) {
    // TODO fixme
    this.serverProp.geoServerUrl.then((geoServerUrl) => {
      this.featureTypesUrl = geoServerUrl + '/rest/workspaces';
    });
  }

  getByName(layer: CrgLayer): Observable<FeatureType> {
    const currentProject = this.storageService.getProject().crgProject;
    const orgId = this.storageService.getOrgId();
    const workspaceName = currentProject.workspaceName;
    const storeName = 'database_' + orgId + '_store';

    const url = this.featureTypesUrl + '/' + workspaceName + '/datastores/' + storeName + '/featuretypes/' + layer.name;

    return this.http.get<FeatureType>(url)
                    .pipe(
                      map((value: any) => value.featureType)
                    );
  }

  delete(featureType: FeatureType): Observable<any> {
    const currentProject = this.storageService.getProject().crgProject;
    const orgId = this.storageService.getOrgId();
    const workspaceName = currentProject.workspaceName;
    const storeName = 'database_' + orgId + '_store';

    const url = this.featureTypesUrl + '/' + workspaceName + '/datastores/' + storeName + '/featuretypes/' + featureType.name;

    return this.http.delete(url);
  }

}
