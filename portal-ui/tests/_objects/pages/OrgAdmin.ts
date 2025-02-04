import { Page } from '../Page';

export class OrgAdminPage extends Page {
  selectors = {
    container: '.OrgAdmin'
  };

  title = 'Управление организацией';
  url = 'org-admin';
}
