import { Injectable } from '@angular/core';

import { getBaseUrl } from '../server-urls.service';
import { http } from '../http.service';
import { Process } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  async getProcessById(processId: number): Promise<Process> {
    const baseUrl = await getBaseUrl();

    return http.get<Process>(`${baseUrl}/processes/${processId}`);
  }
}
