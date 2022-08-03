import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { default as OlFeature } from 'ol/Feature';
import { Geometry } from 'ol/geom';

import { AppModule } from './app/app.module';
import { getEnvironment } from './app/services/environment';

declare module 'react' {
  export interface CSSProperties {
    [key: string]: string | number;
  }
}

declare module 'ol/format/EsriJSON' {
  type Feature<T extends Geometry> = OlFeature<T>;
}

declare module 'ol/format/GeoJSON' {
  type Feature<T extends Geometry> = OlFeature<T>;
}

declare global {
  interface ObjectConstructor {
    keys<T>(obj: T): Array<keyof T>;
  }

  interface Clipboard {
    read(): Promise<Array<ClipboardItem>>;
    write(items: Array<ClipboardItem>): Promise<void>;
  }

  interface NodeListOf<TNode extends Node> extends NodeList {
    [Symbol.iterator](): IterableIterator<TNode>;
  }

  interface HTMLCollection {
    [Symbol.iterator](): IterableIterator<Element>;
  }

  interface ResizeObserverCallback {
    (entries: ResizeObserverEntry[], observer: ResizeObserver): void;
  }

  interface ResizeObserverOptions {
    box?: ResizeObserverBoxOptions;
  }
}

getEnvironment()
  .then(environment => {
    if (environment.production) {
      enableProdMode();
    }
  })
  .catch((error: unknown) => console.error(error));

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((error: unknown) => console.error(error));
