import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as DOMPurify from 'dompurify';
import moment from 'moment';
import { default as OlFeature } from 'ol/Feature';
import { Geometry } from 'ol/geom';

import { AppModule } from './app/app.module';
import { environment, EnvironmentData } from './app/services/environment';

moment.locale('ru');

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

  const _environmentRaw: EnvironmentData;
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((error: unknown) => console.error(error));

// Хук для сохранения "target"='_blank' в ссылках после оборачивания санитайзером
const TEMP_ATTR = 'data-target';
DOMPurify.addHook('beforeSanitizeAttributes', function (n) {
  if (n.tagName === 'A' && n.hasAttribute('target')) {
    const attribute = n.getAttribute('target');
    if (attribute) {
      n.setAttribute(TEMP_ATTR, attribute);
    }
  }
});
DOMPurify.addHook('afterSanitizeAttributes', function (n) {
  if (n.tagName === 'A' && n.hasAttribute(TEMP_ATTR)) {
    const attribute = n.getAttribute(TEMP_ATTR);
    if (attribute) {
      n.setAttribute('target', attribute);
      n.removeAttribute(TEMP_ATTR);
    }

    if (n.getAttribute('target') === '_blank') {
      n.setAttribute('rel', 'noopener');
    }
  }
});
