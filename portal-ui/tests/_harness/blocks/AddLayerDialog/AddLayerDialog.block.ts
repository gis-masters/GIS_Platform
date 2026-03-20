import { Block } from '../../classes/Block';
import { FormBlock } from '../Form/Form.block';

class AddLayerDialogBlock extends Block {
  selectors = {
    root: '.AddLayerDialog',
    addLayerDialogViewField: '.AddLayerDialog .Form-Content .Form-Field:last-child label',
    layerFormDialogSelectDatasource: '.AddLayerDialog .SelectVectorTableControl',
    layerFormDialogSelectLibraryRecord: '.AddLayerDialog .SelectFileInLibraryRecordControl',
    layerTypesControl: '.AddLayerDialog .Form-Control',
    addLayerBtn: '.AddLayerDialog .MuiButton-outlinedPrimary',
    loader: '.AddLayerDialog .MuiButton-outlinedPrimary.MuiLoadingButton-root'
  };

  async checkViewFieldIsAppear(): Promise<void> {
    const $addLayerDialogViewField = await this.findBySelector('addLayerDialogViewField');
    await $addLayerDialogViewField.waitForDisplayed();

    const vectorTableTitle = await $addLayerDialogViewField.getText();
    expect(vectorTableTitle).toEqual('Представление');
  }

  async checkViewFieldIsNotAppear(): Promise<void> {
    await expect(await this.findBySelector('addLayerDialogViewField')).not.toBeDisplayed();
  }

  async selectDatasource(): Promise<void> {
    const $layerDialogSelectDatasource = await this.findBySelector('layerFormDialogSelectDatasource');
    await $layerDialogSelectDatasource.waitForDisplayed();

    await $layerDialogSelectDatasource.click();
  }

  async selectLibraryRecord(): Promise<void> {
    const $layerDialogSelectDatasource = await this.findBySelector('layerFormDialogSelectLibraryRecord');
    await $layerDialogSelectDatasource.waitForDisplayed();

    await $layerDialogSelectDatasource.click();
  }

  async clickAddLayerBtn(): Promise<void> {
    const $addLayerBtn = await this.findBySelector('addLayerBtn');
    await $addLayerBtn.waitForDisplayed();

    await $addLayerBtn.click();
  }

  async waitForDialogDisappear() {
    const $root = await this.findBySelector('root');
    await $root.waitForExist({ reverse: true });
  }

  async waitForDialogExist() {
    const $root = await this.findBySelector('root');
    await $root.waitForExist();
  }

  async selectLayerType(layerType: string): Promise<void> {
    const $root = await this.findBySelector('root');
    const formBlock = new FormBlock($root);
    const $formField = await formBlock.getField('Тип слоя');

    const $$layerTypeButtons = await $formField.$$('.MuiButtonBase-root').getElements();
    for (const $layerTypeBtn of $$layerTypeButtons) {
      const type = await $layerTypeBtn.getText();

      if (type === layerType) {
        await $layerTypeBtn.click();

        return;
      }
    }

    throw new Error(`Нет кнопки ${layerType}`);
  }
}

export const addLayerDialogBlock = new AddLayerDialogBlock();
