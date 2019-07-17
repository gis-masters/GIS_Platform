import {Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {WsService} from '../ws.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrgLayer} from '../geoserver/layers.service';
import {LocalStorageService} from '../local-storage.service';
import {ServerPropertiesService} from '../server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private wsService: WsService,
              private serverProp: ServerPropertiesService,
              private storageService: LocalStorageService, ) {
    this.logger.info('ExportService constructor');
  }

  export(crgLayers: CrgLayer[], docSchema: string): Observable<ExportGmlResponse> {
    const projectId = this.storageService.getProject().crgProject.id;
    const orgId = this.storageService.getOrgId();
    const url = this.serverProp.organizationsUrl + '/' + orgId + '/projects/' + projectId + '/export';

    const layerNames: string[] = crgLayers.map((crgLayer: CrgLayer) => crgLayer.name);
    const payload: ExportGmlRequest = {
      wsUiId: this.wsService.getId(),
      docSchema: docSchema,
      layers: layerNames
    };

    return this.http
               .post<ExportGmlResponse>(url, JSON.stringify(payload), {headers: {'Content-Type': 'application/json'}});
  }
}

export interface ExportGmlResponse {
  id: string;
  pathToFile: string;
  pathToLog: string;
  status: string;
  description: string;
}

export interface ExportGmlRequest {
  wsUiId: string;
  docSchema?: string;
  format?: string;
  layers: string[];
}
