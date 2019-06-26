import {Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {Injectable} from '@angular/core';
import {MatPaginator, MatSort} from '@angular/material';
import {ValidationWsMsg, WsService} from '../ws.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ServerPropertiesService} from '../server-properties.service';
import {ConnectionInfo, CrgLayer} from '../geoserver/layers.service';
import {ProcessStatus} from '../process-status';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private wsService: WsService,
              private serverProp: ServerPropertiesService) {
    this.logger.info('ValidationService constructor');
  }

  /**
   * Провалидировать слоя.
   * @param crgLayers Слоя на валидацию.
   */
  validateLayers(crgLayers: CrgLayer[]): Observable<ValidationWsMsg> {
    const resources = crgLayers.map((crgLayer: CrgLayer) => crgLayer.connectionInfo);

    const payload = {
      wsUiId: this.wsService.getId(),
      resources: resources
    };

    return this.http
               .post<ValidationWsMsg>(this.serverProp.initValidationUrl,
                     JSON.stringify(payload),
                     {headers: {'Content-Type': 'application/json'}});
  }

  getValidationResults(data: ConnectionInfo,
                       paginator: MatPaginator, sorter: MatSort): Observable<ValidationResultsResponse> {
    return this.getValidationResults_(data,
                                     paginator.pageIndex, paginator.pageSize,
                                     sorter.active, sorter.direction);
  }

  /**
   * * Выборка результатов валидации.
   */
  getValidationResults_(data: ConnectionInfo, page: number, size: number, sortBy: string,
                        sortDirection: string): Observable<ValidationResultsResponse> {
    const payload = {
      wsUiId: this.wsService.getId(),
      resources: [data]
    };

    const params = new HttpParams()
      .set('requestModel.ts', page ? String(page) : '0')
      .set('size', page ? String(size) : '25')
      .set('sort_by', sortBy.length > 0 ? (sortBy + '.' + sortDirection) : '');

    return this.http
               .post<ValidationResultsResponse>(this.serverProp.validationUrl,
                     JSON.stringify(payload),
                     {headers: {'Content-Type': 'application/json'}, params: params});
  }

  /**
   * Получить краткую статистику по слоям
   * @param crgLayers Слои
   */
  getLayerStatistic(crgLayers: CrgLayer[]): Observable<ValidationInfoResponse> {
    const resources = crgLayers.map((crgLayer: CrgLayer) => crgLayer.connectionInfo);

    const payload = {
      wsUiId: this.wsService.getId(),
      resources: resources
    };

    return this.http
               .post<ValidationInfoResponse>(this.serverProp.validationInfo,
                 JSON.stringify(payload),
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

export interface ValidationInfoResponse extends ValidationBaseResponse {
  briefly: ValidationBrieflyInfo[];
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
