import {Injectable} from '@angular/core';

import {ServerPropertiesService} from '../server-properties.service';
import {Process} from './models';
import {LocalStorageService} from '../local-storage.service';
import { HttpQueue } from '../util/HttpQueue';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private httpq: HttpQueue,
              private storageService: LocalStorageService,
              private serverProp: ServerPropertiesService) {
  }

  async getProcessById(taskId: number): Promise<Process> {
    const orgId = this.storageService.getOrgId();
    const organizationsUrl = await this.serverProp.organizationsUrl;

    return this.httpq.get<Process>(organizationsUrl + '/' + orgId + '/tasks/' + taskId);
  }
}
