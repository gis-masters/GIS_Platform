import {Injectable} from '@angular/core';

import { HttpQueue } from './util/HttpQueue';
import {ServerPropertiesService} from './server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {

  constructor(private httpq: HttpQueue,
              private propertiesService: ServerPropertiesService) {}

  async download(fileName: string): Promise<any> {
    const exportUrl = await this.propertiesService.exportUrl;

    return this.httpq.get(exportUrl + '/' + fileName, {responseType: 'blob'});
  }
}
