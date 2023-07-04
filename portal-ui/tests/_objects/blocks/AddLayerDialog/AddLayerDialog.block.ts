import { Block } from '../../Block';

class AddLayerDialogBlock extends Block {
  selectors = {
    container: '.AddLayerDialog',
    addLayerDialogViewField: '.AddLayerDialog .Form-Content .Form-Field:last-child label',
    layerFormDialogSelectDatasource: '.AddLayerDialog .SelectVectorTable'
  };

  async checkViewFieldIsAppear(): Promise<void> {
    const $addLayerDialogViewField = await this.$('addLayerDialogViewField');
    await $addLayerDialogViewField.waitForDisplayed();

    const vectorTableTitle = await $addLayerDialogViewField.getText();
    await expect(vectorTableTitle).toEqual('Представление');
  }

  async checkViewFieldIsNotAppear(): Promise<void> {
    await expect(this.$('addLayerDialogViewField')).not.toBeDisplayed();
  }

  async selectDatasource(): Promise<void> {
    const $layerDialogSelectDatasource = await this.$('layerFormDialogSelectDatasource');
    await $layerDialogSelectDatasource.waitForDisplayed();

    await $layerDialogSelectDatasource.click();
  }
}

export const addLayerDialogBlock = new AddLayerDialogBlock();
