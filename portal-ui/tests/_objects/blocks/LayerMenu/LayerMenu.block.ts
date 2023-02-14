import { binding, then, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';
import { MuiSelect } from '../MuiSelect/MuiSelect.block';

@binding()
class LayerMenu extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.LayerMenu-LayerProperties');
  }

  get $layerPropertyFormDialogViewSelect(): Promise<WebdriverIO.Element> {
    return $('.LayerMenu-LayerProperties .Form-Field:first-child .MuiSelect-select');
  }

  get $formDialogLayerPropertySaveBtn(): Promise<WebdriverIO.Element> {
    return $('.LayerMenu-LayerProperties .MuiButton-outlinedPrimary');
  }

  @then(/^в диалоговом окне `Свойства слоя` у поля `Представление` выбрано "(.*)"$/)
  async viewFieldFirstValue(viewTitle: string): Promise<void> {
    const $layerPropertyFormDialogViewSelect = await this.$layerPropertyFormDialogViewSelect;
    await $layerPropertyFormDialogViewSelect.waitForClickable();

    const view = await $layerPropertyFormDialogViewSelect.getText();

    expect(view).toEqual(viewTitle);
  }

  @when(/^в диалоговом окне `Свойства слоя` в поле `Представление` выбираю `Представление 2`$/)
  async layerPropertyDialogSelectViewThirdOption(): Promise<void> {
    const muiSelect = new MuiSelect('.LayerMenu-LayerProperties');
    await muiSelect.selectOption(3);
  }

  @when(/^в диалоговом окне `Свойства слоя` нажимаю `Изменить`$/)
  async saveLayerProperty(): Promise<void> {
    const $layerPropertySaveBtn = await this.$formDialogLayerPropertySaveBtn;
    await $layerPropertySaveBtn.waitForClickable({ timeout: 1000 });
    await $layerPropertySaveBtn.click();
  }
}

export const layerMenu = new LayerMenu();
