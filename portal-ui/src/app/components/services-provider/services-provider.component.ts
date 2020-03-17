import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

import { services } from '../../services/services';
import { ProjectsService } from '../../services/crg/projects.service';
import { CommunicationService } from '../../services/communication.service';
import { HttpQueue } from '../../services/util/HttpQueue';

@Component({
  selector: 'crg-services-provider',
  template: ' '
})
export class ServicesProvider {
  constructor (private route: ActivatedRoute,
              private router: Router,
              private ngZone: NgZone,
              private projectsService: ProjectsService,
              private communicationService: CommunicationService,
              private httpq: HttpQueue,
              private logger: NGXLogger) {
    services.provide({
      projectsService: this.projectsService,
      communicationService: this.communicationService,
      httpq: this.httpq,
      route: this.route,
      router: this.router,
      ngZone: this.ngZone,
      logger: this.logger
    });
  }
}
