import { Page } from '../Page';

class SystemManagementPage extends Page {
  title = 'Администрирование системы';
  url = 'system-management';

  selectors = {
    container: '.SystemManagement'
  };
}

export const systemManagementPage = new SystemManagementPage();
