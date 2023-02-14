import { binding, then, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';

@binding()
class AddLayerDialog extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.AddLayerDialog');
  }

  get $addLayerDialogViewField(): Promise<WebdriverIO.Element> {
    return $('.AddLayerDialog .Form-Content .Form-Field:last-child label');
  }

  get $layerFormDialogSelectDatasource(): Promise<WebdriverIO.Element> {
    return $('.AddLayerDialog .SelectVectorTable');
  }

  @then(/^в диалоговом окне `Добавить слой` появляется поле `Представление`$/)
  async checkViewFieldIsAppear(): Promise<void> {
    const $addLayerDialogViewField = await this.$addLayerDialogViewField;
    await $addLayerDialogViewField.waitForDisplayed();

    const vectorTableTitle = await $addLayerDialogViewField.getText();
    expect(vectorTableTitle).toEqual('Представление');
  }

  @when(/^в диалоговом окне `Добавить слой` не появляется поле `Представление`$/)
  async checkViewFieldIsNotAppear(): Promise<void> {
    await expect(this.$addLayerDialogViewField).not.toBeDisplayed();
  }

  @when(/^в диалоге `Добавить слой` я нажимаю на кнопку `Не выбрано` у поля источник данных$/)
  async selectDatasource(): Promise<void> {
    const $layerDialogSelectDatasource = await this.$layerFormDialogSelectDatasource;
    await $layerDialogSelectDatasource.waitForDisplayed({ timeout: 3000 });

    await $layerDialogSelectDatasource.click();
  }
}

export const addLayerDialog = new AddLayerDialog();
