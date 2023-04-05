import { Injectable } from '@angular/core';

import { getExportUrl } from './api/server-urls.service';
import { http } from './api/http.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {
  async download(fileName: string): Promise<Blob> {
    const exportUrl = await getExportUrl();

    return http.get(exportUrl + '/' + fileName, { responseType: 'blob' });
  }
}
