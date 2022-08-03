import { observable, action, makeObservable } from 'mobx';

import { Platform } from '../services/environment';

export interface TocItem {
  id: string;
  title: string;
  platforms?: Platform[];
  contentUrl?: string;
  content?: string;
  children?: TocItem[];
}

export type Toc = TocItem[];

class Help {
  private static _instance: Help;

  @observable toc: Toc = [];
  @observable tocLoaded = false;

  constructor() {
    makeObservable(this);
  }

  @action
  setToc(toc: Toc) {
    this.toc = toc;
    this.tocLoaded = true;
  }

  @action
  setItemContent(content: string, item: TocItem) {
    item.content = content;
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const help = Help.instance;
