import { When } from '@wdio/cucumber-framework';

import { ExplorerBlock } from '../Explorer/Explorer.block';
import { createVectorTableBlock } from './CreateVectorTable.block';

When('я создаю новую векторную таблицу с названием {string}', async (tableName: string) => {
  await createVectorTableBlock.createTable(tableName);
});

When('отсутствует кнопка создания векторной таблицы', async () => {
  const explorerBlock = new ExplorerBlock();
  const isExist = await explorerBlock.isCreateLayerBtnExist();

  await expect(isExist).toEqual(false);
});
