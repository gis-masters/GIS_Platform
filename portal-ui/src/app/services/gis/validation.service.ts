import {NGXLogger} from "ngx-logger";
import {Injectable} from '@angular/core';
import {forkJoin, Observable} from "rxjs";
import {MatPaginator, MatSort} from "@angular/material";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ServerPropertiesService} from "../server-properties.service";
import {ConnectionInfo, CrgLayer} from "../geoserver/layers.service";

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private serverProp: ServerPropertiesService) {
    this.logger.info('ValidationService constructor');
  }

  validateLayers(crgLayers: CrgLayer[]): Observable<ValidationResponse[]> {
    const payload = crgLayers.map((crgLayer: CrgLayer) => crgLayer.connectionInfo);

    return this.http
               .post<ValidationResponse[]>(this.serverProp.initValidationUrl,
                     JSON.stringify(payload),
                     {headers: {'Content-Type': 'application/json'}});
  }

  getValidationResults(data: ConnectionInfo, paginator: MatPaginator, sorter: MatSort): Observable<ValidationResponse[]> {
    return this.getValidationResults_(data,
                                     paginator.pageIndex, paginator.pageSize,
                                     sorter.active, sorter.direction);
  }

  getValidationResults_(data: ConnectionInfo, page: number, size: number, sortBy: string,
                        sortDirection: string): Observable<ValidationResponse[]> {
    const payload = [data];

    let params = new HttpParams()
      .set('page', page? String(page): '0')
      .set('size', page? String(size): '25')
      .set('sort_by', sortBy.length > 0 ? (sortBy + '.' + sortDirection): '');

    return this.http
               .post<ValidationResponse[]>(this.serverProp.validationUrl,
                     JSON.stringify(payload),
                     {headers: {'Content-Type': 'application/json'}, params: params});
  }

  getLayerStatistic(crgLayers: CrgLayer[]) {
    const payload = crgLayers.map((crgLayer: CrgLayer) => crgLayer.connectionInfo);

    return this.http
               .post(this.serverProp.validationInfo,
                 JSON.stringify(payload),
                 {headers: {'Content-Type': 'application/json'}});
  }

}

export interface ValidationResponse {
  resourceId: string;
  validated: boolean;
  totalViolations: number;
  lastValidationDateTime: string;
  objects: BugObject[];
  status: string;
}

export interface BugObject {
  classId: string;
  objectId: string;
  violations: ViolationItem[];
  xMin: string;
}

export interface ViolationItem {
  name: string;
  value: string;
  errorTypes: string[];
}
