import { Block } from '../../Block';

class AddLayerDialogBlock extends Block {
  selectors = {
    container: '.AddLayerDialog',
    addLayerDialogViewField: '.AddLayerDialog .Form-Content .Form-Field:last-child label',
    layerFormDialogSelectDatasource: '.AddLayerDialog .SelectVectorTableControl',
    layerFormDialogSelectLibraryRecord: '.AddLayerDialog .SelectFileInLibraryRecordControl',
    layerTypesControl: '.AddLayerDialog .Form-Control',
    addLayerBtn: '.AddLayerDialog .MuiButton-outlinedPrimary',
    addLayerBtnLoading: '.AddLayerDialog .MuiButton-outlinedPrimary.MuiLoadingButton-root'
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

  async selectLibraryRecord(): Promise<void> {
    const $layerDialogSelectDatasource = await this.$('layerFormDialogSelectLibraryRecord');
    await $layerDialogSelectDatasource.waitForDisplayed();

    await $layerDialogSelectDatasource.click();
  }

  async clickAddLayerBtn(): Promise<void> {
    const $addLayerBtn = await this.$('addLayerBtn');
    await $addLayerBtn.waitForDisplayed();

    await $addLayerBtn.click();
  }

  async waitForLoadingDisappear() {
    const $loading = await this.$('addLayerBtnLoading');
    await $loading.waitForDisplayed({ timeout: 10_000, reverse: true });
  }

  async waitForDialogDisappear() {
    const $container = await this.$('container');
    await $container.waitForDisplayed({ reverse: true });
  }

  async waitForDialogExist() {
    const $container = await this.$('container');
    await $container.waitForDisplayed();
  }

  async selectLayerType(layerType: string): Promise<void> {
    const $container = await this.$('container');
    const $$formFields = await $container.$$('.Form-Field');
    for (const $formField of $$formFields) {
      const field = await $formField.$('.Form-Label').getText();

      if (field === 'Тип слоя') {
        const $$layerTypeBtns = await $formField.$$('.MuiButtonBase-root');
        for (const $layerTypeBtn of $$layerTypeBtns) {
          const type = await $layerTypeBtn.getText();

          if (type === layerType) {
            await $layerTypeBtn.click();
          }
        }
      }
    }
  }
}

export const addLayerDialogBlock = new AddLayerDialogBlock();
