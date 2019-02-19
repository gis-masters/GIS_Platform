import {Observable} from "rxjs";
import {NGXLogger} from "ngx-logger";
import {Injectable} from '@angular/core';
import {MatPaginator, MatSort} from "@angular/material";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ServerPropertiesService} from "../server-properties.service";
import {NameHrefProjection} from "../geoserver/projections";

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  validationDataHolder = new ValidationDataHolder();

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private serverProp: ServerPropertiesService) {
    this.logger.info('ValidationService constructor');
  }

  validateLayer(data: ValidationRequest): Observable<any> {
    this.logger.info('66666666666666', data);

    return this.validateLayers([data]);
  }

  validateLayers(data: ValidationRequest[]): Observable<any> {
    return this.http
               .post(this.serverProp.initValidationUrl,
                     JSON.stringify(data),
                     {headers: {'Content-Type': 'application/json'}});
  }

  getValidationResults(data: ValidationRequest, paginator: MatPaginator, sorter: MatSort): Observable<any> {
    return this.getValidationResults_(data,
                                     paginator.pageIndex, paginator.pageSize,
                                     sorter.active, sorter.direction);
  }

  getValidationResults_(data: ValidationRequest, page: number, size: number, sortBy: string, sortDirection: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page? String(page): '0')
      .set('size', page? String(size): '25')
      .set('sort_by', sortBy.length > 0 ? (sortBy + '.' + sortDirection): '');

    return this.http
               .post(this.serverProp.validationUrl,
                     JSON.stringify(data),
                     {headers: {'Content-Type': 'application/json'}, params: params});
  }

  getStatisticByLayerName(name: string) {
    return this.validationDataHolder.getCommonInfoByLayerName(name);
  }
}

export interface ValidationRequest {
  dbName: string;
  schemaName: string;
  tableName: string;
}

export interface CommonLayerInfo {
  isValidated?: boolean;
  totalViolations?: number;
  lastValidationDateTime?: string;
}

export class ValidationDataHolder {

  private commonInfo: Map<string, CommonLayerInfo> = new Map<string, CommonLayerInfo>();

  getCommonInfoByLayerName(name: string): CommonLayerInfo {
    return this.commonInfo.get(name);
  }

  addLayers(layers: NameHrefProjection[]) {
    this.commonInfo.set(layers[0].name, {isValidated: true, totalViolations: 0, lastValidationDateTime: '02.14.2019 16:00'});
    this.commonInfo.set(layers[1].name, {isValidated: false, totalViolations: 0, lastValidationDateTime: '02.14.2019 16:00'});
    this.commonInfo.set(layers[2].name, {isValidated: true, totalViolations: 8273, lastValidationDateTime: '02.14.2019 16:00'});
  }

  getInfoByLayerName(name: string) {
    return this.commonInfo.get(name);
  }
}
