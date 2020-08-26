import {
  ActivatedRouteSnapshot,
  RoutesRecognized,
  UrlSegment,
  Params,
  Data,
  ParamMap,
  RouterEvent
} from '@angular/router';
import { observable, action } from 'mobx';

import { services } from '../services/services';

class Route {
  private static _instance: Route;

  @observable url: UrlSegment[];
  @observable params: Params;
  @observable queryParams: Params;
  @observable fragment: string;
  @observable data: Data;
  @observable paramMap: ParamMap;
  @observable queryParamMap: ParamMap;
  @observable currentPage: string;

  @action
  private setRoute(route: ActivatedRouteSnapshot) {
    this.url = route.url;
    this.params = route.params;
    this.queryParams = route.queryParams;
    this.fragment = route.fragment;
    this.data = route.data;
    this.paramMap = route.paramMap;
    this.queryParamMap = route.queryParamMap;

    if (this.url.length) {
      this.currentPage = this.url[0].path;
    } else {
      this.currentPage = '';
    }
  }

  private constructor() {
    this.subscribe();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  private async subscribe() {
    await services.provided;

    this.setRoute(this.getDeepestChildren(services.router.routerState.snapshot.root));

    services.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof RoutesRecognized) {
        this.setRoute(this.getDeepestChildren(event.state.root));
      }
    });
  }

  private getDeepestChildren(snapshot: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    return snapshot.children.length ? this.getDeepestChildren(snapshot.children[0]) : snapshot;
  }
}

export const route = Route.instance;
