import { Given, Then, When } from '@wdio/cucumber-framework';

import { blPage } from './pages/BL.page';
import { root } from './blocks/Root/Root';
import { MapPage } from './pages/Map.page';
import { Page, pagesRegistry } from './Page';
import { ScenarioScope } from './ScenarioScope';
import { testUsers } from './commands/auth/testUsers';
import { dataManagementPage } from './pages/DataManagement.page';
import { getProjectsByTitle } from './commands/projects/getProjectsByTitle';

function findPage(title: string): Page {
  const page = Object.values(pagesRegistry).find(page => page.title === title);
  if (!page) {
    throw new Error(`Нет страницы "${title}"${JSON.stringify(Object.keys(pagesRegistry))}`);
  }

  return page;
}

Then('открылась страница {string}', async (title: string) => {
  const page = findPage(title);
  await page.waitForVisible();
  await page.testUrl();
});

Then('открылась страница карты проекта {string}', async (title: string) => {
  const projects = await getProjectsByTitle(title);
  if (projects.length !== 1) {
    throw new Error(`Ошибка получения проекта "${title}"`);
  }

  const mapPage = new MapPage(projects[0].id);

  await mapPage.waitForVisible();
  await mapPage.testUrl();
});

Given('я на странице {string}', async (title: string) => {
  const page = findPage(title);
  await page.open();
});

Given('я нахожусь на странице карты проекта', async function (this: ScenarioScope) {
  await new MapPage(this.latestProject.id).open();
});

When(/^я перехожу на страницу карты проекта "([^"]*)"$/, async (title: string) => {
  const projects = await getProjectsByTitle(title);
  if (projects.length === 1) {
    await new MapPage(projects[0].id).open();
  } else {
    throw new Error(`Ошибка получения проекта "${title}"`);
  }

  const mapPage = new MapPage(projects[0].id);
  await mapPage.open();
});

When('я перехожу на страницу {string}', async (title: string) => {
  const page = findPage(title);
  await browser.url(page.url);
  await root.waitForExist();
});

When(
  'я перехожу на страницу {string} с гостевыми логином-паролем пользователя {string}',
  async (pageTitle: string, user: keyof typeof testUsers) => {
    if (!testUsers[user]) {
      throw new Error(`Нет пользователя "${user}"`);
    }

    const { email, password } = testUsers[user];

    await browser.url(findPage(pageTitle).url + `/?guestName=${email}&guestPass=${password}`);
    await root.waitForExist();
  }
);

Given('я на странице {string} библиотеки блоков', async (story: string) => {
  await blPage.openExample(story);
});

When('я открываю страницу библиотек в управлении данными', async () => {
  await dataManagementPage.openLibraryRootPage();
});

Given(/^я на странице `Наборы данных` в управлении данными$/, async () => {
  await dataManagementPage.openDatasetRootPage();
});

When('я открываю страницу наборов данных в управлении данными', async () => {
  await dataManagementPage.openDatasetRootPage();
});

When('я перехожу в созданный проект', async function (this: ScenarioScope) {
  await new MapPage(this.latestProject.id).open();
});

Then('открыта страница библиотек в управлении данными', async () => {
  await dataManagementPage.testLibraryRootPage();
});

Given(
  'я перешел на страницу созданной векторной таблицы в созданном наборе данных, и выбрал её',
  async function (this: ScenarioScope) {
    const { latestVectorTable, latestDataset } = this;

    const url = `/data-management?path_dm=%5B"r","root","dr","datasetRoot","dataset","${latestDataset.identifier}",
                "table","${latestVectorTable.identifier}"%5D&opts_dm=%5B0,10,"created_at","desc",%7B%7D%5D`;

    await browser.url(url);
  }
);
