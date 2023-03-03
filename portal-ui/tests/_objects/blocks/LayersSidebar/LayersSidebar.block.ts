import { Block } from '../../Block';
import { editFeature } from '../EditFeature/EditFeature.block';
import { editFeatureGeometryAsTextDialog } from '../EditFeatureGeometryAsTextDialog/EditFeatureGeometryAsTextDialog.block';
import { muiMenuList } from '../MuiMenuList/MuiMenuList.block';

class LayersSidebar extends Block {
  selectors = {
    container: '.LayersSidebar',
    editLayersBtn: '.LayersSidebar-EditBtn',
    addLayerBtn: '.LayersSidebar-AddLayerBtn',
    layerBurger: '.LayersSidebar .Layer-Burger',
    layerCard: '.LayersSidebar .Layer-Card'
  };

  async clickEditButton(): Promise<void> {
    const $editLayersBtn = await this.$('editLayersBtn');
    await $editLayersBtn.waitForDisplayed({ timeout: 6000 });

    await $editLayersBtn.click();
  }

  async clickLayerBurger(): Promise<void> {
    const $layerCard = await this.$('layerCard');
    await $layerCard.waitForDisplayed({ timeout: 9000 });
    await $layerCard.moveTo();

    const $layerBurger = await this.$('layerBurger');
    await $layerBurger.waitForDisplayed();
    await $layerBurger.click();
  }

  async addLayerBtn(): Promise<void> {
    const $addLayerBtn = await this.$('addLayerBtn');
    await $addLayerBtn.waitForDisplayed({ timeout: 1000 });

    await $addLayerBtn.click();
  }

  async layerPropertiesOpen(): Promise<void> {
    await this.clickEditButton();
    await this.clickLayerBurger();
    await muiMenuList.testMenuSecItemText('Свойства');
    await muiMenuList.clickMenuSecondItem();
  }

  async createNewObjectInLayer(): Promise<void> {
    await muiMenuList.testMenuThirdItemText('Добавить объект');
    await muiMenuList.clickMenuThirdItem();
    await editFeatureGeometryAsTextDialog.setObjectDummyCoordinates();
    await editFeature.saveNewObject();
  }

  async clickLayerAttributeTable(): Promise<void> {
    await muiMenuList.testMenuSecItemText('Открыть таблицу атрибутов');
    await muiMenuList.clickMenuSecondItem();
  }

  async openAddLayerDialog(): Promise<void> {
    await layersSidebar.clickEditButton();
    await layersSidebar.addLayerBtn();
  }

  async clickVisibilityBtn(layerName: string): Promise<void> {
    const $layerCard = await this.getLayerByName(layerName);

    if ($layerCard) {
      await $layerCard.waitForDisplayed();
      await $layerCard.moveTo();

      const $firstCardEyeBtn = await $layerCard.$('.Layer-Eye');
      await $firstCardEyeBtn.waitForDisplayed();
      await $firstCardEyeBtn.click();
    }
  }

  async getLayerByName(layerName: string): Promise<WebdriverIO.Element | undefined> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    const $$layerCard = await this.$$('layerCard');

    for (const $layerCard of $$layerCard) {
      const layerCardName = await $layerCard.getText();

      if (layerCardName === layerName) {
        return $layerCard;
      }
    }
  }
}

export const layersSidebar = new LayersSidebar();
