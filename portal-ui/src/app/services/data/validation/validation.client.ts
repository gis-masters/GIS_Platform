import { http } from '../../http.service';
import {
  getExportValidationResultUrl,
  getValidationResultsUrl,
  getValidationShortInfoUrl,
  getValidationUrl
} from '../../server-urls.service';
import { Mime } from '../../util/Mime';
import { ValidationWsMsg } from '../../ws.service';
import { ExportResourceModel } from '../export/export.models';
import { Process } from '../processes/processes.models';

import { ValidationShortInfo, ValidationResultsResponse, ValidationPayload } from './validation.models';

const headers = { 'Content-Type': Mime.JSON };

export async function _reqInitValidation(payload: ValidationPayload): Promise<ValidationWsMsg> {
  return http.post<ValidationWsMsg>(await getValidationUrl(), JSON.stringify(payload), { headers });
}

export async function _reqGetValidationResults(
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
  const url = `${await getValidationResultsUrl()}`;

  return http.post<ValidationResultsResponse>(url, JSON.stringify(resource), { headers, params });
}

export async function _reqGetValidationShortInfo(payload: ValidationPayload): Promise<ValidationShortInfo[]> {
  const url = `${await getValidationShortInfoUrl()}`;

  return http.post<ValidationShortInfo[]>(url, JSON.stringify(payload), { headers });
}

export async function _reqGetExportValidationReport(payload: ValidationPayload): Promise<Process> {
  return http.post<Process>(await getExportValidationResultUrl(), JSON.stringify(payload), { headers });
}
