import { Page } from '../Page';

export class DataManagementPage extends Page {
  selectors = {
    container: '.DataManagement'
  };

  url = 'data-management';

  async waitForVisible() {
    const $container = await this.getElement('container');

    return $container.waitForDisplayed({ timeout: 5000, timeoutMsg: 'Не появилась страница управления данными' });
  }
}
