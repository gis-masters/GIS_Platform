import { Block } from '../../Block';
import { editFeatureBlock } from '../EditFeature/EditFeature.block';
import { muiMenuBlock, MuiMenuBlock } from '../MuiMenu/MuiMenu.block';
import { editFeatureGeometryAsTextDialogBlock } from '../EditFeatureGeometryAsTextDialog/EditFeatureGeometryAsTextDialog.block';
import { layerCardBlock } from '../Layer/Card/Layer-Card.block';

class LayersSidebarBlock extends Block {
  selectors = {
    container: '.LayersSidebar',
    layer: '.LayersSidebar .Layer',
    editLayersBtn: '.LayersSidebar-EditBtn',
    addLayerBtn: '.LayersSidebar-AddLayerBtn',
    layerBurger: '.LayersSidebar .Layer-Burger'
  };

  async clickEditButton(): Promise<void> {
    const $editLayersBtn = await this.$('editLayersBtn');
    await $editLayersBtn.waitForDisplayed({ timeout: 6000 });

    await $editLayersBtn.click();
  }

  async openMenu(layerTitle: string): Promise<void> {
    await this.waitForLayersSidebarDisplayed();
    await layerCardBlock.moveToLayerCard(layerTitle);
    const $layerCard = await layerCardBlock.getLayerCardByName(layerTitle);
    if (!$layerCard) {
      throw new Error(`Не найден элемент "${layerTitle}"`);
    }

    const $layerBurger = await $layerCard.$('.Layer-Burger');
    await $layerBurger.waitForDisplayed();
    await $layerBurger.click();
  }

  async openAttributeTable(layerTitle: string): Promise<void> {
    await this.openMenu(layerTitle);

    await muiMenuBlock.clickItemByTitle('Открыть таблицу атрибутов');
  }

  async selectLayersListElementMenuItem(layerTitle: string, menuItemTitle: string): Promise<void> {
    await this.openMenu(layerTitle);

    const muiSelect = new MuiMenuBlock();
    await muiSelect.clickItemByTitle(menuItemTitle);
  }

  async addLayerBtn(): Promise<void> {
    const $addLayerBtn = await this.$('addLayerBtn');
    await $addLayerBtn.waitForDisplayed({ timeout: 1000 });

    await $addLayerBtn.click();
  }

  async createNewObjectInLayer(): Promise<void> {
    await editFeatureGeometryAsTextDialogBlock.setObjectDummyCoordinates();
    await editFeatureBlock.clickSaveButton();
  }

  async clickAddLayerBtn(): Promise<void> {
    await layersSidebarBlock.clickEditButton();
    await layersSidebarBlock.addLayerBtn();
  }

  async waitForLayersSidebarDisplayed(): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();
  }
}

export const layersSidebarBlock = new LayersSidebarBlock();
