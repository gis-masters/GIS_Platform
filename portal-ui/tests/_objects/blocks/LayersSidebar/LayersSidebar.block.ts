import { type WdioCheckElementMethodOptions } from '@wdio/visual-service/dist/types';

import { Block } from '../../Block';
import { changeLayerParent } from '../../commands/layers/changeLayerParent';
import { editFeatureGeometryAsTextDialogBlock } from '../EditFeatureGeometryAsTextDialog/EditFeatureGeometryAsTextDialog.block';
import { layerCardBlock } from '../Layer/Card/Layer-Card.block';
import { MuiMenuBlock, muiMenuBlock } from '../MuiMenu/MuiMenu.block';

class LayersSidebarBlock extends Block {
  selectors = {
    root: '.LayersSidebar',
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
    const $filterBtn = await this.findBySelector('filterBtn');
    await $filterBtn.waitForDisplayed();
    await $filterBtn.click();
    await $filterBtn.waitForExist({ reverse: true });
  }

  async clickEditButton(): Promise<void> {
    const $editLayersBtn = await this.findBySelector('editLayersBtn');
    await $editLayersBtn.waitForDisplayed();

    await $editLayersBtn.click();
  }

  async clickSaveButton(): Promise<void> {
    const $editLayersBtn = await this.findBySelector('saveBtn');
    await $editLayersBtn.click();
  }

  async clickCancelButton(): Promise<void> {
    const $editLayersBtn = await this.findBySelector('cancelBtn');
    await $editLayersBtn.click();
  }

  async waitForLoadingHide(): Promise<void> {
    const $loading = await this.findBySelector('loading');
    await $loading.waitForExist({ reverse: true });
  }

  async openMenu(layerTitle: string): Promise<void> {
    await this.waitForLayersSidebarDisplayed();
    await layerCardBlock.moveToLayerCard(layerTitle);
    const $layerCard = await layerCardBlock.getLayerCardByName(layerTitle);
    if (!$layerCard) {
      throw new Error(`Не найден элемент "${layerTitle}"`);
    }

    const $layerBurger = await $layerCard.$('.Layer-Burger').getElement();
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
    const $addLayerBtn = await this.findBySelector('addLayerBtn');
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
    const $root = await this.findBySelector('root');
    await $root.waitForDisplayed();
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
    const $root = await this.findBySelector('root');
    await $root.waitForDisplayed();

    await super.assertSelfie(tag, {
      hideElements: [await this.findBySelector('toolbar'), ...(checkElementOptions?.hideElements || [])],
      ...checkElementOptions
    });
  }

  async assertSelfieFull(tag?: string, checkElementOptions?: WdioCheckElementMethodOptions): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForDisplayed();

    await super.assertSelfie(tag, {
      hideElements: [...(checkElementOptions?.hideElements || [])],
      ...checkElementOptions
    });
  }
}

export const layersSidebarBlock = new LayersSidebarBlock();
