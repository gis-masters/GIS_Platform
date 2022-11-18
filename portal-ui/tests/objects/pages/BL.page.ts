import { Page, PageModel } from '../Page';

class BLPage extends Page implements PageModel {
  url = '/bl/';

  get $container(): Promise<WebdriverIO.Element> {
    return $('.StoryWrapper');
  }

  async openExample(blockName: string, storyName: string): Promise<void> {
    await browser.url(`${this.url}iframe.html?id=${blockName}--${storyName}&viewMode=story`);
  }
}

export const blPage = new BLPage();
