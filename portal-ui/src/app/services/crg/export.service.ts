import { Process } from '../models';
import { http } from '../http.service';
import { wsService } from '../ws.service';
import { getExportUrl } from '../server-urls.service';

export interface ExportRequest {
  resources: ExportResourceModel[];
  format: 'GML' | 'ESRI Shapefile';
  wsUiId?: string;
  docSchema?: string;
}

export interface ExportResourceModel {
  dataset: string;
  table: string;
  schemaId: string;
}

class ExportService {
  private static _instance: ExportService;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  async exportAsShape(resources: ExportResourceModel[]): Promise<Process> {
    const payload: ExportRequest = {
      wsUiId: wsService.getId(),
      format: 'ESRI Shapefile',
      resources: resources
    };

    return this.export(payload);
  }

  async exportAsGML(docSchema: string, resources: ExportResourceModel[]): Promise<Process> {
    const payload: ExportRequest = {
      wsUiId: wsService.getId(),
      format: 'GML',
      resources: resources,
      docSchema: docSchema
    };

    return this.export(payload);
  }

  private async export(payload: ExportRequest): Promise<Process> {
    return http.post<Process>(await getExportUrl(), JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const exportService = ExportService.instance;
