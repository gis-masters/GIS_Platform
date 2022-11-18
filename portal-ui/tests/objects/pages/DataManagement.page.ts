import { Page } from '../Page';

class DataManagementPage extends Page {
  url = 'data-management';

  get $container(): Promise<WebdriverIO.Element> {
    return $('.DataManagement');
  }
}

export const dataManagementPage = new DataManagementPage();
