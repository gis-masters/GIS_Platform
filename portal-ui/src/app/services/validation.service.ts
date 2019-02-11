import {NGXLogger} from "ngx-logger";
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ServerPropertiesService} from "./server-properties.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private serverProp: ServerPropertiesService) {

  }

  validateLayer(data: ValidationRequest): Observable<any> {
    return this.validateLayers([data]);
  }

  validateLayers(data: ValidationRequest[]): Observable<any> {
    return this.http
               .post(this.serverProp.initValidationUrl,
                     JSON.stringify(data),
                     {headers: {'Content-Type': 'application/json'}});
  }

  getValidationResults(data: ValidationRequest, page, size): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http
               .post(this.serverProp.validationUrl,
                     JSON.stringify(data),
                     {headers: {'Content-Type': 'application/json'}, params: params});
  }

}

export interface ValidationRequest {
  dbName: string;
  schemaName: string;
  tableName: string;
}
