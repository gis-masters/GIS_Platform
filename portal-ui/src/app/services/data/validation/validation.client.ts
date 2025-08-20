import { boundClass } from 'autobind-decorator';

import { Client } from '../../api/Client';
import { http } from '../../api/http.service';
import { Mime } from '../../util/Mime';
import { ValidationWsMsg } from '../../ws.service';
import { ExportResourceModel } from '../export/export.models';
import { Process } from '../processes/processes.models';
import { ValidationPayload, ValidationResultsResponse, ValidationShortInfo } from './validation.models';

const headers = { 'Content-Type': Mime.JSON };

@boundClass
class ValidationClient extends Client {
  private static _instance: ValidationClient;
  static get instance(): ValidationClient {
    return this._instance || (this._instance = new this());
  }

  private getValidationUrl(): string {
    return this.getDataUrl() + '/validation';
  }

  private getValidationResultsUrl(): string {
    return this.getValidationUrl() + '/results';
  }

  private getValidationShortInfoUrl(): string {
    return this.getValidationUrl() + '/short';
  }

  private getExportValidationResultUrl(): string {
    return this.getDataUrl() + '/export/validation_results';
  }

  async initValidation(payload: ValidationPayload): Promise<ValidationWsMsg> {
    return http.post<ValidationWsMsg>(this.getValidationUrl(), JSON.stringify(payload), { headers });
  }

  async getValidationResults(
    resource: ExportResourceModel,
    page: number,
    size: number,
    sortBy: string,
    sortDirection: string
  ): Promise<ValidationResultsResponse> {
    const params = {
      page: page ? String(page) : '0',
      size: page ? String(size) : '25',
      sort_by: sortBy.length > 0 ? `${sortBy}.${sortDirection}` : ''
    };
    const url = `${this.getValidationResultsUrl()}`;

    return http.post<ValidationResultsResponse>(url, JSON.stringify(resource), { headers, params });
  }

  async getValidationShortInfo(payload: ValidationPayload): Promise<ValidationShortInfo[]> {
    const url = `${this.getValidationShortInfoUrl()}`;

    return http.post<ValidationShortInfo[]>(url, JSON.stringify(payload), { headers });
  }

  async getExportValidationReport(payload: ValidationPayload): Promise<Process> {
    return http.post<Process>(this.getExportValidationResultUrl(), JSON.stringify(payload), { headers });
  }
}

export const validationClient = ValidationClient.instance;
