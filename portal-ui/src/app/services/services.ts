import { NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

interface ServicesList {
  route: ActivatedRoute;
  router: Router;
  ngZone: NgZone;
  logger: NGXLogger;
}

const initError = new Error('services не инициализированы');

class Services implements ServicesList {
  private _route?: ActivatedRoute;
  private _router?: Router;
  private _ngZone?: NgZone;
  private _logger?: NGXLogger;

  provided: Promise<void>;

  private onFulfilled?: () => void;

  constructor() {
    this.provided = new Promise(resolve => {
      this.onFulfilled = resolve;
    });
  }

  get route(): ActivatedRoute {
    if (!this._route) {
      throw initError;
    }

    return this._route;
  }

  get router(): Router {
    if (!this._router) {
      throw initError;
    }

    return this._router;
  }

  get ngZone(): NgZone {
    if (!this._ngZone) {
      throw initError;
    }

    return this._ngZone;
  }

  get logger(): NGXLogger {
    if (!this._logger) {
      throw initError;
    }

    return this._logger;
  }

  provide(servicesList: ServicesList) {
    this._route = servicesList.route;
    this._router = servicesList.router;
    this._ngZone = servicesList.ngZone;
    this._logger = servicesList.logger;

    this.onFulfilled?.();

    // для автотестов
    Object.assign(window, {
      navigate: (url: string) => {
        void services.ngZone?.run(async () => {
          await services.router?.navigateByUrl(url);
        });
      }
    });
  }
}

export const services = new Services();

export const getRoute = (): ActivatedRoute => {
  return services.route;
};
