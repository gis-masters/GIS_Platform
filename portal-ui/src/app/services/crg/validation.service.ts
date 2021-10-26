import { ValidationError } from '../util/FeaturePropertyValidators';
import { getValidationUrl } from '../server-urls.service';
import { ValidationWsMsg, wsService } from '../ws.service';
import { ExportResourceModel } from './export.service';
import { CrgLayer } from './projects.models';
import { ProcessStatus } from '../models';
import { http } from '../http.service';
import { Mime } from '../util/Mime';

export interface ValidationResultsResponse {
  validated: boolean;
  total: number;
  lastValidated: string;
  results: BugObject[];
  status: ProcessStatus;
}

export interface ValidationBrieflyInfo {
  featureName: string;
  validated: boolean;
  totalViolations: number;
  lastValidationDateTime: string;
  status: string;
}

export interface BugObject {
  title?: string;
  classId: string;
  objectId: string;
  xMin: string;
  propertyViolations: ViolationItem[];
  objectViolations: ValidationError[];
}

export interface ViolationItem {
  name: string;
  value: string;
  errorTypes: string[];
}

const headers = { 'Content-Type': Mime.JSON };

class ValidationService {
  private static _instance: ValidationService;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  async initValidation(layers: CrgLayer[]): Promise<ValidationWsMsg> {
    return http.post<ValidationWsMsg>(await getValidationUrl(), this.preparePayload(layers), { headers });
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

    const url = `${await getValidationUrl()}/results`;

    return http.post<ValidationResultsResponse>(url, JSON.stringify(resource), { headers, params });
  }

  async getShortInfo(layers: CrgLayer[]): Promise<ValidationBrieflyInfo[]> {
    const url = `${await getValidationUrl()}/short`;

    return http.post<ValidationBrieflyInfo[]>(url, this.preparePayload(layers), { headers });
  }

  private preparePayload(layers: CrgLayer[]): string {
    return JSON.stringify({
      wsUiId: wsService.getId(),
      resources: layers.map((layer: CrgLayer) => {
        return {
          dataset: layer.dataset,
          table: layer.tableName,
          schemaId: layer.schemaId
        };
      })
    });
  }
}

export const validationService = ValidationService.instance;
