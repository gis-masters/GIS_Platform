import { type WdioCheckElementMethodOptions } from '@wdio/visual-service/dist/types';

import { Block } from '../../classes/Block';
import { MuiInputBlock } from '../MuiInput/MuiInput.block';

class MultipleEditFeatureBlock extends Block {
  selectors = {
    root: '.EditFeatureForm_multipleEdit',
    editFeatureField: '.EditFeatureForm-Row',
    multipleEditButton: '.EditFeatureForm-MultipleEditButton',
    loader: '.EditFeatureContainer .MuiLinearProgress-root'
  };

  async assertSelfie(tag?: string, checkElementOptions?: WdioCheckElementMethodOptions): Promise<void> {
    await super.assertSelfie(tag, {
      hideElements: [...(checkElementOptions?.hideElements || [])],
      ...checkElementOptions
    });
  }

  async clickEditInField(field: string): Promise<void> {
    const $currentField = await this.getFeatureEditField(field);
    const $multipleEditButton = $currentField?.$('.EditFeatureForm-MultipleEditButton');

    await $multipleEditButton?.click();
  }

  async replaceValueInField(field: string, value: string): Promise<void> {
    const $currentField = await this.getFeatureEditField(field);

    const tableFieldValue = new MuiInputBlock($currentField);

    await tableFieldValue.clearValue();
    await tableFieldValue.setValue(value);
  }

  async getFeatureEditField(fieldName: string): Promise<WebdriverIO.Element | undefined> {
    await this.waitForVisible();
    const $$fields = await this.findAllBySelector('editFeatureField');

    for (const $field of $$fields) {
      const name = await $field.$('.EditFeatureForm-Label').getText();

      if (name === fieldName) {
        return $field;
      }
    }
  }
}

export const multipleEditFeatureBlock = new MultipleEditFeatureBlock();
