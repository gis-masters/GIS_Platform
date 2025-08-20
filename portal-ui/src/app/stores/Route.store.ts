import { action, makeObservable, observable } from 'mobx';
import { ActivatedRouteSnapshot, ChildActivationStart, ParamMap, RoutesRecognized, UrlSegment } from '@angular/router';

import { AppRouteData } from '../app-routing.module';
import { services } from '../services/services';

type Params = Record<string, string>;

export enum Pages {
  NONE = '',
  HOME = 'home',
  LOGIN = 'login',
  REGISTER = 'register',
  RECOVERY = 'recovery',
  ABOUT = 'about',
  PROJECTS = 'projects',
  IMPORT = 'import',
  MAP = 'map',
  ORG_ADMIN = 'org-admin',
  SYSTEM_MANAGEMENT = 'system-management',
  DATA_MANAGEMENT = 'data-management',
  TASKS_JOURNAL = 'tasks-journal',
  TASK = 'task',
  REGISTRY = 'registry',
  DOCUMENT = 'document',
  SERVICES_CALCULATOR = 'services-calculator',
  RESTORE_PASSWORD = 'restore-password',
  CHANGE_PASSWORD = 'change-password',
  TEST_DATA_PREPARATION = 'test-data-preparation',
  PHOTO_UPLOADER = 'photo'
}

class Route {
  private static _instance: Route;
  static get instance() {
    return this._instance || (this._instance = new this());
  }

  @observable url?: UrlSegment[];
  @observable params: Params = {};
  @observable queryParams: Params = {};
  @observable fragment?: string;
  @observable data: AppRouteData = { page: Pages.NONE };
  @observable paramMap?: ParamMap;
  @observable queryParamMap?: ParamMap;

  private constructor() {
    makeObservable(this);
    void this.subscribe();
  }

  @action
  private setRoute(route: ActivatedRouteSnapshot) {
    this.url = route.url;
    this.params = route.params;
    this.queryParams = route.queryParams;
    this.fragment = route.fragment || '';
    this.data = route.data as AppRouteData;
    this.paramMap = route.paramMap;
    this.queryParamMap = route.queryParamMap;
  }

  private async subscribe() {
    await services.provided;

    this.setRoute(this.getDeepestChildren(services.router.routerState.snapshot.root));

    services.router.events.subscribe(e => {
      this.setRoute(this.getDeepestChildren(services.router.routerState.snapshot.root));

      if (e instanceof ChildActivationStart) {
        this.setRoute(this.getDeepestChildren(e.snapshot.root));
      }

      if (e instanceof RoutesRecognized) {
        this.setRoute(this.getDeepestChildren(e.state.root));
      }
    });

    services.router.initialNavigation();
  }

  private getDeepestChildren(snapshot: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    return snapshot.firstChild ? this.getDeepestChildren(snapshot.firstChild) : snapshot;
  }
}

export const route = Route.instance;
