import { Block } from '../../Block';
import { editFeatureGeometryAsTextDialogBlock } from '../EditFeatureGeometryAsTextDialog/EditFeatureGeometryAsTextDialog.block';
import { muiMenuListBlock } from '../MuiMenuList/MuiMenuList.block';
import { editFeatureBlock } from '../EditFeature/EditFeature.block';

class LayersSidebarBlock extends Block {
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
    await muiMenuListBlock.testMenuSecItemText('Свойства');
    await muiMenuListBlock.clickMenuSecondItem();
  }

  async createNewObjectInLayer(): Promise<void> {
    await muiMenuListBlock.testMenuThirdItemText('Добавить объект');
    await muiMenuListBlock.clickMenuThirdItem();
    await editFeatureGeometryAsTextDialogBlock.setObjectDummyCoordinates();
    await editFeatureBlock.saveNewObject();
  }

  async clickLayerAttributeTable(): Promise<void> {
    await muiMenuListBlock.testMenuSecItemText('Открыть таблицу атрибутов');
    await muiMenuListBlock.clickMenuSecondItem();
  }

  async openAddLayerDialog(): Promise<void> {
    await layersSidebarBlock.clickEditButton();
    await layersSidebarBlock.addLayerBtn();
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

export const layersSidebarBlock = new LayersSidebarBlock();
