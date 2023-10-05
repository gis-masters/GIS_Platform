import { Then, When } from '@wdio/cucumber-framework';
import { isEqual } from 'lodash';

import { ScenarioScope } from '../../ScenarioScope';
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

    await browser.pause(100); // баг waitUntil

    await browser.waitUntil(async () => isEqual(ids, await libraryRegistryBlock.getVisibleDocumentsIds()), {
      timeout: 10_000
    });
  }
);

Then(
  'в реестре документов отображается только документы с указанными идентификаторами',
  async function (this: ScenarioScope) {
    const ids = [2, 3].map(index => this.latestLibraryRecords[index]?.id).filter(Boolean);

    await browser.waitUntil(async () => isEqual(ids, await libraryRegistryBlock.getVisibleDocumentsIds()), {
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
