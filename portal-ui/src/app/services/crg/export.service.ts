import {Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {WsService} from '../ws.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from '../local-storage.service';
import {ServerPropertiesService} from '../server-properties.service';
import {CrgProcess} from './crg-models';

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

  export(requestModel: ExportGmlRequest): Observable<CrgProcess> {
    const projectId = this.storageService.getProject().crgProject.id;
    const orgId = this.storageService.getOrgId();
    const url = this.serverProp.organizationsUrl + '/' + orgId + '/projects/' + projectId + '/export';

    const payload: ExportGmlRequest = requestModel;
    payload.wsUiId = this.wsService.getId();

    return this.http
               .post<CrgProcess>(url, JSON.stringify(payload), {headers: {'Content-Type': 'application/json'}});
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
  layers: string[];
  wsUiId?: string;
  docSchema?: string;
  format?: string;
}
