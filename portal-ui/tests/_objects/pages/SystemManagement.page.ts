import { Page } from '../Page';

class SystemManagementPage extends Page {
  url = '/system-management';

  get $container(): Promise<WebdriverIO.Element> {
    return $('.SystemManagement');
  }
}

export const systemManagementPage = new SystemManagementPage();
