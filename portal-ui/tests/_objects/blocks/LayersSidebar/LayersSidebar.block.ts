import { Block } from '../../Block';
import { editFeatureBlock } from '../EditFeature/EditFeature.block';
import { muiMenuBlock, MuiMenuBlock } from '../MuiMenu/MuiMenu.block';
import { editFeatureGeometryAsTextDialogBlock } from '../EditFeatureGeometryAsTextDialog/EditFeatureGeometryAsTextDialog.block';

class LayersSidebarBlock extends Block {
  selectors = {
    container: '.LayersSidebar',
    layer: '.LayersSidebar .Layer',
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

  async openMenu(): Promise<void> {
    const $layerCard = await this.$('layerCard');
    await $layerCard.waitForDisplayed({ timeout: 9000 });
    await $layerCard.moveTo();
    const $layerBurger = await this.$('layerBurger');
    await $layerBurger.waitForDisplayed();
    await $layerBurger.click();
  }

  async openAttributeTable(): Promise<void> {
    await this.openMenu();

    await muiMenuBlock.clickItemByTitle('Открыть таблицу атрибутов');
  }

  async selectLayersListElementMenuItem(layerName: string, menuItemTitle: string): Promise<void> {
    const $layer = await this.getLayerByName(layerName);
    if (!$layer) {
      throw new Error(`Не найден элемент "${layerName}"`);
    }

    await $layer.moveTo();

    const $layerBurger = await this.$('layerBurger');
    await $layerBurger.waitForDisplayed();
    await $layerBurger.click();

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
    await editFeatureBlock.saveNewObject();
  }

  async clickAddLayerBtn(): Promise<void> {
    await layersSidebarBlock.clickEditButton();
    await layersSidebarBlock.addLayerBtn();
  }

  async checkIsVisible(layerName: string): Promise<boolean> {
    const $layer = await this.getLayerByName(layerName);

    if (!$layer) {
      throw new Error(`Не найден элемент "${layerName}"`);
    }

    const cls = await $layer.getAttribute('class');

    return !!cls.split(' ').includes('Layer_visible');
  }

  async clickVisibilityBtn(layerName: string): Promise<void> {
    await this.clickLayerCardBtn(layerName, '.Layer-Eye');
  }

  async clickOpenBtn(layerName: string): Promise<void> {
    await this.clickLayerCardBtn(layerName, '.Layer-Open');
  }

  async clickLayerCardBtn(layerName: string, btnSelectorName: string): Promise<void> {
    const $layer = await this.getLayerByName(layerName);

    if (!$layer) {
      throw new Error(`Не найден элемент "${layerName}"`);
    }

    await $layer.waitForDisplayed();
    await $layer.moveTo();

    const $btn = await $layer.$(btnSelectorName);
    await $btn.waitForDisplayed();
    await $btn.click();
  }

  async getVisibleLayersCardsText(): Promise<string> {
    const $$layersCards = await this.getVisibleLayersCards();
    if (!$$layersCards) {
      throw new Error('Не найден элемент layerCard');
    }

    return $$layersCards[0].getText();
  }

  async getLayerByName(layerName: string): Promise<WebdriverIO.Element | undefined> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    const $$layers = await this.$$('layer');

    for (const $layer of $$layers) {
      const currentLayerName = await $layer.getText();

      if (currentLayerName === layerName) {
        return $layer;
      }
    }
  }

  async getLayersCardsNames(): Promise<string[]> {
    const $$layerCard = await this.$$('layerCard');
    const names: string[] = [];

    for (const $layerCard of $$layerCard) {
      const name = await $layerCard.getText();
      names.push(name);
    }

    return names;
  }

  private async getVisibleLayersCards(): Promise<WebdriverIO.Element[]> {
    return await this.$$('layerCard');
  }
}

export const layersSidebarBlock = new LayersSidebarBlock();
