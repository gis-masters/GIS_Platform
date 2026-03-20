import { Page } from '../classes/Page';

class HomePage extends Page {
  title = 'Домашняя';
  url = '';

  selectors = {
    root: 'crg-home-page .container'
  };
}

export const homePage = new HomePage();
