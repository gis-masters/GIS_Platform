import { Block } from '../../Block';
import { FormBlock } from '../Form/Form.block';
import { MuiInputBlock } from '../MuiInput/MuiInput.block';
import { MuiSelectBlock } from '../MuiSelect/MuiSelect.block';

class EditLayerPropertiesDialogBlock extends Block {
  selectors = {
    container: '.EditLayerDialog',
    layerPropertyFormDialogViewSelect: '.EditLayerDialog .Form-Field:first-child .MuiSelect-select',
    formDialogLayerPropertySaveBtn: '.EditLayerDialog .MuiButton-outlinedPrimary',
    loading: '.EditLayerDialog .Loading'
  };

  async viewFieldFirstValue(viewTitle: string): Promise<void> {
    const $layerPropertyFormDialogViewSelect = await this.$('layerPropertyFormDialogViewSelect');
    await $layerPropertyFormDialogViewSelect.waitForClickable();

    const view = await $layerPropertyFormDialogViewSelect.getText();

    await expect(view).toEqual(viewTitle);
  }

  async layerPropertyDialogSelectOptionByTitle(optionTitle: string): Promise<void> {
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

  async waitForLoadingHide(): Promise<void> {
    const $loading = await this.$('loading');
    await $loading.waitForDisplayed({ reverse: true, timeout: 5000 });
  }
}

export const editLayerPropertiesDialogBlock = new EditLayerPropertiesDialogBlock();
