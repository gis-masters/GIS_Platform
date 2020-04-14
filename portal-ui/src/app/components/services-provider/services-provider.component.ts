import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

import { services } from '../../services/services';
import { HttpQueue } from '../../services/util/HttpQueue';

@Component({
  selector: 'crg-services-provider',
  template: ' '
})
export class ServicesProvider {
  constructor (private route: ActivatedRoute,
              private router: Router,
              private ngZone: NgZone,
              private httpq: HttpQueue,
              private logger: NGXLogger) {
    services.provide({
      httpq: this.httpq,
      route: this.route,
      router: this.router,
      ngZone: this.ngZone,
      logger: this.logger
    });
  }
}
