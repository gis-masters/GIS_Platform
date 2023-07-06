import { When } from '@wdio/cucumber-framework';

import { createVectorTableBlock } from './CreateVectorTable.block';
import { explorerBlock } from '../Explorer/Explorer.block';

When('я создаю новую векторную таблицу с названием {string}', async (tableName: string) => {
  await createVectorTableBlock.createTable(tableName);
});

When('отсутствует кнопка создания векторной таблицы', async () => {
  const isExist = await explorerBlock.isCreateLayerBtnExist();

  await expect(isExist).toEqual(false);
});
