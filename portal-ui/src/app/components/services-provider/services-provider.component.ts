import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { services } from '../../services/services';
import { ImportService } from '../../services/geoserver/import/import.service';
import { ProjectsService } from '../../services/crg/projects.service';
import { HttpQueue } from '../../services/util/HttpQueue';

@Component({
  selector: 'crg-services-provider',
  template: ' '
})
export class ServicesProvider {
  constructor (private route: ActivatedRoute,
              private router: Router,
              private importService: ImportService,
              private projectsService: ProjectsService,
              private httpq: HttpQueue) {
    services.importService = this.importService;
    services.projectsService = this.projectsService;
    services.httpq = this.httpq;
    services.route = this.route;
    services.router = this.router;
  }
}
