import { Injectable } from '@angular/core';

import { getProcessUrl } from '../server-urls.service';
import { http } from '../http.service';
import { Process } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  async getProcessById(processId: number): Promise<Process> {
    const url = await getProcessUrl(processId);

    return http.get<Process>(url, {
      cache: { disabled: true }
    });
  }
}
