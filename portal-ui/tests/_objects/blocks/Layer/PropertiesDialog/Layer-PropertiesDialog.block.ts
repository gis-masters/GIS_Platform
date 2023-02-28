import { Block } from '../../../Block';
import { saveScreenshot } from '../../../commands/saveScreenshot';
import { MuiSelect } from '../../MuiSelect/MuiSelect.block';

class LayerPropertiesDialog extends Block {
  selectors = {
    container: '.Layer-PropertiesDialog',
    layerPropertyFormDialogViewSelect: '.Layer-PropertiesDialog .Form-Field:first-child .MuiSelect-select',
    formDialogLayerPropertySaveBtn: '.Layer-PropertiesDialog .MuiButton-outlinedPrimary'
  };

  async viewFieldFirstValue(viewTitle: string): Promise<void> {
    await saveScreenshot();
    const $layerPropertyFormDialogViewSelect = await this.$('layerPropertyFormDialogViewSelect');
    await $layerPropertyFormDialogViewSelect.waitForClickable();

    const view = await $layerPropertyFormDialogViewSelect.getText();

    expect(view).toEqual(viewTitle);
  }

  async layerPropertyDialogSelectViewThirdOption(): Promise<void> {
    const muiSelect = new MuiSelect(this.selectors.container);
    await muiSelect.selectOption(3);
  }

  async saveLayerProperty(): Promise<void> {
    const $layerPropertySaveBtn = await this.$('formDialogLayerPropertySaveBtn');
    await $layerPropertySaveBtn.waitForClickable({ timeout: 1000 });
    await $layerPropertySaveBtn.click();
  }
}

export const layerPropertiesDialog = new LayerPropertiesDialog();
