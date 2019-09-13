import {Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TokenStorageService} from '../token-storage.service';
import {ServerPropertiesService} from '../server-properties.service';
import {LocalStorageService} from '../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class StylesService {

  private workspacesUrl = this.serverProp.geoServerUrl + '/rest/workspaces/';

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private storageService: LocalStorageService,
              private tokenStorage: TokenStorageService,
              private serverProp: ServerPropertiesService) {
  }

  /**
   * Get the style SLD definition body.
   *
   * @param styleName style name
   */
  getStyleSld(styleName: string): Observable<any> {
    const currentProject = this.storageService.getProject().crgProject;
    const workspaceName = currentProject.workspaceName;

    const url = this.workspacesUrl + workspaceName + '/styles/' + styleName + '.sld';

    return this.http
               .get<any>(url, {headers: {'Content-Type': 'application/vnd.ogc.sld+xml'}, responseType: 'text'});
  }

}
