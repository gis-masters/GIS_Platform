import { observable, action } from 'mobx';

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
  @observable toc: Toc = [];
  @observable tocLoaded = false;

  @action
  setToc (toc: Toc) {
    this.toc = toc;
    this.tocLoaded = true;
  }

  @action
  setItemContent (content: string, item: TocItem) {
    item.content = content;
  }

  private static _instance: Help;

  private constructor() { }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const help = Help.instance;
