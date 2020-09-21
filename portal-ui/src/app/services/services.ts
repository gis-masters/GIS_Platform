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

  private onfullfilled: () => void;

  constructor () {
    this.provided = new Promise(onfullfilled => {
      this.onfullfilled = onfullfilled;
    });
  }

  provide (servicesList: ServicesList) {
    this.route = servicesList.route;
    this.router = servicesList.router;
    this.ngZone = servicesList.ngZone;
    this.logger = servicesList.logger;

    this.onfullfilled();
  }
}

export const services = new Services();

export const getRoute = (): ActivatedRoute => services.route;
