import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { getEnvironment } from './app/services/environment';

declare module 'react' {
  export interface CSSProperties {
    [key: string]: string | number;
  }
}

declare global {
  interface ObjectConstructor {
    keys<T>(obj: T): Array<keyof T>;
  }

  interface ClipboardItem {
    readonly types: string[];
    getType: (type: string) => Promise<Blob>;
  }

  const ClipboardItem: {
    prototype: ClipboardItem;
    new (objects: Record<string, Blob>): ClipboardItem;
  };

  interface Clipboard {
    read?(): Promise<Array<ClipboardItem>>;
    write?(items: Array<ClipboardItem>): Promise<void>;
  }

  interface ShareData {
    text?: string;
    title?: string;
    url?: string;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  interface Navigator extends Navigator {
    share: (options?: ShareData) => Promise<void>;
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
