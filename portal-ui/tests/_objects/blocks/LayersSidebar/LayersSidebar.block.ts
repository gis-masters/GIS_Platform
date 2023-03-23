import { Block } from '../../Block';
import { editFeatureBlock } from '../EditFeature/EditFeature.block';
import { editFeatureGeometryAsTextDialogBlock } from '../EditFeatureGeometryAsTextDialog/EditFeatureGeometryAsTextDialog.block';
import { MuiMenuBlock } from '../MuiMenu/MuiMenu.block';
import { muiMenuListBlock } from '../MuiMenuList/MuiMenuList.block';

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

  async clickLayerAttributeTable(): Promise<void> {
    await muiMenuListBlock.testMenuSecItemText('Открыть таблицу атрибутов');
    await muiMenuListBlock.clickMenuSecondItem();
  }

  async selectLayersListElementMenuItem(layerName: string, menuItemTitle: string): Promise<void> {
    const $layerCard = await this.getLayerByName(layerName);
    if (!$layerCard) {
      throw new Error(`Не найден элемент "${layerName}"`);
    }

    await $layerCard.moveTo();

    const $layerBurger = await this.$('layerBurger');
    await $layerBurger.waitForDisplayed();
    await $layerBurger.click();

    const muiSelect = new MuiMenuBlock();
    await muiSelect.selectOptionByTitle(menuItemTitle);
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

  async clickVisibilityBtn(layerName: string): Promise<void> {
    await this.clickLayerCardBtn(layerName, '.Layer-Eye');
  }

  async clickOpenBtn(layerName: string): Promise<void> {
    await this.clickLayerCardBtn(layerName, '.Layer-Open');
  }

  async clickLayerCardBtn(layerName: string, btnSelectorName: string): Promise<void> {
    const $layerCard = await this.getLayerByName(layerName);

    if (!$layerCard) {
      throw new Error(`Не найден элемент "${layerName}"`);
    }

    await $layerCard.waitForDisplayed();
    await $layerCard.moveTo();

    const $btn = await $layerCard.$(btnSelectorName);
    await $btn.waitForDisplayed();
    await $btn.click();
  }

  private async getVisibleLayersCards(): Promise<WebdriverIO.Element[]> {
    return await this.$$('layerCard');
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

    const $$layerCard = await this.$$('layerCard');

    for (const $layerCard of $$layerCard) {
      const layerCardName = await $layerCard.getText();

      if (layerCardName === layerName) {
        return $layerCard;
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
}

export const layersSidebarBlock = new LayersSidebarBlock();
