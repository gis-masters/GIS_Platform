import { Then, When } from '@wdio/cucumber-framework';

import { schemaActionsBlock } from './SchemaActions.block';
import { testSchemas } from '../../commands/schemas/testSchemas';

When('я открываю карточку редактирования схемы данных', async () => {
  await schemaActionsBlock.clickEditBtn();
});

When('в карточке редактирования схемы данных добавляю в схему атрибут asTitle в поле field_int', async () => {
  const updatedSchema = testSchemas['Схема содержащая все типы данных и аттрибут asTitle'];
  await schemaActionsBlock.updateSchema(JSON.stringify(updatedSchema));
});

Then('схема, которая была обновлена, не потеряла данные при сохранении', async () => {
  const expectedSchema = testSchemas['Схема содержащая все типы данных и аттрибут asTitle'];
  const updatedSchema = await schemaActionsBlock.getSelectedSchema();

  expect(updatedSchema).toEqual(expectedSchema);
});
