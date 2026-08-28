import { type NgZone } from '@angular/core';
import {
  type ActivatedRoute,
  convertToParamMap,
  type NavigationExtras,
  NavigationStart,
  type Params,
  type Router
} from '@angular/router';
import { type NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';

import { services } from '../src/app/services/services';

let initialized = false;

function noop(): void {
  return;
}

function currentSerializedUrl(): string {
  return `${location.pathname}${location.search}${location.hash}`;
}

function createEmptySnapshot() {
  return {
    url: [],
    params: {},
    queryParams: {},
    fragment: '',
    data: { page: '' },
    paramMap: convertToParamMap({}),
    queryParamMap: convertToParamMap({}),
    firstChild: null
  };
}

function toStorybookQueryValue(value: string): string {
  // Storybook при загрузке делает qs.stringify({ encode: false }): сырой % в JSON фильтра
  // (ilike %value%) ломает разбор URL после F5. JSON \u0025 читается как %, в query безопасен.
  return value.replaceAll('%', String.fromCodePoint(92, 117, 48, 48, 50, 53));
}

function applyQueryParams(url: URL, queryParams: Params): void {
  for (const [key, value] of Object.entries(queryParams)) {
    if (value === null || value === undefined) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, toStorybookQueryValue(String(value)));
    }
  }
}

class StorybookRouterStub {
  private readonly events$ = new Subject<NavigationStart>();
  private navigationId = 1;

  readonly events = this.events$.asObservable();
  readonly routerState = {
    snapshot: {
      root: createEmptySnapshot()
    }
  };

  initialNavigation(): void {
    return;
  }

  getCurrentNavigation(): null {
    return null;
  }

  navigate(_commands: unknown[], extras?: NavigationExtras): Promise<boolean> {
    const url = new URL(location.href);
    const queryParams = extras?.queryParams;

    if (queryParams) {
      applyQueryParams(url, queryParams);
    }

    this.commitUrl(`${url.pathname}${url.search}${url.hash}`, extras?.replaceUrl === true);

    return Promise.resolve(true);
  }

  navigateByUrl(url: string): Promise<boolean> {
    this.commitUrl(url, false);

    return Promise.resolve(true);
  }

  listenToHistory(): void {
    window.addEventListener('popstate', () => {
      this.emitNavigation(currentSerializedUrl(), 'popstate');
    });
  }

  private commitUrl(serializedUrl: string, replaceUrl: boolean): void {
    if (serializedUrl === currentSerializedUrl()) {
      return;
    }

    if (replaceUrl) {
      history.replaceState(history.state, '', serializedUrl);
    } else {
      history.pushState(history.state, '', serializedUrl);
    }

    this.emitNavigation(serializedUrl, 'imperative');
  }

  private emitNavigation(url: string, trigger: 'imperative' | 'popstate'): void {
    this.events$.next(new NavigationStart(this.navigationId, url, trigger));
    this.navigationId += 1;
  }
}

function createNgZoneStub(): NgZone {
  return {
    run<T>(fn: () => T): T {
      return fn();
    }
  } as NgZone;
}

function createLoggerStub(): NGXLogger {
  return {
    trace: noop,
    debug: noop,
    info: noop,
    log: noop,
    warn: (...args: unknown[]) => {
      console.warn(...args);
    },
    error: (...args: unknown[]) => {
      console.error(...args);
    },
    fatal: (...args: unknown[]) => {
      console.error(...args);
    },
    registerMonitor: noop,
    updateConfig: noop,
    partialUpdateConfig: noop,
    getConfigSnapshot: () => ({}),
    flushServerQueue: noop
  } as unknown as NGXLogger;
}

export function initStorybookServices(): void {
  if (initialized) {
    return;
  }

  initialized = true;

  const router = new StorybookRouterStub();
  router.listenToHistory();

  services.provide({
    route: {} as ActivatedRoute,
    router: router as unknown as Router,
    ngZone: createNgZoneStub(),
    logger: createLoggerStub()
  });
}
