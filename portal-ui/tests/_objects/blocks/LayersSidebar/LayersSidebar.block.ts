import { binding, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';
import { editFeature } from '../EditFeature/EditFeature.block';
import { editFeatureGeometryAsTextDialog } from '../EditFeatureGeometryAsTextDialog/EditFeatureGeometryAsTextDialog.block';
import { muiMenuList } from '../MuiMenuList/MuiMenuList.block';

@binding()
class LayersSidebar extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.LayersSidebar');
  }

  get $editLayersBtn(): Promise<WebdriverIO.Element> {
    return $('.LayersSidebar-EditBtn');
  }

  get $addLayerBtn(): Promise<WebdriverIO.Element> {
    return $('.LayersSidebar-AddLayerBtn');
  }

  get $layerBurger(): Promise<WebdriverIO.Element> {
    return $('.LayersSidebar .Layer-Burger');
  }

  get $layerCard(): Promise<WebdriverIO.Element> {
    return $('.LayersSidebar .Layer-Card');
  }

  @when(/^в левом сайдбаре на карте я нажимаю кнопку `Настроить слои проекта`$/)
  async clickEditButton(): Promise<void> {
    const $editLayersBtn = await this.$editLayersBtn;
    await $editLayersBtn.waitForDisplayed({ timeout: 6000 });

    await $editLayersBtn.click();
  }

  @when(/^в левом сайдбаре на карте я открываю меню первого слоя$/)
  async clickLayerBurger(): Promise<void> {
    const $layerCard = await this.$layerCard;
    await $layerCard.waitForDisplayed({ timeout: 9000 });
    await $layerCard.moveTo();

    const $layerBurger = await this.$layerBurger;
    await $layerBurger.waitForDisplayed();
    await $layerBurger.click();
  }

  @when(/^в левом сайдбаре на карте я нажимаю `Подключить слой`$/)
  async addLayerBtn(): Promise<void> {
    const $addLayerBtn = await this.$addLayerBtn;
    await $addLayerBtn.waitForDisplayed({ timeout: 1000 });

    await $addLayerBtn.click();
  }

  @when(/^в левом сайдбаре на карте я открываю `Свойства` слоя$/)
  async layerPropertiesOpen(): Promise<void> {
    await this.clickEditButton();
    await this.clickLayerBurger();
    await muiMenuList.testMenuSecItemText('Свойства');
    await muiMenuList.clickMenuSecondItem();
  }

  @when(/^в левом сайдбаре на карте я создаю новый объект в слое$/)
  async createNewObjectInLayer(): Promise<void> {
    await muiMenuList.testMenuThirdItemText('Добавить объект');
    await muiMenuList.clickMenuThirdItem();
    await editFeatureGeometryAsTextDialog.setObjectCoordinates();
    await editFeature.saveNewObject();
  }

  @when(/^в левом сайдбаре на карте в открывшемся меню я нажимаю на пункт `Открыть таблицу атрибутов`$/)
  async clickLayerAttributeTable(): Promise<void> {
    await muiMenuList.testMenuSecItemText('Открыть таблицу атрибутов');
    await muiMenuList.clickMenuSecondItem();
  }

  @when(/^в левом сайдбаре на карте я открыл диалог `Добавить слой`$/)
  async openAddLayerDialog(): Promise<void> {
    await layersSidebar.clickEditButton();
    await layersSidebar.addLayerBtn();
  }
}

export const layersSidebar = new LayersSidebar();
