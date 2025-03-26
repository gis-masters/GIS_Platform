import { WdioCheckElementMethodOptions } from 'wdio-image-comparison-service';

import { Block } from '../../Block';
import { extractText } from '../../commands/extractText';
import { FeaturesListItemBlock } from '../FeaturesListItem/FeaturesListItem.block';

class FeaturesListSidebarBlock extends Block {
  selectors = {
    container: '.FeaturesListSidebar',
    closeIcon: '.FeaturesListSidebarFeatures-Close',
    item: '.FeaturesListSidebar .FeaturesListItem',
    title: '.FeaturesListSidebar .FeaturesListItem-Title'
  };

  async close() {
    const $closeIcon = await this.$('closeIcon');
    await $closeIcon.waitForClickable();
    await $closeIcon.click();
  }

  async openEdit(title: string) {
    const featuresListItemBlock = await this.getFeaturesListItemByTitle(title);
    await featuresListItemBlock.openEdit();
  }

  async zoomToFeature(itemName: string) {
    const featuresListItemBlock = await this.getFeaturesListItemByTitle(itemName);
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
    const $titles = await this.$$('title');

    return await extractText($titles);
  }

  async listItemData(title: string[]): Promise<(string | undefined)[]> {
    const featuresListItemBlock = await this.getFeaturesListItemByTitle(title[1]);

    return await featuresListItemBlock.getItemData();
  }

  async openFirstFeature(): Promise<void> {
    await this.waitForVisible();

    const $$items = await this.$$('item');

    if ($$items.length) {
      await $$items[0].waitForClickable();
      await $$items[0].doubleClick();
    }
  }

  async getFeaturesListItemByTitle(title: string): Promise<FeaturesListItemBlock> {
    await this.waitForVisible();

    const $$items = await this.$$('item');

    for (const $item of $$items) {
      const itemTitle = await $item.$('.FeaturesListItem-Title').getText();

      if (itemTitle === title) {
        return new FeaturesListItemBlock($item);
      }
    }

    throw new Error(`Не найден элемент "${title}"`);
  }

  async getFeaturesCount(): Promise<number> {
    await this.waitForVisible();
    const $$items = await this.$$('item');

    return $$items.length;
  }

  async assertSelfie(tag?: string, checkElementOptions?: WdioCheckElementMethodOptions): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    await super.assertSelfie(tag, {
      hideElements: [...(checkElementOptions?.hideElements || [])],
      ...checkElementOptions
    });
  }
}

export const featuresListSidebarBlock = new FeaturesListSidebarBlock();
