import { When } from '@wdio/cucumber-framework';

import { type Schema } from '../../../../src/app/services/data/schema/schema.models';
import { getTestSchema } from '../../commands/schemas/testSchemas';
import { schemaEditDialogBlock } from './SchemaEditDialog.block';

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

When(
  'в списке свойств схемы я нажимаю кнопку редактирования на свойстве с названием {string}',
  async (title: string) => {
    await schemaEditDialogBlock.clickEditDialogPropertyByTitle(title);
  }
);

When(
  'в поле редактирования свойства с названием {string} делаю клик по полю с пометкой {string}',
  async (title: string, fieldName: string) => {
    await schemaEditDialogBlock.changePropertyAttributeByName(title, fieldName);
  }
);

When('в окне редактирования схемы данных добавляю в схему атрибут asTitle в поле field_int', async () => {
  await schemaEditDialogBlock.updateSchema(JSON.stringify(allTypesWithAsTitleSchema));
});

When('в окне редактирования схемы данных нажимаю кнопку `Сохранить`', async () => {
  await schemaEditDialogBlock.clickSaveBtn();
});
