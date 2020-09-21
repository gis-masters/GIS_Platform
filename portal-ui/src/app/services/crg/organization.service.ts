import { Injectable } from '@angular/core';

import { serverProperties } from '../server-properties.service';
import { http } from '../http.service';
import { Process } from './models';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  async getProcessById(processId: number): Promise<Process> {
    const baseUrl = await serverProperties.baseUrl;

    return http.get<Process>(`${baseUrl}/processes/${processId}`);
  }
}
