import { Given, Then, When } from '@wdio/cucumber-framework';

import { Schema } from '../../src/app/services/data/schema/schema.models';
import { sleep } from '../../src/app/services/util/sleep';
import { mapBlock } from './blocks/Map/Map.block';
import { root } from './blocks/Root/Root';
import { xTableBlock } from './blocks/XTable/XTable.block';
import { TestUser } from './commands/auth/testUsers';
import { getDocumentsLibraryByTitle } from './commands/docLibrary/getDocLibraryByTitle';
import { getProjectByTitle } from './commands/projects/getProjectByTitle';
import { Page } from './Page';
import { pagesRegistry } from './pages/_pagesRegistry';
import { blPage } from './pages/BL.page';
import { dataManagementPage } from './pages/DataManagement.page';
import { LibraryRegistryPage } from './pages/LibraryRegistry.page';
import { MapPage } from './pages/Map.page';
import { OrgAdminPage } from './pages/OrgAdmin';
import { TasksJournalPage } from './pages/TasksJournal.page';
import { ScenarioScope } from './ScenarioScope';

async function findPage(title: string): Promise<Page> {
  const page = pagesRegistry.find(page => page.title === title);
  if (!page) {
    await sleep(500);
    throw new Error(`Нет страницы "${title}" ${JSON.stringify(pagesRegistry.map(({ title }) => title))}`);
  }

  return page;
}

// common

Given('я на странице {string}', async (title: string) => {
  const page = await findPage(title);
  await page.open();
});

When('я перехожу на страницу {string}', async (title: string) => {
  const page = await findPage(title);
  await browser.url(page.url);
  await root.waitForExist();
});

Then('открылась страница {string}', async (title: string) => {
  const page = await findPage(title);
  await page.waitForVisible();
  await page.testUrl();
});

When('я жду открытия страницы {string}', async (title: string) => {
  const page = await findPage(title);
  await page.waitForVisible();
  await page.testUrl();
});

When(
  'я перехожу на страницу {string} с гостевыми логином-паролем пользователя {user}',
  async (pageTitle: string, user: TestUser) => {
    const page = await findPage(pageTitle);
    await browser.url(page.url + `/?guestName=${user.email}&guestPass=${user.password}`);
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

Given('я на странице карты проекта {string}', openProjectMap);

Given(
  'я на странице карты проекта с центром {string} и масштабом {string}',
  async function (this: ScenarioScope, center: string, zoom: string) {
    await new MapPage(this.latestProject.id).open(`?zoom=${zoom}&center=${center}`);
  }
);

Given('я на странице карты проекта', async function (this: ScenarioScope) {
  await new MapPage(this.latestProject.id).open();
});

Given(
  'я на странице карты проекта, спозиционированной на объектах созданного слоя: {strings}',
  async function (this: ScenarioScope, ids: string[]) {
    const { latestDataset, latestVectorTable, latestProject } = this;

    const mapPage = new MapPage(latestProject.id);
    await mapPage.openWithPositionToFeatures(
      latestProject.id,
      latestDataset.identifier,
      latestVectorTable.identifier,
      ids
    );
    await mapBlock.waitForVisible();
  }
);

Given(
  'я на странице карты проекта, спозиционированной на объектах слоя {string}: {strings}',
  async function (this: ScenarioScope, layerTitle: string, ids: string[]) {
    const { latestDataset, latestProject } = this;

    const tableName = this.findLayerByTitle(layerTitle).tableName;
    if (!tableName) {
      throw new Error(`У слоя '${layerTitle}' отсутствует название таблицы, по которой он создан`);
    }

    const mapPage = new MapPage(latestProject.id);
    await mapPage.openWithPositionToFeatures(latestProject.id, latestDataset.identifier, tableName, ids);
  }
);

Given(
  'я на странице карты проекта, открыт объект с id {int} слоя {string}',
  async function (this: ScenarioScope, objectId: number, layerTitle: string) {
    const { latestDataset, latestProject } = this;

    const tableName = this.findLayerByTitle(layerTitle).tableName;
    if (!tableName) {
      throw new Error(`У слоя '${layerTitle}' отсутствует название таблицы, по которой он создан`);
    }

    await new MapPage(latestProject.id).openWithPositionToFeatures(
      latestProject.id,
      latestDataset.identifier,
      tableName,
      [String(objectId)]
    );
  }
);

Given('я на странице карты проекта, открыт объект с id {int}', async function (this: ScenarioScope, objectId: number) {
  const { latestDataset, latestVectorTable, latestProject } = this;

  await new MapPage(latestProject.id).openWithPositionToFeatures(
    latestProject.id,
    latestDataset.identifier,
    latestVectorTable.identifier,
    [String(objectId)]
  );
});

When('я перехожу на страницу карты проекта {string}', openProjectMap);

Then('открылась страница карты проекта {string}', async (title: string) => {
  const project = await getProjectByTitle(title);
  const mapPage = new MapPage(project.id);
  await mapPage.waitForVisible();
  await mapPage.testUrl();
});

// bl

Given('я на странице {string} библиотеки блоков', async (story: string) => {
  await blPage.openExample(story);
});

// data management

When('я открываю страницу библиотек в управлении данными', async () => {
  await dataManagementPage.openLibraryRootPage();
});

When('я открываю страницу библиотеки {string} в управлении данными', async (library: string) => {
  const lib = await getDocumentsLibraryByTitle(library);
  await dataManagementPage.openLibraryPage(lib.table_name);
});

When('я открываю страницу управления данными', async () => {
  await dataManagementPage.open();
});

Given('я на странице `Наборы данных` в управлении данными', async () => {
  await dataManagementPage.openDatasetRootPage();
});

Given('я на странице `Проекты` в управлении данными', async () => {
  await dataManagementPage.openProjectRootPage();
});

Given('я на странице `Схемы данных` в управлении данными', async () => {
  await dataManagementPage.openSchemasRootPage();
});

Given('я на странице `Шаблоны схем` в управлении данными, выделена схема {schema}', async (schema: Schema) => {
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

Given(
  'я на странице управление данными и в библиотеке выбран созданный документ',
  async function (this: ScenarioScope) {
    const { latestLibraryRecords } = this;
    const url = `/data-management?path_dm=%5B"r","root","lr","libraryRoot","lib","${latestLibraryRecords[0].libraryTableName}",
                "doc","${latestLibraryRecords[0].id}"%5D&opts_dm=%5B0,10,"created_at","desc",%7B%7D%5D`;

    await browser.url(url);
  }
);

// library registry

Given('я на странице табличного представления библиотеки документов {string}', async (libraryTitle: string) => {
  const { table_name } = await getDocumentsLibraryByTitle(libraryTitle);
  const libraryRegistryPage = new LibraryRegistryPage(table_name);
  await libraryRegistryPage.open();
  await xTableBlock.waitForLoading();
});

Given('я на странице корзины удаленных документов библиотеки {string}', async (libraryTitle: string) => {
  const { table_name } = await getDocumentsLibraryByTitle(libraryTitle);
  const libraryRegistryPage = new LibraryRegistryPage(table_name);

  await libraryRegistryPage.openDeletedLibraryRegistryPage();
  await libraryRegistryPage.waitForVisible();
});

// tasks

Given('я на странице журнала задач', async () => {
  await new TasksJournalPage().open();
});

Given('я перешел по ссылке к созданной задаче', async function (this: ScenarioScope) {
  if (this.latestTask.id) {
    await browser.url(`/data-management/tasks-journal/${this.latestTask.id}`);
  } else {
    throw new Error('Нет созданной задачи');
  }
});

// org Admin
Given('я нахожусь во вкладке `Пользователи` на странице управлении организацией', async () => {
  await new OrgAdminPage().open();
});

When('я перехожу во вкладку `Пользователи` на странице управлении организацией', async () => {
  await new OrgAdminPage().open();
});

// document
Given('я на странице просмотра созданной папки', async function (this: ScenarioScope) {
  if (this.latestFolder.id) {
    await browser.url(
      `/data-management/library/${this.latestFolder.libraryTableName}/document/${this.latestFolder.id}`
    );
  } else {
    throw new Error('Нет документов в библиотеке');
  }
});
