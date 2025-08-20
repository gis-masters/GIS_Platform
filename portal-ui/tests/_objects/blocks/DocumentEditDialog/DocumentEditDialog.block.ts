import { Block } from '../../Block';
import { MuiInputBlock } from '../MuiInput/MuiInput.block';

class DocumentEditDialogBlock extends Block {
  selectors = {
    container: '.LibraryDocumentActions-EditDialog',
    saveButton: '.LibraryDocumentActions-EditDialog button[type="submit"]',
    form: '.LibraryDocumentActions-EditDialog form',
    formField: '.LibraryDocumentActions-EditDialog .Form-Control'
  };

  async setStringFieldValue(fieldName: string, value: string): Promise<void> {
    await this.waitForVisible();

    const $field = await this.getFormField(fieldName);
    if (!$field) {
      throw new Error(`Не найдено поле "${fieldName}"`);
    }

    const inputBlock = new MuiInputBlock($field);
    await inputBlock.clearValue();
    await inputBlock.setValue(value);
  }

  async clickSaveButton(): Promise<void> {
    await this.waitForVisible();

    const $saveButton = await this.$('saveButton');
    await $saveButton.waitForClickable();
    await $saveButton.click();
  }

  async waitForErrorMessage(field: string, message: string): Promise<void> {
    await this.waitForVisible();

    const $currentField = await this.getFormField(field);

    if (!$currentField) {
      throw new Error(`Не найдено поле "${field}"`);
    }

    const $errorMessage = await $currentField.$('.MuiFormHelperText-root');
    await $errorMessage.waitForDisplayed();
    await expect(await $errorMessage.getText()).toContain(message);
  }

  async waitForClose(): Promise<void> {
    await this.waitForVisible();

    const $container = await this.$('container');
    await browser.waitUntil(
      async () => {
        return !(await $container.isExisting());
      },
      {
        timeout: 5000,
        timeoutMsg: 'Диалог редактирования документа не закрылся'
      }
    );
  }

  private async getFormField(fieldName: string): Promise<WebdriverIO.Element | undefined> {
    await this.waitForVisible();

    const $form = await this.$('form');
    const $$fields = await $form.$$('.Form-Field');

    for (const $field of $$fields) {
      const label = await $field.$('.Form-Label').getText();
      if (label === fieldName) {
        return $field.$('.Form-Control');
      }
    }
  }
}

export const documentEditDialog = new DocumentEditDialogBlock();
