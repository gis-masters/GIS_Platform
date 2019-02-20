import {forkJoin, Observable} from "rxjs";
import {NGXLogger} from "ngx-logger";
import {Injectable} from '@angular/core';
import {MatPaginator, MatSort} from "@angular/material";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ServerPropertiesService} from "../server-properties.service";
import {NameHrefProjection} from "../geoserver/projections";
import {ConnectionInfo, CrgLayer} from "../geoserver/layers.service";
import {WfsFeatureCollection} from "../geoserver/wfs.service";
import {ImportTaskShort} from "../geoserver/import.service";

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

  validateLayer(data: ConnectionInfo): Observable<ValidationResponse> {
    return this.validateLayers([data]);
  }

  validateLayers(data: ConnectionInfo[]): Observable<ValidationResponse> {
    return this.http
               .post<ValidationResponse>(this.serverProp.initValidationUrl,
                     JSON.stringify(data),
                     {headers: {'Content-Type': 'application/json'}});
  }

  getValidationResults(data: ConnectionInfo, paginator: MatPaginator, sorter: MatSort): Observable<ValidationResponse[]> {
    return this.getValidationResults_(data,
                                     paginator.pageIndex, paginator.pageSize,
                                     sorter.active, sorter.direction);
  }

  getValidationResults_(data: ConnectionInfo, page: number, size: number, sortBy: string,
                        sortDirection: string): Observable<ValidationResponse[]> {
    let params = new HttpParams()
      .set('page', page? String(page): '0')
      .set('size', page? String(size): '25')
      .set('sort_by', sortBy.length > 0 ? (sortBy + '.' + sortDirection): '');

    return this.http
               .post<ValidationResponse[]>(this.serverProp.validationUrl,
                     JSON.stringify(data),
                     {headers: {'Content-Type': 'application/json'}, params: params});
  }

  getLayersStatistic(crgLayers: CrgLayer[]) {
    const observableTasks = [];
    crgLayers.forEach((crgLayer: CrgLayer) => {
      observableTasks.push(this.getLayerStatistic(crgLayer));
    });

    return forkJoin(observableTasks);
  }

  getLayerStatistic(crgLayer: CrgLayer) {
    return this.http
               .post(this.serverProp.validationInfo,
                 JSON.stringify(crgLayer.connectionInfo),
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

export class ValidationDataHolder {

  private commonInfo: Map<string, ValidationResponse> = new Map<string, ValidationResponse>();

  getCommonInfoByLayerName(name: string): ValidationResponse {
    return this.commonInfo.get(name);
  }

  addLayers(response: ValidationResponse[]) {
    response.forEach((item: ValidationResponse) => {
      if (item && item.resourceId) {
        console.log(' +-+-+- ', item.resourceId, item.resourceId.split(':')[2]);

        this.commonInfo.set(item.resourceId.split(':')[2], item);
      }
    });
  }

  getInfoByLayerName(name: string) {
    return this.commonInfo.get(name);
  }
}
