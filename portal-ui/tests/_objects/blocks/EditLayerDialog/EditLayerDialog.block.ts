import { Block } from '../../Block';
import { FormBlock } from '../Form/Form.block';
import { MuiInputBlock } from '../MuiInput/MuiInput.block';
import { MuiSelectBlock } from '../MuiSelect/MuiSelect.block';
import { SelectProjectionBlock } from '../SelectProjection/SelectProjection.block';

class EditLayerPropertiesDialogBlock extends Block {
  selectors = {
    container: '.EditLayerDialog',
    layerPropertyFormDialogViewSelect: '.EditLayerDialog .Form-Field:first-child .MuiSelect-select',
    formDialogLayerPropertySaveBtn: '.EditLayerDialog .MuiButton-outlinedPrimary',
    loading: '.EditLayerDialog .Loading'
  };

  async getChoiceValue(fieldTitle: string): Promise<string> {
    const formBlock = new FormBlock(this.selectors.container);
    const $field = await formBlock.getField(fieldTitle);

    if (!$field) {
      throw new Error(`Не найден элемент ${fieldTitle}`);
    }

    const muiSelect = new MuiSelectBlock($field);

    return await muiSelect.getText();
  }

  async selectOption(optionTitle: string, fieldTitle: string): Promise<void> {
    await this.waitForLoadingHide();

    const formBlock = new FormBlock(this.selectors.container);
    const $field = await formBlock.getField(fieldTitle);

    if (!$field) {
      throw new Error(`Не найден элемент ${fieldTitle}`);
    }

    const muiSelect = new MuiSelectBlock($field);
    await muiSelect.selectOptionByTitle(optionTitle);
  }

  async layerPropertyDialogSelectPhotoLayer(optionTitle: string): Promise<void> {
    const muiSelect = new MuiSelectBlock(this.selectors.container);
    await muiSelect.selectOptionByTitle(optionTitle);
  }

  async saveLayerProperty(): Promise<void> {
    const $layerPropertySaveBtn = await this.$('formDialogLayerPropertySaveBtn');
    await $layerPropertySaveBtn.waitForClickable({ timeout: 1000 });
    await $layerPropertySaveBtn.click();
  }

  async setStringFieldValue(title: string, value: string): Promise<void> {
    const formBlock = new FormBlock(this.selectors.container);
    const $field = await formBlock.getField(title);

    if (!$field) {
      throw new Error(`Не найден элемент ${title}`);
    }

    const inputBlock = new MuiInputBlock($field);
    await inputBlock.clearValue();
    await inputBlock.setValue(value);
  }

  async setChoiceFieldValue(title: string, optionTitle: string): Promise<void> {
    const formBlock = new FormBlock(this.selectors.container);
    const $field = await formBlock.getField(title);

    if (!$field) {
      throw new Error(`Не найден элемент ${title}`);
    }

    const muiSelect = new MuiSelectBlock($field);
    await muiSelect.selectOptionByTitle(optionTitle);
  }

  async waitForLoadingHide(): Promise<void> {
    const $loading = await this.$('loading');
    await $loading.waitForDisplayed({ reverse: true, timeout: 5000 });
  }

  async selectProjection(code: string): Promise<void> {
    const selectProjectionBlock = new SelectProjectionBlock(this.selectors.container);
    await selectProjectionBlock.selectProjectionByCode(code);
  }
}

export const editLayerPropertiesDialogBlock = new EditLayerPropertiesDialogBlock();
