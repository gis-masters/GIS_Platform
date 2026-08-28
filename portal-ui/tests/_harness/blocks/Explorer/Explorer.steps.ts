import { Then, When } from '@wdio/cucumber-framework';

import { getDocumentsLibraryByTitle } from '../../commands/docLibrary/getDocLibraryByTitle';
import { blPage } from '../../pages/BL.page';
import { dataManagementPage } from '../../pages/DataManagement.page';
import { type ScenarioScope } from '../../ScenarioScope';
import { ExplorerBlock } from './Explorer.block';

When('в диалоговом окне выбора источника данных я выбираю набор данных', async function (this: ScenarioScope) {
  const { latestDataset } = this;
  const explorerBlock = new ExplorerBlock();

  await explorerBlock.openExplorerItem(latestDataset.title);
});

When('в диалоговом окне выбора источника данных я выбираю векторную таблицу {string}', async (datatable: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.selectExplorerItem(datatable);
});

When('я открываю созданный набор данных', async function (this: ScenarioScope) {
  const { latestDataset } = this;
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.openExplorerItem(latestDataset.title);
});

When('в explorer я захожу внутрь элемента с названием {string}', async (folder: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.openExplorerItem(folder);
});

When('я открываю explorer по ссылке на несуществующий элемент внутри набора {string}', async (datasetTitle: string) => {
  const explorerBlock = new ExplorerBlock();
  await blPage.openExampleWithQuery(
    'explorer--regular',
    explorerBlock.buildStoryQueryForNonexistentItemInDataset(datasetTitle)
  );
});

When('я открываю explorer по ссылке на второй элемент третьей страницы раздела "Наборы данных"', async () => {
  const explorerBlock = new ExplorerBlock();
  await blPage.openExampleWithQuery(
    'explorer--regular',
    explorerBlock.buildStoryQueryForSecondItemOnThirdPageOfDatasetsSection()
  );
});

When(
  'я открываю explorer по ссылке на второй элемент раздела "Наборы данных" с номером страницы, на которой этого элемента нет',
  async () => {
    const explorerBlock = new ExplorerBlock();
    await blPage.openExampleWithQuery(
      'explorer--regular',
      explorerBlock.buildStoryQueryForSecondItemOnWrongPageOfDatasetsSection()
    );
  }
);

When(
  'я открываю explorer по ссылке на второй элемент раздела "Наборы данных" с номером несуществующей страницы',
  async () => {
    const explorerBlock = new ExplorerBlock();
    await blPage.openExampleWithQuery(
      'explorer--regular',
      explorerBlock.buildStoryQueryForSecondItemOnNonexistentPageOfDatasetsSection()
    );
  }
);

When(
  'я открываю explorer по ссылке на раздел "Наборы данных" с размером страницы 5 и сортировкой по названию',
  async () => {
    const explorerBlock = new ExplorerBlock();
    await blPage.openExampleWithQuery(
      'explorer--regular',
      explorerBlock.buildStoryQueryForDatasetsSectionWithTitleSortAndPageSize()
    );
  }
);

When(
  'я открываю explorer по ссылке на элемент раздела "Наборы данных" с настроенными фильтром, сортировкой и размером страницы',
  async () => {
    const explorerBlock = new ExplorerBlock();
    await blPage.openExampleWithQuery(
      'explorer--regular',
      explorerBlock.buildStoryQueryForDatasetsItemWithFilterSortAndPageSize()
    );
  }
);

When('в explorer я захожу внутрь созданного документа', async function (this: ScenarioScope) {
  const explorerBlock = new ExplorerBlock();
  if (this.latestLibraryRecords[0]?.title) {
    await explorerBlock.openExplorerItem(this.latestLibraryRecords[0].title);
  }
});

When('в наборах данных я выбираю векторную таблицу {string}', async (datatable: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.selectExplorerItem(datatable);
});

When('в списке элементов explorer я выбираю элемент {string}', async (datatable: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.selectExplorerItem(datatable);
});

When('в списке элементов explorer все элементы недоступны', async () => {
  const explorerBlock = new ExplorerBlock();
  const disabled = await explorerBlock.allItemsAreDisabled();

  expect(disabled).toEqual(true);
});

When('я нажимаю кнопку `Подключить в проект` в панели свойств векторной таблицы', async () => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.addToProject();
});

When('я дожидаюсь окончания загрузки в explorer', async () => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.waitForVisible();
});

When('в библиотеке документов я выбираю {string}', async (explorerItem: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.selectExplorerItem(explorerItem);
});

When('я выбираю набор данных {string}', async (dataset: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.selectExplorerItem(dataset);
});

When('я выбираю созданный набор данных', async function (this: ScenarioScope) {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.selectExplorerItem(this.latestDataset.title);
});

When('я ввожу значение {string} в поле поиска explorer', async (value: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.setSearchValue(value);
});

When('я нажимаю кнопку поиска в explorer', async () => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.clickSearchSubmit();
});

Then('список названий в explorer: {strings}', async (titles: string[]) => {
  const explorerBlock = new ExplorerBlock();
  expect(titles).toEqual(await explorerBlock.getListTitles());
});

Then('список в explorer пуст', async () => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.testEmptiness();
});

Then('в списке элементов explorer присутствует {string}', async (itemTitle: string) => {
  const explorerBlock = new ExplorerBlock();
  await browser.waitUntil(
    async () => {
      await explorerBlock.waitForLoading();
      const titles = await explorerBlock.getListTitles();

      return titles.includes(itemTitle);
    },
    {
      timeoutMsg: `Элемент "${itemTitle}" не найден в explorer`
    }
  );
});

Then('в списке элементов explorer отсутствует {string}', async (itemTitle: string) => {
  const explorerBlock = new ExplorerBlock();
  await browser.waitUntil(
    async () => {
      await explorerBlock.waitForLoading();
      const titles = await explorerBlock.getListTitles();

      return !titles.includes(itemTitle);
    },
    {
      timeoutMsg: `Элемент "${itemTitle}" всё ещё отображается в explorer`
    }
  );
});

When('в списке элементов explorer я выбираю элемент с подписью содержащей {string}', async (fragment: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.selectExplorerItemWithSecondaryContaining(fragment);
});

Then(
  'в библиотеке {string} в папке {string} существует документ {string}',
  async (library: string, folder: string, doc: string) => {
    const lib = await getDocumentsLibraryByTitle(library);
    await dataManagementPage.openLibraryPage(lib.table_name);

    const explorerBlock = new ExplorerBlock();
    await explorerBlock.openExplorerItem(folder);

    expect(await explorerBlock.getListTitles()).toContain(doc);
  }
);

Then('в адресной строке нет данных об элементах Explorer', async () => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.assertNoExplorerStateInUrl();
});

Then(
  'в адресной строке отображается путь к разделу {string} с выбранным первым элементом',
  async (sectionTitle: string) => {
    const explorerBlock = new ExplorerBlock();
    await explorerBlock.waitForUrlPathToSectionWithFirstItem(sectionTitle);
  }
);

Then('в адресной строке последний пункт пути соответствует элементу {string}', async (title: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.waitForUrlLastPathItem(title);
});

Then('в explorer выделен элемент {string}', async (title: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.waitForSelectedItem(title);
});

Then('в explorer открыта страница {int}', async (pageNumber: number) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.waitForCurrentPage(pageNumber);
});

Then('в explorer фильтр заполнен значением {string}', async (value: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.waitForFilterValue(value);
});

Then('в explorer выбрана сортировка {string}', async (label: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.waitForSortLabel(label);
});

Then('в explorer направление сортировки {string}', async (label: string) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.waitForSortDirection(label);
});

Then('в explorer размер страницы {int}', async (pageSize: number) => {
  const explorerBlock = new ExplorerBlock();
  await explorerBlock.waitForPageSize(pageSize);
});
