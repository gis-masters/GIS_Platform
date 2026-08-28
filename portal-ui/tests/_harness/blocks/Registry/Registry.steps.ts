import { Then, When } from '@wdio/cucumber-framework';

import { SortOrder } from '../../../../src/app/services/models';
import { blPage } from '../../pages/BL.page';
import { xTableBlock } from '../XTable/XTable.block';
import { registryBlock } from './Registry.block';

Then('в адресной строке реестра сортировка по полю {string} по возрастанию', async (field: string) => {
  await registryBlock.waitForUrlSort(field, SortOrder.ASC);
});

Then('в адресной строке реестра сортировка по полю {string} по убыванию', async (field: string) => {
  await registryBlock.waitForUrlSort(field, SortOrder.DESC);
});

Then('в адресной строке реестра есть фильтр is_folder', async () => {
  await registryBlock.waitForUrlIsFolderFilter();
});

Then('в адресной строке реестра есть строковый фильтр title со значением {string}', async (value: string) => {
  await registryBlock.waitForUrlTitleIlike(value);
});

When('в реестре я меняю сортировку колонки {string}', async (title: string) => {
  await xTableBlock.toggleColumnSort(title);
});

When(
  'я открываю реестр по ссылке с фильтром {string} и сортировкой по убыванию колонки {string}',
  async (value: string, _columnTitle: string) => {
    await blPage.openExampleWithQuery(
      'registry--regular',
      registryBlock.buildStoryQueryForTitleFilterAndDescSort(value)
    );
    await registryBlock.waitForVisible();
  }
);

Then('в реестре колонка {string} отсортирована по убыванию', async (title: string) => {
  await registryBlock.waitForColumnSortDirection(title, SortOrder.DESC);
});

When('в реестре я выбираю размер страницы {int}', async (pageSize: number) => {
  await xTableBlock.setPageSize(pageSize);
});

Then('в реестре размер страницы {int}', async (pageSize: number) => {
  await registryBlock.waitForPageSize(pageSize);
});
