import { Page, PageModel } from '../Page';

class RegisterPage extends Page implements PageModel {
  title = 'Регистрация';
  url = 'register';

  get $container(): Promise<WebdriverIO.Element> {
    return $('crg-register .container');
  }
}

export const registerPage = new RegisterPage();
