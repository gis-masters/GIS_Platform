import {Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConnectionInfo, CrgLayer} from '../geoserver/layers.service';
import {ServerPropertiesService} from '../server-properties.service';
import {WsService} from '../ws.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private wsService: WsService,
              private serverProp: ServerPropertiesService) {
    this.logger.info('ExportService constructor');
  }

  exportGml(crgLayers: CrgLayer[], docSchema: string): Observable<ExportGmlResponse> {
    const resources: ConnectionInfo[] = crgLayers.map((crgLayer: CrgLayer) => crgLayer.connectionInfo);
    const payload: ExportGmlRequest = {
      id: this.wsService.getId(),
      docSchema: docSchema,
      resources: resources
    };

    this.logger.info('ExportService exportGml: ', payload);

    return this.http
               .post<ExportGmlResponse>(this.serverProp.exportGmlUrl,
                  JSON.stringify(payload),
                 {headers: {'Content-Type': 'application/json'}});
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
  id: string;
  docSchema: string;
  resources: ConnectionInfo[];
}
