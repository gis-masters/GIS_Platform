import { Given, Then, When } from '@wdio/cucumber-framework';

import { root } from './blocks/Root/Root';
import { testUsers } from './commands/auth/testUsers';
import { getProjectsByTitle } from './commands/projects/getProjectsByTitle';
import { Page, pagesRegistry } from './Page';
import { blPage } from './pages/BL.page';
import { dataManagementPage } from './pages/DataManagement.page';
import { MapPage } from './pages/Map.page';

function findPage(title: string): Page {
  const page = Object.values(pagesRegistry).find(page => page.title === title);
  if (!page) {
    throw new Error(`Нет страницы "${title}"${JSON.stringify(Object.keys(pagesRegistry))}`);
  }

  return page;
}

Then(/^открылась страница "([^"]*)"$/, async (title: string) => {
  const page = findPage(title);
  await page.waitForVisible();
  await page.testUrl();
});

Then(/^открылась страница карты проекта "([^"]*)"$/, async (title: string) => {
  const projects = await getProjectsByTitle(title);
  if (projects.length !== 1) {
    throw new Error(`Ошибка получения проекта "${title}"`);
  }

  const mapPage = new MapPage(projects[0].id);

  await mapPage.waitForVisible();
  await mapPage.testUrl();
});

Given(/^я на странице "([^"]*)"$/, async (title: string) => {
  const page = findPage(title);
  await page.open();
});

Given(/^я на странице карты проекта "([^"]*)"$/, async (title: string) => {
  const projects = await getProjectsByTitle(title);
  if (projects.length === 1) {
    const mapPage = new MapPage(projects[0].id);

    await mapPage.open();
  } else {
    throw new Error(`Ошибка получения проекта "${title}"`);
  }
});

When(/^я перехожу на страницу "([^"]*)"$/, async (title: string) => {
  const page = findPage(title);
  await browser.url(page.url);
  await root.waitForExist();
});

When(
  /^я перехожу на страницу "([^"]*)" с гостевыми логином-паролем пользователя "([^"]*)"$/,
  async (pageTitle: string, user: keyof typeof testUsers) => {
    if (!testUsers[user]) {
      throw new Error(`Нет пользователя "${user}"`);
    }

    const { email, password } = testUsers[user];

    await browser.url(findPage(pageTitle).url + `/?guestName=${email}&guestPass=${password}`);
    await root.waitForExist();
  }
);

Given(/^я на странице "(.*)" библиотеки блоков$/, async (story: string) => {
  await blPage.openExample(story);
});

When(/^я открываю страницу библиотек в управлении данными$/, async () => {
  await dataManagementPage.openLibraryRootPage();
});

When(/^я открываю страницу наборов данных в управлении данными$/, async () => {
  await dataManagementPage.openDatasetRootPage();
});

When(/^я открываю страницу карты проекта "([^"]*)"$/, async (title: string) => {
  const projects = await getProjectsByTitle(title);
  if (projects.length === 1) {
    const mapPage = new MapPage(projects[0].id);

    await mapPage.open();
  } else {
    throw new Error(`Ошибка получения проекта "${title}"`);
  }
});

Then(/^открыта страница библиотек в управлении данными$/, async () => {
  await dataManagementPage.testLibraryRootPage();
});
