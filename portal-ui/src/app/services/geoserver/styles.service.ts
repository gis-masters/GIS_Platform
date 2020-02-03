import { Injectable } from '@angular/core';

import { HttpQueue } from '../util/HttpQueue';
import { serverProperties } from '../server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class StylesService {
  constructor(private httpq: HttpQueue) { }

  /**
   * Get the style SLD definition body.
   *
   * @param complexStyleName style name or complex style name ("workspace_name:style_name")
   */
  async getStyleSld(complexStyleName: string): Promise<string> {
    const styleNameArr = complexStyleName.split(':');
    const styleName = styleNameArr.pop();
    const geoServerUrl = await serverProperties.geoServerUrl;
    const workspacesUrl = geoServerUrl + '/rest/workspaces/';
    const workspaceName = styleNameArr[0];
    const url: string = workspaceName ?
              workspacesUrl + workspaceName + '/styles/' + styleName + '.sld' :
              geoServerUrl + '/rest/styles/' + styleName + '.sld';

    return this.httpq.get<string>(
        url,
        { headers: {'Content-Type': 'application/vnd.ogc.sld+xml'}, responseType: 'text' }
    );
  }

}
