import { sleep } from '../../../../src/app/services/util/sleep';
import { Block } from '../../Block';
import { FormBlock } from '../Form/Form.block';

export class SchemaPropertiesBlock extends Block {
  selectors = {
    container: '.SchemaProperties',
    schemaProperty: '.SchemaProperties-Item',
    schemaPropertyTitle: '.SchemaProperties-PrimaryText',
    schemaPropertyOpenEditButton: '.SchemaProperties-OpenEditButton',
    schemaPropertyReadOnly: '.SchemaProperties-ItemIcon_type_readOnly',
    schemaPropertyRequired: '.SchemaProperties-ItemIcon_type_required',
    schemaPropertyHidden: '.SchemaProperties-ItemIcon_type_hidden'
  };

  async isReadOnlyProperty(title: string): Promise<boolean> {
    const $property = await this.getPropertyByTitle(title);
    const $readOnlyIcon = await $property.$(this.selectors.schemaPropertyReadOnly);

    return await $readOnlyIcon.isDisplayed();
  }

  async isRequiredProperty(title: string): Promise<boolean> {
    const $property = await this.getPropertyByTitle(title);
    const $requiredIcon = await $property.$(this.selectors.schemaPropertyRequired);

    return await $requiredIcon.isDisplayed();
  }

  async isHiddenProperty(title: string): Promise<boolean> {
    const $property = await this.getPropertyByTitle(title);
    const $hiddenIcon = await $property.$(this.selectors.schemaPropertyHidden);

    return await $hiddenIcon.isDisplayed();
  }

  async getPropertyByTitle(title: string): Promise<WebdriverIO.Element> {
    const $container = await this.$('container');
    const $$properties = await $container.$$(this.selectors.schemaProperty);

    for (const $property of $$properties) {
      const $title = await $property.$(this.selectors.schemaPropertyTitle);
      const text = await $title.getText();

      if (text === title) {
        return $property;
      }
    }

    throw new Error('Свойство с искомым title не найдено');
  }

  async getInputCheckboxByPropertyTitleAndFieldLabel(title: string, fieldLabel: string): Promise<WebdriverIO.Element> {
    const $property = await this.getPropertyByTitle(title);
    const $propertyFieldsContainer = await $property.nextElement();

    await $propertyFieldsContainer.waitForDisplayed();

    const form = new FormBlock($propertyFieldsContainer);

    return await form.getFieldCheckboxInputRoot(fieldLabel);
  }

  async clickEditPropertyByTitle(title: string): Promise<void> {
    const $property = await this.getPropertyByTitle(title);
    const $btn = await $property.$(this.selectors.schemaPropertyOpenEditButton);

    await $btn.waitForClickable();
    await $btn.click();
    await sleep(314); // ждем анимации открытия аккордеона
  }
}

export const schemaPropertiesBlock = new SchemaPropertiesBlock();
