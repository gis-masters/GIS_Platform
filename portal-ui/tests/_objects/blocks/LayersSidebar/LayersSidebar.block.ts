import { WdioCheckElementMethodOptions } from 'wdio-image-comparison-service';

import { Block } from '../../Block';
import { changeLayerParent } from '../../commands/layers/changeLayerParent';
import { editFeatureGeometryAsTextDialogBlock } from '../EditFeatureGeometryAsTextDialog/EditFeatureGeometryAsTextDialog.block';
import { layerCardBlock } from '../Layer/Card/Layer-Card.block';
import { MuiMenuBlock, muiMenuBlock } from '../MuiMenu/MuiMenu.block';

class LayersSidebarBlock extends Block {
  selectors = {
    container: '.LayersSidebar',
    layer: '.LayersSidebar .Layer',
    editLayersBtn: '.LayersSidebar-EditBtn',
    saveBtn: '.LayersSidebar-SaveBtn',
    cancelBtn: '.LayersSidebar-CancelBtn',
    loading: '.LayersSidebar .Loading',
    toolbar: '.LayersSidebar-Toolbar',
    addLayerBtn: '.LayersSidebar-AddLayerBtn',
    filterBtn: '.LayersSidebar-FilterBtn',
    layerBurger: '.LayersSidebar .Layer-Burger'
  };

  async clickFilterButton(): Promise<void> {
    const $filterBtn = await this.$('filterBtn');
    await $filterBtn.waitForDisplayed({ timeout: 6000 });

    await $filterBtn.click();
    await $filterBtn.waitForDisplayed({ reverse: true });
  }

  async clickEditButton(): Promise<void> {
    const $editLayersBtn = await this.$('editLayersBtn');
    await $editLayersBtn.waitForDisplayed({ timeout: 6000 });

    await $editLayersBtn.click();
  }

  async clickSaveButton(): Promise<void> {
    const $editLayersBtn = await this.$('saveBtn');
    await $editLayersBtn.click();
  }

  async clickCancelButton(): Promise<void> {
    const $editLayersBtn = await this.$('cancelBtn');
    await $editLayersBtn.click();
  }

  async waitForLoadingHide(): Promise<void> {
    const $loading = await this.$('loading');
    await $loading.waitForDisplayed({ reverse: true });
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
    await this.waitForVisible();
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

  async createNewObjectInLayer(coord: string[][]): Promise<void> {
    await editFeatureGeometryAsTextDialogBlock.setObjectDummyCoordinates(coord);
  }

  async clickAddLayerBtn(): Promise<void> {
    await layersSidebarBlock.clickEditButton();
    await layersSidebarBlock.addLayerBtn();
  }

  async waitForLayersSidebarDisplayed(): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();
  }

  async moveLayerToGroup(layerTitle: string, groupTitle: string): Promise<void> {
    const $layerCard = await layerCardBlock.getLayerCardByName(layerTitle);
    if (!$layerCard) {
      throw new Error(`Не найден элемент "${layerTitle}"`);
    }

    const $groupCard = await layerCardBlock.getLayerCardByName(groupTitle);
    if (!$groupCard) {
      throw new Error(`Не найден элемент "${groupTitle}"`);
    }

    await changeLayerParent(layerTitle, groupTitle);
  }

  async assertSelfie(tag?: string, checkElementOptions?: WdioCheckElementMethodOptions): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    await super.assertSelfie(tag, {
      hideElements: [await this.$('toolbar'), ...(checkElementOptions?.hideElements || [])],
      ...checkElementOptions
    });
  }

  async assertSelfieFull(tag?: string, checkElementOptions?: WdioCheckElementMethodOptions): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    await super.assertSelfie(tag, {
      hideElements: [...(checkElementOptions?.hideElements || [])],
      ...checkElementOptions
    });
  }
}

export const layersSidebarBlock = new LayersSidebarBlock();
