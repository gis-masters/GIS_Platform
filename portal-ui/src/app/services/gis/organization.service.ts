import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';
import {BaseService} from '../base.service';
import {ServerPropertiesService} from '../server-properties.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private baseService: BaseService,
              private serverProp: ServerPropertiesService) {
  }

  getInfo(): Observable<any> {
    return this.http
               .get<any>(this.serverProp.organizationsUrl + '/info');
  }

}
