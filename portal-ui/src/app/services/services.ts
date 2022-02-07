import { NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

interface ServicesList {
  route: ActivatedRoute;
  router: Router;
  ngZone: NgZone;
  logger: NGXLogger;
}

class Services implements ServicesList {
  route: ActivatedRoute;
  router: Router;
  ngZone: NgZone;
  logger: NGXLogger;

  provided: Promise<void>;

  private onFulfilled: () => void;

  constructor() {
    this.provided = new Promise(resolve => {
      this.onFulfilled = resolve;
    });
  }

  provide(servicesList: ServicesList) {
    this.route = servicesList.route;
    this.router = servicesList.router;
    this.ngZone = servicesList.ngZone;
    this.logger = servicesList.logger;

    this.onFulfilled();

    // для автотестов
    // eslint-disable-next-line dot-notation
    window['navigate'] = (url: string) => {
      void services.ngZone.run(async () => {
        await services.router.navigateByUrl(url);
      });
    };
  }
}

export const services = new Services();

export const getRoute = (): ActivatedRoute => services.route;
