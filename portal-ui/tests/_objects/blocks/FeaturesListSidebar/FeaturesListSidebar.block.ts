import type { WdioCheckElementMethodOptions } from '@wdio/visual-service/dist/types';

import { Block } from '../../Block';
import { extractText } from '../../commands/extractText';
import { FeaturesListItemBlock } from '../FeaturesListItem/FeaturesListItem.block';

class FeaturesListSidebarBlock extends Block {
  selectors = {
    root: '.FeaturesListSidebar',
    closeIcon: '.FeaturesListSidebarFeatures-Close',
    item: '.FeaturesListSidebar .FeaturesListItem',
    title: '.FeaturesListSidebar .FeaturesListItem-Title'
  };

  async close() {
    const $closeIcon = await this.findBySelector('closeIcon');
    await $closeIcon.waitForClickable();
    await $closeIcon.click();
  }

  async openEdit(title: string) {
    const featuresListItemBlock = await this.getFeaturesListItemByTitle(title);
    await featuresListItemBlock.openEdit();
  }

  async openEditByLayer(layer: string) {
    const featuresListItemBlock = await this.getFeaturesListItemByLayer(layer);
    await featuresListItemBlock.openEdit();
  }

  async zoomToFeature(itemName: string) {
    const featuresListItemBlock = await this.getFeaturesListItemByTitle(itemName);
    await featuresListItemBlock.zoomToFeature();
  }

  async zoomToFeatureByLayer(itemName: string) {
    const featuresListItemBlock = await this.getFeaturesListItemByLayer(itemName);
    await featuresListItemBlock.zoomToFeature();
  }

  async openObject(itemName: string) {
    const featuresListItemBlock = await this.getFeaturesListItemByTitle(itemName);
    await featuresListItemBlock.openObject();
  }

  async selectObject(itemName: string) {
    const featuresListItemBlock = await this.getFeaturesListItemByTitle(itemName);
    await featuresListItemBlock.selectObject();
  }

  async focusToObject(itemName: string) {
    const featuresListItemBlock = await this.getFeaturesListItemByTitle(itemName);
    await featuresListItemBlock.focusToObject();
  }

  async getFeaturesNames(): Promise<string[]> {
    await this.waitForVisible();
    const $titles = await this.findAllBySelector('title');

    return await extractText($titles);
  }

  async listItemData(title: string[]): Promise<(string | undefined)[]> {
    const featuresListItemBlock = await this.getFeaturesListItemByTitle(title[1]);

    return await featuresListItemBlock.getItemData();
  }

  async openFirstFeature(): Promise<void> {
    await this.waitForVisible();

    const $$items = await this.findAllBySelector('item');

    if ($$items.length) {
      await $$items[0].waitForClickable();
      await $$items[0].doubleClick();
    }
  }

  async getFeaturesListItemByTitle(title: string): Promise<FeaturesListItemBlock> {
    await this.waitForVisible();

    const $$items = await this.findAllBySelector('item');

    for (const $item of $$items) {
      const itemTitle = await $item.$('.FeaturesListItem-Title').getText();

      if (itemTitle === title) {
        return new FeaturesListItemBlock($item);
      }
    }

    throw new Error(`Не найден элемент "${title}"`);
  }

  async getFeaturesListItemByLayer(layer: string): Promise<FeaturesListItemBlock> {
    await this.waitForVisible();

    const $$items = await this.findAllBySelector('item');

    for (const $item of $$items) {
      const itemLayer = await $item.$('.FeaturesListItem-Layer').getText();
      if (itemLayer === layer) {
        return new FeaturesListItemBlock($item);
      }
    }

    throw new Error(`Не найден элемент "${layer}"`);
  }

  async getFeaturesCount(): Promise<number> {
    await this.waitForVisible();
    const $$items = await this.findAllBySelector('item');

    return $$items.length;
  }

  async assertSelfie(tag?: string, checkElementOptions?: WdioCheckElementMethodOptions): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForDisplayed();

    await super.assertSelfie(tag, {
      hideElements: [...(checkElementOptions?.hideElements || [])],
      ...checkElementOptions
    });
  }
}

export const featuresListSidebarBlock = new FeaturesListSidebarBlock();
