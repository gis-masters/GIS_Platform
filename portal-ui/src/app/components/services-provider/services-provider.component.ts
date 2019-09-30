import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ImportService } from '../../services/geoserver/import/import.service';
import { services } from '../../services/services';

@Component({
  selector: 'crg-services-provider',
  template: ' '
})
export class ServicesProvider {
  constructor (private importService: ImportService,
              private httpClient: HttpClient) {
    services.importService = this.importService;
    services.httpClient = this.httpClient;
  }
}
