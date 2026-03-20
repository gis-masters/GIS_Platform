import { Page } from '../classes/Page';

class RegisterPage extends Page {
  title = 'Регистрация';
  url = 'register';

  selectors = {
    root: 'crg-register .container'
  };
}

export const registerPage = new RegisterPage();
