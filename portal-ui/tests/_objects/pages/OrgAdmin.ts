import { Page } from '../Page';

export class OrgAdminPage extends Page {
  selectors = {
    root: '.OrgAdmin'
  };

  title = 'Управление организацией';
  url = 'org-admin';
}
