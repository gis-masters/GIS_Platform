import { Page } from '../classes/Page';

class SystemManagementPage extends Page {
  title = 'Администрирование системы';
  url = 'system-management';

  selectors = {
    root: '.SystemManagement'
  };
}

export const systemManagementPage = new SystemManagementPage();
