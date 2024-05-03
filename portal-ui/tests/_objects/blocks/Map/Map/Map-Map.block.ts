import { WdioCheckElementMethodOptions } from 'wdio-image-comparison-service';

import { Block } from '../../../Block';

class MapMapBlock extends Block {
  selectors = {
    container: '.map__map',
    toolbar: '.MapToolbar',
    basemap: '.BasemapsSelect',
    zoom: '.ol-zoom',
    sidebarOpenBtn: '.LayersSidebar-Open'
  };

  async assertSelfie(tag?: string, checkElementOptions?: WdioCheckElementMethodOptions): Promise<void> {
    await super.assertSelfie(tag, {
      hideElements: [
        await this.$('toolbar'),
        await this.$('basemap'),
        await this.$('zoom'),
        await this.$('sidebarOpenBtn'),
        ...(checkElementOptions?.hideElements || [])
      ],
      ...checkElementOptions
    });
  }
}

export const mapMapBlock = new MapMapBlock();
