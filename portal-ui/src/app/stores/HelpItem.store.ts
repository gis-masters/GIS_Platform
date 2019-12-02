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


class HelpItem implements TocItem {
  id: string;
  title: string;
  platforms?: Platform[];
  contentUrl?: string;
  content?: string;
  children?: TocItem[];

  constructor (item: TocItem) {
    this.id = item.id;
    this.title = item.title;
    this.platforms = item.platforms;
    this.contentUrl = item.contentUrl;
    this.content = item.content;
    this.children = item.children;
  }
}
