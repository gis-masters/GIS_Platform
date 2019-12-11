import { Injectable } from '@angular/core';

import { ServerPropertiesService } from '../server-properties.service';
import { Process } from './models';
import { LocalStorageService } from '../local-storage.service';
import { HttpQueue } from '../util/HttpQueue';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private httpq: HttpQueue,
              private storageService: LocalStorageService,
              private serverProp: ServerPropertiesService) { }

  async getProcessById(processId: number): Promise<Process> {
    const orgId = this.storageService.getOrgId();
    const baseUrl = await this.serverProp.baseUrl;

    return this.httpq.get<Process>(`${baseUrl}/processes/${processId}`);
  }
}
