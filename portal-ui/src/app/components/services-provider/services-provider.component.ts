import { Component, NgZone } from '@angular/core';
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
              private ngZone: NgZone,
              private importService: ImportService,
              private projectsService: ProjectsService,
              private httpq: HttpQueue) {
    services.provide({
      importService: this.importService,
      projectsService: this.projectsService,
      httpq: this.httpq,
      route: this.route,
      router: this.router,
      ngZone: this.ngZone
    });
  }
}
