import { Given } from '@wdio/cucumber-framework';

import { blPage } from '../pages/BL.page';
import { homePage } from '../pages/Home.page';
import { projectsPage } from '../pages/Projects.page';
import { registerPage } from '../pages/Register.page';
import { dataManagementPage } from '../pages/DataManagement.page';

const pages = {
  bl: blPage,
  dataManagement: dataManagementPage,
  home: homePage,
  проекты: projectsPage,
  register: registerPage
};

export async function openPage(page: keyof typeof pages): Promise<void> {
  await pages[page].open();
}

Given(/^я на странице "(.*)"/, async (page: keyof typeof pages) => {
  await openPage(page);
});
