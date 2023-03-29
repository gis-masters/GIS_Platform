import { Then, When } from '@wdio/cucumber-framework';
import { isEqual } from 'lodash';

import { ScenarioScope } from '../../ScenarioScope';
import { libraryRegistryBlock } from './LibraryRegistry.block';

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

    await browser.waitUntil(async () => isEqual([id], await libraryRegistryBlock.getVisibleDocumentsIds()), {
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
