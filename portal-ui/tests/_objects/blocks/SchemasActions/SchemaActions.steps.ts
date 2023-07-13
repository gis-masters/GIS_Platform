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

When('я открываю карточку редактирования схемы данных', async () => {
  await schemaActionsBlock.clickEditBtn();
});

When('в карточке редактирования схемы данных добавляю в схему атрибут asTitle в поле field_int', async () => {
  await schemaActionsBlock.updateSchema(JSON.stringify(allTypesWithAsTitleSchema));
});

Then('схема, которая была обновлена, не потеряла данные при сохранении', async () => {
  await expect(await schemaActionsBlock.getSelectedSchema()).toEqual(allTypesWithAsTitleSchema);
});
