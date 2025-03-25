import { Page } from '../Page';
import { blPage } from './BL.page';
import { dataManagementPage } from './DataManagement.page';
import { homePage } from './Home.page';
import { passwordRestorePage } from './PasswordRestore.page';
import { projectsPage } from './Projects.page';
import { registerPage } from './Register.page';
import { systemManagementPage } from './SystemManagement.page';
import { testDataPreparationPage } from './TestDataPreparationPage.page';

export const pagesRegistry: Page[] = [
  blPage,
  dataManagementPage,
  homePage,
  passwordRestorePage,
  projectsPage,
  registerPage,
  systemManagementPage,
  testDataPreparationPage
];
