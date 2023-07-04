import { Then, When } from '@wdio/cucumber-framework';

import { schemaActionsBlock } from './SchemaActions.block';
import { getTestSchema } from '../../commands/schemas/testSchemas';

When('я открываю карточку редактирования схемы данных', async () => {
  await schemaActionsBlock.clickEditBtn();
});

When('в карточке редактирования схемы данных добавляю в схему атрибут asTitle в поле field_int', async () => {
  const updatedSchema = getTestSchema('Все типы данных и атрибут asTitle');
  await schemaActionsBlock.updateSchema(JSON.stringify(updatedSchema));
});

Then('схема, которая была обновлена, не потеряла данные при сохранении', async () => {
  const expectedSchema = getTestSchema('Все типы данных и атрибут asTitle');
  const updatedSchema = await schemaActionsBlock.getSelectedSchema();

  await expect(updatedSchema).toEqual(expectedSchema);
});
