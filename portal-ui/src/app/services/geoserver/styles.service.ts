import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServerPropertiesService} from '../server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class StylesService {

  private workspacesUrl = this.serverProp.geoServerUrl + '/rest/workspaces/';

  constructor(private http: HttpClient,
              private serverProp: ServerPropertiesService) {
  }

  /**
   * Get the style SLD definition body.
   *
   * @param complexStyleName style name or complex style name ("workspace_name:style_name")
   */
  getStyleSld(complexStyleName: string): Observable<string> {
    const styleNameArr = complexStyleName.split(':');
    const styleName = styleNameArr.pop();
    const workspaceName = styleNameArr[0];
    const url: string = workspaceName ?
              this.workspacesUrl + workspaceName + '/styles/' + styleName + '.sld' :
              this.serverProp.geoServerUrl + '/rest/styles/' + styleName + '.sld';

    return this.http
               .get(url, {headers: {'Content-Type': 'application/vnd.ogc.sld+xml'}, responseType: 'text'});
  }

}
