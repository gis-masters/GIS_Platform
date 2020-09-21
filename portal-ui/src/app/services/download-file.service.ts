import { Injectable } from '@angular/core';

import { serverProperties } from './server-properties.service';
import { http } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {
  async download(fileName: string): Promise<any> {
    const exportUrl = await serverProperties.exportUrl;

    return http.get(exportUrl + '/' + fileName, { responseType: 'blob' });
  }
}
