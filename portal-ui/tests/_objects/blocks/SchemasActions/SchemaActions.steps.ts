import { Then, When } from '@wdio/cucumber-framework';

import { schemaActionsBlock } from './SchemaActions.block';
import { getTestSchema } from '../../commands/schemas/testSchemas';
import { Schema } from '../../../../src/app/services/data/schema/schema.models';

const allTypesWithAsTitleSchema: Schema = {
  ...getTestSchema('Все типы данных'),
  properties: getTestSchema('Все типы данных').properties.map(property => {
    if (property.name === 'field_int') {
      return {
        ...property,
        asTitle: true
      };
    }

    return property;
  })
};

When('я открываю окно редактирования схемы данных', async () => {
  await schemaActionsBlock.clickEditBtn();
});

When('в окне редактирования схемы данных добавляю в схему атрибут asTitle в поле field_int', async () => {
  await schemaActionsBlock.updateSchema(JSON.stringify(allTypesWithAsTitleSchema));
});

When('в окне редактирования схемы данных нажимаю кнопку `Сохранить`', async () => {
  await schemaActionsBlock.clickSaveBtn();
});

Then('в окне редактирования схемы в поле field_int содержится атрибут asTitle', async () => {
  await expect(await schemaActionsBlock.getEditingSchema()).toEqual(allTypesWithAsTitleSchema);
});
