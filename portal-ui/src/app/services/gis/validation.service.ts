import {Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {MatPaginator, MatSort} from '@angular/material';
import {ValidationWsMsg, WsService} from '../ws.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ServerPropertiesService} from '../server-properties.service';
import {ConnectionInfo, CrgLayer} from '../geoserver/layers.service';
import {ProcessStatus} from '../process-status';
import {LocalStorageService} from '../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private wsService: WsService,
              private storageService: LocalStorageService,
              private serverProp: ServerPropertiesService) {
    this.logger.info('ValidationService constructor');
  }

  /**
   * Провалидировать слоя.
   * @param crgLayers Слоя на валидацию.
   */
  initValidation(crgLayers: CrgLayer[]): Observable<ValidationWsMsg> {
    const layerNames = crgLayers.map((crgLayer: CrgLayer) => crgLayer.name);

    const payload = {
      wsUiId: this.wsService.getId(),
      layers: layerNames
    };

    const projectId = this.storageService.getProject().crgProject.id;
    const orgId = this.storageService.getOrgId();
    const url = this.serverProp.organizationsUrl + '/' + orgId + '/projects/' + projectId + '/validation';

    return this.http
               .post<ValidationWsMsg>(url, JSON.stringify(payload),
                     {headers: {'Content-Type': 'application/json'}});
  }

  /**
   * Выборка результатов валидации.
   */
  getValidationResults(layerName: string, page: number, size: number, sortBy: string,
                       sortDirection: string): Observable<ValidationResultsResponse> {
    const params = new HttpParams()
      .set('layerName', layerName)
      .set('page', page ? String(page) : '0')
      .set('size', page ? String(size) : '25')
      .set('sort_by', sortBy.length > 0 ? (sortBy + '.' + sortDirection) : '');

    const projectId = this.storageService.getProject().crgProject.id;
    const orgId = this.storageService.getOrgId();
    const url = this.serverProp.organizationsUrl + '/' + orgId + '/projects/' + projectId + '/validation';

    return this.http
               .get<ValidationResultsResponse>(url,
                 {headers: {'Content-Type': 'application/json'}, params: params});
  }

  /**
   * Получить краткую статистику по слоям
   * @param crgLayers Слои
   */
  getShortInfo(crgLayers: CrgLayer[]): Observable<ValidationBrieflyInfo[]> {
    const layerNames = crgLayers.map((crgLayer: CrgLayer) => crgLayer.name);

    const payload = {
      wsUiId: this.wsService.getId(),
      layers: layerNames
    };

    const projectId = this.storageService.getProject().crgProject.id;
    const orgId = this.storageService.getOrgId();
    const url = this.serverProp.organizationsUrl + '/' + orgId + '/projects/' + projectId + '/validation/short';

    return this.http
               .post<ValidationBrieflyInfo[]>(url, JSON.stringify(payload),
                 {headers: {'Content-Type': 'application/json'}});
  }

}

export interface ValidationBaseResponse {
  id: string;
  description: string;
  progress: number;
  status: ProcessStatus;
  type: string;

  pending: boolean;
  done: boolean;
  empty: boolean;
  error: boolean;
  null: boolean;
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
  classId: string;
  objectId: string;
  xMin: string;
  propertyViolations: ViolationItem[];
  objectViolations: string[];
}

export interface ViolationItem {
  name: string;
  value: string;
  errorTypes: string[];
}
