import { observable, action } from 'mobx';

import { Platform, getEnvironment } from './environment';
import { Toc, help as store } from '../stores/Help.store';

export class HelpPart {
  @observable items?: Toc;
  path: string[];
  inited: Promise<void>;

  private platform: Platform;

  constructor (path?: string) {
    this.path = path ? path.split('/') : [];
    this.inited = new Promise((resolve) => {
      this.init(resolve);
    });
  }

  async initContent (items?: Toc) {
    await this.inited;
    (items || this.items).forEach(async (item) => {
      if (item.children) {
        this.initContent(item.children);
      }
      if (item.contentUrl && !item.content) {
        const responce = await fetch(item.contentUrl);
        const content = await responce.text();
        const folder = item.contentUrl.split('/').slice(0, -1).join('/')
        const contentWithCorrectImg = content.replace(/(<img\ssrc=["']?)([^"' ]+)/ig, `$1${folder}/$2`);
        store.setItemContent(contentWithCorrectImg, item);
      }
    });
  }

  private async init (resolve: () => void) {
    this.platform = (await getEnvironment()).platform;
    if (!store.tocLoaded) {
      await this.initToc()
    }
    this.setItems(this.getCurrentItems(store.toc, this.path));
    resolve();
  }

  @action
  private setItems (items: Toc) {
    this.items = items;
  }

  private async initToc () {
    const responce = await fetch('/assets/help/toc.json');
    const toc = await responce.json();
    store.setToc(this.filterByPlatform(toc));
  }


  private filterByPlatform (toc: Toc): Toc {
    toc = toc.filter(item => !item.platforms || item.platforms.includes(this.platform));
    toc.forEach(item => {
      if (item.children) {
        item.children = this.filterByPlatform(item.children);
      }
    });

    return toc;
  }

  private getCurrentItems (tocPart: Toc, path: string[]): Toc {
    const currPath = path[0];
    const pathLeft = path.slice(1);

    if (!currPath) {
      return tocPart;
    }

    const currItem = tocPart.find(item => item.id === currPath);

    return currItem ? this.getCurrentItems(currItem.children || [currItem], pathLeft) : [];
  }
}
