import { getExportValidationResultUrl } from '../server-urls.service';
import { ExportResourceModel } from './export.service';
import { wsService } from '../ws.service';
import { http } from '../http.service';
import { Mime } from '../util/Mime';
import { Process } from '../models';

export interface ExportValidationReportRequest {
  wsUiId?: string;
  resources: ExportResourceModel[];
}

class ExportValidationReportService {
  private static _instance: ExportValidationReportService;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  async exportValidationReport(resources: ExportResourceModel[]): Promise<Process> {
    const payload: ExportValidationReportRequest = {
      wsUiId: wsService.getId(),
      resources: resources
    };

    return this.export(payload);
  }

  private async export(payload: ExportValidationReportRequest): Promise<Process> {
    return http.post<Process>(await getExportValidationResultUrl(), JSON.stringify(payload), {
      headers: { 'Content-Type': Mime.JSON }
    });
  }
}

export const exportValidationReportService = ExportValidationReportService.instance;
