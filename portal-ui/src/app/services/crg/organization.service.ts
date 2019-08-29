import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';
import {BaseService} from '../base.service';
import {ServerPropertiesService} from '../server-properties.service';
import {Observable} from 'rxjs';
import {CrgProcess} from './crg-models';
import {LocalStorageService} from '../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private baseService: BaseService,
              private storageService: LocalStorageService,
              private serverProp: ServerPropertiesService) {
  }

  getProcessById(taskId: number): Observable<CrgProcess> {
    const orgId = this.storageService.getOrgId();

    return this.http
               .get<CrgProcess>(this.serverProp.organizationsUrl + '/' + orgId + '/tasks/' + taskId);
  }
}
