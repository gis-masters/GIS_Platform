import { HttpClient } from '@angular/common/http';

import { ImportService } from './geoserver/import/import.service';

class Services {
  importService: ImportService;
  httpClient: HttpClient;
}

export const services = new Services();
