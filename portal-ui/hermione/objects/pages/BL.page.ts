import { Page } from '../Page';

export class BLPage extends Page {
  selectors = {};

  url = '/bl/';

  async openExample(blockName: string, storyName: string): Promise<void> {
    await this.browser.url(`${this.url}iframe.html?id=example-${blockName}--${storyName}&viewMode=story`);
  }
}
