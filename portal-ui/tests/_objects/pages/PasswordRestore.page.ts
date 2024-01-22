import { Page } from '../Page';

export class PasswordRestorePage extends Page {
  title = 'Восстановление пароля';
  url = 'restore-password';

  selectors = {
    container: '.RestorePassword '
  };
}

export const passwordRestorePage = new PasswordRestorePage();
