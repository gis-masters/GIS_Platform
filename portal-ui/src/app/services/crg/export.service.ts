import { Injectable } from '@angular/core';

import { HttpQueue } from '../util/HttpQueue';
import { Process } from './models';
import { serverProperties } from '../server-properties.service';
import { WsService } from '../ws.service';
import { ProjectsService } from './projects.service';

export interface ExportGmlRequest {
  layers: string[];
  wsUiId?: string;
  docSchema?: string;
  format?: string;
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

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor(private httpq: HttpQueue,
              private wsService: WsService,
              private projectsService: ProjectsService) { }

  async export(requestModel: ExportGmlRequest): Promise<Process> {
    const { id } = await this.projectsService.getCurrent();
    const url = (await serverProperties.apiUrl) + '/' + id + '/export';

    const payload: ExportGmlRequest = requestModel;
    payload.wsUiId = this.wsService.getId();

    return this.httpq.post<Process>(
        url,
        JSON.stringify(payload),
        { headers: { 'Content-Type': 'application/json' } }
    );
  }
}
