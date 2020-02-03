import { Injectable } from '@angular/core';

import { serverProperties } from '../server-properties.service';
import { Process } from './models';
import { HttpQueue } from '../util/HttpQueue';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private httpq: HttpQueue) { }

  async getProcessById(processId: number): Promise<Process> {
    const baseUrl = await serverProperties.baseUrl;

    return this.httpq.get<Process>(`${baseUrl}/processes/${processId}`);
  }
}
