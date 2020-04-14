import { Process } from './models';
import { serverProperties } from '../server-properties.service';
import { wsService } from '../ws.service';
import { projectsService } from './projects.service';
import { services } from '../services';
import { currentProject } from '../../stores/CurrentProject.store';

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

class ExportService {
  private static _instance: ExportService;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() { }

  async export(requestModel: ExportGmlRequest): Promise<Process> {
    await projectsService.fetchCurrent();
    const url = `${await serverProperties.apiUrl}/${currentProject.id}/export`;
    const payload: ExportGmlRequest = requestModel;
    payload.wsUiId = wsService.getId();

    return services.httpq.post<Process>(
        url,
        JSON.stringify(payload),
        { headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export const exportService = ExportService.instance;
