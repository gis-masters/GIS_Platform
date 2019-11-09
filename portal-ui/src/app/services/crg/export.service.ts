import { Injectable } from '@angular/core';

import { HttpQueue } from '../util/HttpQueue';
import { Process } from './models';
import { ServerPropertiesService } from '../server-properties.service';
import { WsService } from '../ws.service';
import { LocalStorageService } from '../local-storage.service';
import { getRoute } from '../services';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor(private httpq: HttpQueue,
              private wsService: WsService,
              private serverProp: ServerPropertiesService,
              private storageService: LocalStorageService ) { }

  async export(requestModel: ExportGmlRequest): Promise<Process> {
    const projectId = getRoute().snapshot.params.projectId;
    const orgId = this.storageService.getOrgId();
    const url = (await this.serverProp.organizationsUrl) + '/' + orgId + '/projects/' + projectId + '/export';

    const payload: ExportGmlRequest = requestModel;
    payload.wsUiId = this.wsService.getId();

    return this.httpq.post<Process>(
        url,
        JSON.stringify(payload),
        { headers: { 'Content-Type': 'application/json' } }
    );
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
