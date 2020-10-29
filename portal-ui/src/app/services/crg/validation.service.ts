import { Injectable } from '@angular/core';

import { ValidationError } from '../util/FeaturePropertyValidators';
import { currentProject } from '../../stores/CurrentProject.store';
import { serverProperties } from '../server-properties.service';
import { ValidationWsMsg, wsService } from '../ws.service';
import { CrgLayer } from '../crg/projects.models';
import { ProcessStatus } from '../models';
import { http } from '../http.service';

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

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  /**
   * Провалидировать слоя.
   * @param crgLayers Слоя на валидацию.
   */
  async initValidation(crgLayers: CrgLayer[]): Promise<ValidationWsMsg> {
    const layerNames = crgLayers.map((crgLayer: CrgLayer) => crgLayer.internalName);

    const payload = {
      wsUiId: wsService.getId(),
      layers: layerNames
    };

    const url = `${await serverProperties.apiUrl}/${currentProject.id}/validation`;

    return http.post<ValidationWsMsg>(url, JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * Выборка результатов валидации.
   */
  async getValidationResults(
    layerName: string,
    page: number,
    size: number,
    sortBy: string,
    sortDirection: string
  ): Promise<ValidationResultsResponse> {
    const params = {
      layerName: layerName,
      page: page ? String(page) : '0',
      size: page ? String(size) : '25',
      sort_by: sortBy.length > 0 ? `${sortBy}.${sortDirection}` : ''
    };

    const url = `${await serverProperties.apiUrl}/${currentProject.id}/validation`;

    return http.get<ValidationResultsResponse>(url, {
      headers: { 'Content-Type': 'application/json' },
      params: params
    });
  }

  /**
   * Получить краткую статистику по слоям
   * @param crgLayers Слои
   */
  async getShortInfo(crgLayers: CrgLayer[]): Promise<ValidationBrieflyInfo[]> {
    const layerNames = crgLayers.map((crgLayer: CrgLayer) => crgLayer.internalName);

    const payload = {
      wsUiId: wsService.getId(),
      layers: layerNames
    };

    const url = `${await serverProperties.apiUrl}/${currentProject.id}/validation/short`;

    return http.post<ValidationBrieflyInfo[]>(url, JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
