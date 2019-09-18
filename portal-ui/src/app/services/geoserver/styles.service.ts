import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServerPropertiesService} from '../server-properties.service';
import {LocalStorageService} from '../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class StylesService {

  private workspacesUrl = this.serverProp.geoServerUrl + '/rest/workspaces/';

  constructor(private http: HttpClient,
              private storageService: LocalStorageService,
              private serverProp: ServerPropertiesService) {
  }

  /**
   * Get the style SLD definition body.
   *
   * @param styleName style name
   */
  getStyleSld(styleName: string): Observable<string> {
    const currentProject = this.storageService.getProject().crgProject;
    const workspaceName = currentProject.workspaceName;

    const url = this.workspacesUrl + workspaceName + '/styles/' + styleName + '.sld';

    return this.http
               .get(url, {headers: {'Content-Type': 'application/vnd.ogc.sld+xml'}, responseType: 'text'});
  }

}
