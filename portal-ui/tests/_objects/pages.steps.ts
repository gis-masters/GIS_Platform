import { DataTable, Given, Then, When } from '@wdio/cucumber-framework';

import { blPage } from './pages/BL.page';
import { root } from './blocks/Root/Root';
import { MapPage } from './pages/Map.page';
import { Page, pagesRegistry } from './Page';
import { ScenarioScope } from './ScenarioScope';
import { testUsers } from './commands/auth/testUsers';
import { dataManagementPage } from './pages/DataManagement.page';
import { LibraryRegistryPage } from './pages/LibraryRegistry.page';
import { getProjectByTitle } from './commands/projects/getProjectByTitle';
import { getDocumentsLibraryByTitle } from './commands/docLibrary/getDocLibraryByTitle';
import { getTestSchema } from './commands/schemas/testSchemas';

function findPage(title: string): Page {
  const page = Object.values(pagesRegistry).find(page => page.title === title);
  if (!page) {
    throw new Error(`Нет страницы "${title}"${JSON.stringify(Object.keys(pagesRegistry))}`);
  }

  return page;
}

// common

Given('я на странице {string}', async (title: string) => {
  const page = findPage(title);
  await page.open();
});

When('я перехожу на страницу {string}', async (title: string) => {
  const page = findPage(title);
  await browser.url(page.url);
  await root.waitForExist();
});

Then('открылась страница {string}', async (title: string) => {
  const page = findPage(title);
  await page.waitForVisible();
  await page.testUrl();
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

When('я перезагружаю страницу браузера', async () => {
  await browser.refresh();
  await root.waitForVisible();
});

// project map

const openProjectMap = async (title: string) => {
  const project = await getProjectByTitle(title);
  const mapPage = new MapPage(project.id);
  await mapPage.open();
};

Given('я нахожусь на странице карты проекта', async function (this: ScenarioScope) {
  await new MapPage(this.latestProject.id).open();
});

When('я перехожу на страницу карты проекта {string}', openProjectMap);

Given('я на странице карты проекта {string}', openProjectMap);

Then('открылась страница карты проекта {string}', async (title: string) => {
  const project = await getProjectByTitle(title);
  const mapPage = new MapPage(project.id);
  await mapPage.waitForVisible();
  await mapPage.testUrl();
});

Given('я на странице карты проекта {string}', async (title: string) => {
  const project = await getProjectByTitle(title);
  const mapPage = new MapPage(project.id);
  await mapPage.open();
});

Given(
  'я нахожусь на странице карты проекта, спозиционированной на объектах созданного слоя',
  async function (this: ScenarioScope, table: DataTable) {
    const { latestDataset, latestVectorTable, latestProject } = this;

    const data = table.raw()[1];

    const mapPage = new MapPage(latestProject.id);
    await mapPage.openWithPositionToFeatures(
      latestProject.id,
      latestDataset.identifier,
      latestVectorTable.identifier,
      data[0].split(', ')
    );
  }
);

Given(
  'я нахожусь на странице карты проекта, открыт объект с id {int}',
  async function (this: ScenarioScope, objectId: number) {
    const { latestDataset, latestVectorTable, latestProject } = this;

    const mapPage = new MapPage(latestProject.id);
    await mapPage.openWithPositionToFeatures(latestProject.id, latestDataset.identifier, latestVectorTable.identifier, [
      String(objectId)
    ]);
  }
);

// bl

Given('я на странице {string} библиотеки блоков', async (story: string) => {
  await blPage.openExample(story);
});

// data management

When('я открываю страницу библиотек в управлении данными', async () => {
  await dataManagementPage.openLibraryRootPage();
});

Given('я на странице `Наборы данных` в управлении данными', async () => {
  await dataManagementPage.openDatasetRootPage();
});

Given('я на странице `Схемы данных` в управлении данными', async () => {
  await dataManagementPage.openSchemasRootPage();
});

Given('я на странице `Схемы данных` в управлении данными, выделена схема {string}', async (schemaTitle: string) => {
  const schema = getTestSchema(schemaTitle);
  await dataManagementPage.openSchemaPageWithSelectedSchema(schema.name);
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

// library registry

Given('я на странице табличного представления библиотеки документов {string}', async (libraryTitle: string) => {
  const { table_name } = await getDocumentsLibraryByTitle(libraryTitle);
  const libraryRegistryPage = new LibraryRegistryPage(table_name);
  await libraryRegistryPage.open();
});
