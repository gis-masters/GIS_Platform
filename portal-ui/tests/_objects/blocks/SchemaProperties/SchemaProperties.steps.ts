import { Then } from '@wdio/cucumber-framework';

import { schemaPropertiesBlock } from './SchemaProperties.block';

Then(
  'в списке свойств схемы, свойство с названием {string} является полем только для чтения',
  async (title: string) => {
    const isReadOnly = await schemaPropertiesBlock.isReadOnlyProperty(title);
    await expect(isReadOnly).toBe(true);
  }
);

Then('в списке свойств схемы, свойство с названием {string} является обязательным полем', async (title: string) => {
  const required = await schemaPropertiesBlock.isRequiredProperty(title);
  await expect(required).toBe(true);
});

Then('в списке свойств схемы, свойство с названием {string} является скрытым полем', async (title: string) => {
  const isHidden = await schemaPropertiesBlock.isHiddenProperty(title);
  await expect(isHidden).toBe(true);
});

Then(
  'в списке свойств схемы, свойство с названием {string} не является полем только для чтения',
  async (title: string) => {
    const isReadOnly = await schemaPropertiesBlock.isReadOnlyProperty(title);
    await expect(isReadOnly).toBe(false);
  }
);

Then('в списке свойств схемы, свойство с названием {string} не является обязательным полем', async (title: string) => {
  const required = await schemaPropertiesBlock.isRequiredProperty(title);
  await expect(required).toBe(false);
});

Then('в списке свойств схемы, свойство с названием {string} не является скрытым полем', async (title: string) => {
  const isHidden = await schemaPropertiesBlock.isHiddenProperty(title);
  await expect(isHidden).toBe(false);
});
