import { Page } from '../classes/Page';

export class PasswordRestorePage extends Page {
  title = 'Восстановление пароля';
  url = 'restore-password';

  selectors = {
    root: '.RestorePassword '
  };
}

export const passwordRestorePage = new PasswordRestorePage();
