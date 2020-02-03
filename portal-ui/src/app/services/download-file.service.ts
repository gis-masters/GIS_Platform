import { Injectable } from '@angular/core';

import { HttpQueue } from './util/HttpQueue';
import { serverProperties } from './server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {

  constructor(private httpq: HttpQueue) { }

  async download(fileName: string): Promise<any> {
    const exportUrl = await serverProperties.exportUrl;

    return this.httpq.get(exportUrl + '/' + fileName, { responseType: 'blob' });
  }
}
