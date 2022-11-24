import { binding, given } from 'cucumber-tsflow/dist';

import { Page, PageModel } from '../Page';

@binding()
class BLPage extends Page implements PageModel {
  url = '/bl/';

  get $container(): Promise<WebdriverIO.Element> {
    return $('.StoryWrapper');
  }

  @given(/^я на странице "(.*)" библиотеки блоков$/)
  async openExample(story: string): Promise<void> {
    await browser.url(`${this.url}iframe.html?id=${story}&viewMode=story`);
    await this.waitForVisible();
  }
}

export const blPage = new BLPage();
