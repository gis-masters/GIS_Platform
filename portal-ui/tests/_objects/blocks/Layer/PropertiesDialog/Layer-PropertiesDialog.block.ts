import { Block } from '../../../Block';
import { FormBlock } from '../../Form/Form.block';
import { MuiInputBlock } from '../../MuiInput/MuiInput.block';
import { MuiSelectBlock } from '../../MuiSelect/MuiSelect.block';

class LayerPropertiesDialogBlock extends Block {
  selectors = {
    container: '.Layer-PropertiesDialog',
    layerPropertyFormDialogViewSelect: '.Layer-PropertiesDialog .Form-Field:first-child .MuiSelect-select',
    formDialogLayerPropertySaveBtn: '.Layer-PropertiesDialog .MuiButton-outlinedPrimary'
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
    const $field = await formBlock.getCreateTableDialogField(title);

    if (!$field) {
      throw new Error(`Не найден элемент ${title}`);
    }

    const inputBlock = new MuiInputBlock($field);
    await inputBlock.clearValue();
    await inputBlock.setValue(value);
  }
}

export const layerPropertiesDialogBlock = new LayerPropertiesDialogBlock();
