import { type WdioCheckElementMethodOptions } from '@wdio/visual-service/dist/types';

import { Block } from '../../../Block';

class MapMapBlock extends Block {
  selectors = {
    root: '.map__map',
    toolbar: '.MapToolbar',
    basemap: '.BasemapsSelect',
    zoom: '.ol-zoom',
    sidebarOpenBtn: '.LayersSidebar-Open',
    attribution: '.Attribution'
  };

  async assertSelfie(tag?: string, checkElementOptions?: WdioCheckElementMethodOptions): Promise<void> {
    await super.assertSelfie(tag, {
      hideElements: [
        await this.findBySelector('toolbar'),
        await this.findBySelector('basemap'),
        await this.findBySelector('zoom'),
        await this.findBySelector('sidebarOpenBtn'),
        await this.findBySelector('attribution'),
        ...(checkElementOptions?.hideElements || [])
      ],
      ...checkElementOptions
    });
  }
}

export const mapMapBlock = new MapMapBlock();
