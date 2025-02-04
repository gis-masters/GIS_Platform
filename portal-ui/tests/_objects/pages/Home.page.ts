import { Page } from '../Page';

class HomePage extends Page {
  title = 'Домашняя';
  url = '';

  selectors = {
    container: 'crg-home-page .container'
  };
}

export const homePage = new HomePage();
