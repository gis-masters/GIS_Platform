import { When } from '@wdio/cucumber-framework';

import { layersFilterBlock } from './LayersFilter.block';

When('в поле фильтрации я ввожу {string}', async (filterValue: string) => {
  await layersFilterBlock.setFilterValue(filterValue);
});
