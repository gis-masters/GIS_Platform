import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {CrgLayer} from './layers.service';
import {HttpClient} from '@angular/common/http';
import {CrgProject} from '../crg/projects.service';
import {LocalStorageService} from '../local-storage.service';
import {ServerPropertiesService} from '../server-properties.service';
import {FeatureType} from '@fiz/geoserver-types/feature-types/FeatureType';

@Injectable({
  providedIn: 'root'
})
export class FeatureTypesService {

  private featureTypesUrl = this.serverProp.geoServerUrl + '/rest/workspaces';

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private storageService: LocalStorageService,
              private serverProp: ServerPropertiesService) {
    logger.info('FeatureTypesService start');
  }

  getByName(layer: CrgLayer, crgProject: CrgProject): Observable<FeatureType> {
    const orgId = this.storageService.getOrgId();
    const workspaceName = crgProject.workspaceName;
    const storeName = 'database_' + orgId + '_store';

    const url = this.featureTypesUrl + '/' + workspaceName + '/datastores/' + storeName + '/featuretypes/' + layer.name;

    return this.http.get<FeatureType>(url)
                    .pipe(
                      map((value: any) => value.featureType)
                    );
  }

}
