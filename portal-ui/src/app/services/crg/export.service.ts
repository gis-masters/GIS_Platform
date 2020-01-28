import { Injectable } from '@angular/core';

import { HttpQueue } from '../util/HttpQueue';
import { Process } from './models';
import { ServerPropertiesService } from '../server-properties.service';
import { WsService } from '../ws.service';
import { ProjectsService } from './projects.service';

export interface ExportGmlRequest {
  layers: string[];
  wsUiId?: string;
  docSchema?: string;
  format?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor(private httpq: HttpQueue,
              private wsService: WsService,
              private projectsService: ProjectsService,
              private serverProp: ServerPropertiesService ) { }

  async export(requestModel: ExportGmlRequest): Promise<Process> {
    const { internalName } = await this.projectsService.getCurrent();
    const url = (await this.serverProp.apiUrl) + '/' + internalName + '/export';

    const payload: ExportGmlRequest = requestModel;
    payload.wsUiId = this.wsService.getId();

    return this.httpq.post<Process>(
        url,
        JSON.stringify(payload),
        { headers: { 'Content-Type': 'application/json' } }
    );
  }
}
