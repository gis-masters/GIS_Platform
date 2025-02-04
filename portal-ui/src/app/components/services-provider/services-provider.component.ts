import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

import { services } from '../../services/services';

@Component({
  selector: 'crg-services-provider',
  template: ' '
})
export class ServicesProvider {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private logger: NGXLogger
  ) {
    services.provide({
      route: this.route,
      router: this.router,
      ngZone: this.ngZone,
      logger: this.logger
    });
  }
}
