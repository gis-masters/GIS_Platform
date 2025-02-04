import { When } from '@wdio/cucumber-framework';

import { Schema } from '../../../../src/app/services/data/schema/schema.models';
import { getTestSchema } from '../../commands/schemas/testSchemas';
import { schemaActionsBlock } from './SchemaActions.block';

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

When(
  'в списке свойств схемы я нажимаю кнопку редактирования на свойстве с названием {string}',
  async (title: string) => {
    await schemaActionsBlock.clickEditDialogPropertyByTitle(title);
  }
);

When(
  'в поле редактирования свойства с названием {string} делаю клик по полю с пометкой {string}',
  async (title: string, fieldName: string) => {
    await schemaActionsBlock.changePropertyAttributeByName(title, fieldName);
  }
);

When('в окне редактирования схемы данных добавляю в схему атрибут asTitle в поле field_int', async () => {
  await schemaActionsBlock.updateSchema(JSON.stringify(allTypesWithAsTitleSchema));
});

When('в окне редактирования схемы данных нажимаю кнопку `Сохранить`', async () => {
  await schemaActionsBlock.clickSaveBtn();
});
