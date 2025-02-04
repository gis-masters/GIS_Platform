import { Then, When } from '@wdio/cucumber-framework';
import { isEqual, sortBy } from 'lodash';

import { ScenarioScope } from '../../ScenarioScope';
import { xTableFilterTypeBoolBlock } from '../XTable/Filter/_type/XTable-Filter_type_bool.block';
import { xTableBlock } from '../XTable/XTable.block';
import { libraryRegistryBlock } from './LibraryRegistry.block';

When(
  'в окне выбора документа я выбираю документ с значением {string} в колонке {string}',
  async function (value: string, field: string) {
    await libraryRegistryBlock.selectRowItem(value, field);
  }
);

When(
  'на странице табличного представления библиотеки документов я удаляю документ с значением {string} в колонке {string}',
  async function (value: string, field: string) {
    await libraryRegistryBlock.deleteDocument(value, field);
  }
);

When(
  'в корзине удалённых документов у документа с значением {string} в колонке {string} я нажимаю кнопку {string}',
  async function (value: string, field: string, action: string) {
    await libraryRegistryBlock.restoreDocument(value, field, action);
  }
);

Then(
  'в корзине удалённых документов находится документ с значением {string} в поле {string}',
  async function (field: string, value: string) {
    const document = await libraryRegistryBlock.isDocumentExist(field, value);

    await expect(document).toBeTruthy();
  }
);

When(
  'в реестре документов в поле фильтра по id я ввожу идентификатор существующего документа',
  async function (this: ScenarioScope) {
    const id = this.latestLibraryRecords[1]?.id;

    if (!id) {
      throw new Error('Отсутствуют тестовые документы');
    }

    await libraryRegistryBlock.setIdFilter(String(id));
  }
);

When(
  'в реестре документов в поле фильтра по id я ввожу идентификаторы двух существующих документов через пробел',
  async function (this: ScenarioScope) {
    const ids = [2, 3].map(index => this.latestLibraryRecords[index]?.id).filter(Boolean);

    if (!ids.length) {
      throw new Error('Отсутствуют тестовые документы');
    }

    await libraryRegistryBlock.setIdFilter(ids.join(' '));
  }
);

When('в реестре документов в поле фильтра по id я ввожу {string}', async (value: string) => {
  await libraryRegistryBlock.setIdFilter(value);
});

When('в реестре документов в поле фильтра {string} я выбираю да', async (title: string) => {
  await xTableFilterTypeBoolBlock.setValueTrue(title);
  await xTableBlock.waitForLoading();
});

When('в реестре документов я отключаю фильтр для поля {string}', async (title: string) => {
  await xTableFilterTypeBoolBlock.clearFilterValue(title);
  await xTableBlock.waitForLoading();
});

When('жду загрузку страницы в реестре документов', async () => {
  await xTableBlock.waitForLoading();
});

When(
  'в таблице реестров документов я ввожу в фильтр поля типа FIAS {string} значение {string}',
  async (colTitle: string, filter: string) => {
    await libraryRegistryBlock.xTable.filterFiasColumn(colTitle, filter);
  }
);

Then(
  'в реестре документов в колонке {string} отображается значение: {string}',
  async function (colTitle: string, expected: string[]) {
    await browser.pause(200); // бага в browser.waitUntil
    isEqual(await libraryRegistryBlock.xTable.getColValues(colTitle), expected);
  }
);

Then(
  'в реестре документов отображается только документ с указанным идентификатором',
  async function (this: ScenarioScope) {
    const id = this.latestLibraryRecords[1]?.id;

    await browser.pause(100); // баг waitUntil

    await browser.waitUntil(async () => isEqual([id], await libraryRegistryBlock.getVisibleDocumentsIds()), {
      timeout: 10_000
    });
  }
);

When(
  'я дожидаюсь, пока в реестре документов отобразятся только документы с указанными идентификаторами',
  async function (this: ScenarioScope) {
    const ids = [2, 3].map(index => this.latestLibraryRecords[index]?.id).filter(Boolean);
    await browser.pause(200); // баг waitUntil

    const currentIds = await libraryRegistryBlock.getVisibleDocumentsIds();

    // sortBy т.к. фильтр по умолчанию настроен на поле title
    await browser.waitUntil(() => isEqual(sortBy(ids), sortBy(currentIds)), {
      timeout: 10_000
    });
  }
);

Then(
  'в реестре документов отображается только документы с указанными идентификаторами',
  async function (this: ScenarioScope) {
    const ids = [2, 3].map(index => this.latestLibraryRecords[index]?.id).filter(Boolean);
    await browser.pause(200); // баг waitUntil

    const currentIds = await libraryRegistryBlock.getVisibleDocumentsIds();

    // sortBy т.к. фильтр по умолчанию настроен на поле title
    await browser.waitUntil(() => isEqual(sortBy(ids), sortBy(currentIds)), {
      timeout: 10_000
    });
  }
);

Then('в реестре документов не отображается ни одной записи', async () => {
  await browser.waitUntil(
    async () => {
      const ids = await libraryRegistryBlock.getVisibleDocumentsIds();

      return ids.length === 0;
    },
    {
      timeout: 10_000
    }
  );
});
