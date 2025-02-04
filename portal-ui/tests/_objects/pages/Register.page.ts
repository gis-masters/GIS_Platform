import { Page } from '../Page';

class RegisterPage extends Page {
  title = 'Регистрация';
  url = 'register';

  selectors = {
    container: 'crg-register .container'
  };
}

export const registerPage = new RegisterPage();
