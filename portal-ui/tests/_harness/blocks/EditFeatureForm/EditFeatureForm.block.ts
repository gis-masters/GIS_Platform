import { isEqual } from 'lodash';

import { Block } from '../../classes/Block';
import { MuiInputBlock } from '../MuiInput/MuiInput.block';

class EditFeatureFormBlock extends Block {
  selectors = {
    root: '.EditFeatureForm',
    label: '.EditFeatureForm-Label',
    field: '.EditFeatureForm-Row'
  };

  async waitForForm(): Promise<void> {
    const $form = await this.findBySelector('root');
    await $form.waitForDisplayed();
    const $someField = await this.findBySelector('field');
    await $someField.waitForDisplayed({ timeoutMsg: 'Не отобразилось ни одно поле в форме' });
  }

  async getFormFieldsLabels(): Promise<string[]> {
    const $$fieldLabels = await this.findAllBySelector('label');

    const contents: string[] = [];
    for (const $label of $$fieldLabels) {
      contents.push(await $label.$('span').getText());
    }

    return contents;
  }

  async checkObjectAttributeFields(titles: string[]): Promise<void> {
    await this.waitForForm();

    await browser.waitUntil(
      async () => {
        return isEqual(await this.getFormFieldsLabels(), titles);
      },
      {
        timeout: 1000
      }
    );
  }

  async getFeatureEditField(fieldName: string): Promise<WebdriverIO.Element> {
    await this.waitForForm();
    const $$fields = await this.findAllBySelector('field');

    for (const $field of $$fields) {
      const name = await $field.$('.EditFeatureForm-Label').getText();

      if (name === fieldName) {
        return $field;
      }
    }

    throw new Error(`Не найден элемент ${fieldName}`);
  }

  async changeEditFormFieldValue(title: string, value: string): Promise<void> {
    const inputBlock = await this.getMuiInputBlockElement(title);

    await inputBlock.waitForVisible();
    await inputBlock.clearValue();
    await inputBlock.setValue(value);
  }

  async addValueToEditFormFieldValue(value: string, title: string): Promise<void> {
    const inputBlock = await this.getMuiInputBlockElement(title);
    await inputBlock.waitForVisible();

    const $input = await inputBlock.findBySelector('input');
    await $input.click();

    await browser.keys(['Home']); // Home для перехода в начало строки
    await browser.pause(100); // пауза для гарантии

    await inputBlock.setValue(value);
  }

  async checkFormControlFieldValue(title: string, value: string): Promise<boolean> {
    const $formField = await this.getFeatureEditField(title);
    const $control = await $formField.$('.Form-Control').getElement();

    // Проверяем, является ли поле Select (choice)
    const hasSelect = await $control
      .$('.MuiSelect-select')
      .isExisting()
      .catch(() => false);

    if (hasSelect) {
      // Для Select получаем текст из .MuiSelect-select
      const $selectInput = await $control.$('.MuiSelect-select').getElement();
      const selectValue = await $selectInput.getText();

      return selectValue.trim() === value;
    }

    // Для обычных input используем getValue()
    const inputBlock = new MuiInputBlock($control);
    const inputValue = await inputBlock.getValue();

    return inputValue === value;
  }

  async getFormViewFieldValue(title: string): Promise<string> {
    const $formField = await this.getFeatureEditField(title);

    const inputBlock = await $formField.$('.Form-ViewValue').getElement();

    return await inputBlock.getText();
  }

  async getMuiInputBlockElement(title: string): Promise<MuiInputBlock> {
    const $formField = await this.getFeatureEditField(title);

    return new MuiInputBlock(await $formField.$('.Form-Control').getElement());
  }
}

export const editFeatureFormBlock = new EditFeatureFormBlock();
