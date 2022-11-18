import { Page, PageModel } from '../Page';

class HomePage extends Page implements PageModel {
  url = '/';

  get $container(): Promise<WebdriverIO.Element> {
    return $('crg-home-page .container');
  }
}

export const homePage = new HomePage();
