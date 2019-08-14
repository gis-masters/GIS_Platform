import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ServerPropertiesService} from './server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadFileService {

  constructor(private http: HttpClient,
              private propertiesService: ServerPropertiesService) {}

  download(fileName: string): Observable<any> {
    return this.http
               .get(this.propertiesService.exportUrl + '/' + fileName, {responseType: 'blob'});
  }
}
