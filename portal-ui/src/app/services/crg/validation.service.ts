import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { getRoute } from '../services';
import { HttpQueue } from '../util/HttpQueue';
import { ValidationError } from '../util/FeaturePropertyValidators';
import { ValidationWsMsg, WsService } from '../ws.service';
import { ServerPropertiesService } from '../server-properties.service';
import { CrgLayer } from '../geoserver/layers.service';
import { LocalStorageService } from '../local-storage.service';
import { ProcessStatus } from './models';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private httpq: HttpQueue,
              private wsService: WsService,
              private storageService: LocalStorageService,
              private serverProp: ServerPropertiesService) { }

  /**
   * Провалидировать слоя.
   * @param crgLayers Слоя на валидацию.
   */
  async initValidation(crgLayers: CrgLayer[]): Promise<ValidationWsMsg> {
    const layerNames = crgLayers.map((crgLayer: CrgLayer) => crgLayer.name);

    const payload = {
      wsUiId: this.wsService.getId(),
      layers: layerNames
    };

    const projectId = getRoute().snapshot.params.projectId;
    const orgId = this.storageService.getOrgId();
    const url = (await this.serverProp.organizationsUrl) + '/' + orgId + '/projects/' + projectId + '/validation';

    return this.httpq
               .post<ValidationWsMsg>(url, JSON.stringify(payload),
                     {headers: {'Content-Type': 'application/json'}});
  }

  /**
   * Выборка результатов валидации.
   */
  async getValidationResults(layerName: string, page: number, size: number, sortBy: string,
                       sortDirection: string): Promise<ValidationResultsResponse> {
    const params = new HttpParams()
      .set('layerName', layerName)
      .set('page', page ? String(page) : '0')
      .set('size', page ? String(size) : '25')
      .set('sort_by', sortBy.length > 0 ? (sortBy + '.' + sortDirection) : '');

    const projectId = getRoute().snapshot.params.projectId;
    const orgId = this.storageService.getOrgId();
    const url = (await this.serverProp.organizationsUrl) + '/' + orgId + '/projects/' + projectId + '/validation';

    return this.httpq
               .get<ValidationResultsResponse>(url,
                 {headers: {'Content-Type': 'application/json'}, params: params});
  }

  /**
   * Получить краткую статистику по слоям
   * @param crgLayers Слои
   */
  async getShortInfo(crgLayers: CrgLayer[]): Promise<ValidationBrieflyInfo[]> {
    const layerNames = crgLayers.map((crgLayer: CrgLayer) => crgLayer.name);

    const payload = {
      wsUiId: this.wsService.getId(),
      layers: layerNames
    };

    const projectId = getRoute().snapshot.params.projectId;
    const orgId = this.storageService.getOrgId();
    const organizationsUrl = await this.serverProp.organizationsUrl;
    const url = organizationsUrl + '/' + orgId + '/projects/' + projectId + '/validation/short';

    return this.httpq
               .post<ValidationBrieflyInfo[]>(url, JSON.stringify(payload),
                 {headers: {'Content-Type': 'application/json'}});
  }

}

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
