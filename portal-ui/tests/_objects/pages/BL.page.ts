import { binding, given } from 'cucumber-tsflow/dist';

import { Page, PageModel } from '../Page';

@binding()
class BLPage extends Page implements PageModel {
  title = 'Библиотека блоков';
  url = '';

  get $container(): Promise<WebdriverIO.Element> {
    return $('.StoryWrapper');
  }

  @given(/^я на странице "(.*)" библиотеки блоков$/)
  async openExample(story: string): Promise<void> {
    await browser.url(`iframe.html?id=${story}&viewMode=story`);
    await this.waitForVisible();
    await browser.pause(500);
  }
}

export const blPage = new BLPage();
