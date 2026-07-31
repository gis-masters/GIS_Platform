import { Block } from '../../classes/Block';
import { doubleClick } from '../../commands/doubleClick';

export class FeaturesListItemBlock extends Block {
  selectors = {
    root: '.FeaturesListItem',
    id: '.FeaturesListItem-Id',
    icon: '.FeaturesListItem-Icon',
    layer: '.FeaturesListItem-Layer',
    title: '.FeaturesListItem-Title',
    openEdit: '.FeaturesListItem-OpenEdit',
    zoom: '.ZoomToFeature'
  };

  async openEdit(): Promise<void> {
    const $openEdit = await this.findBySelector('openEdit');
    await $openEdit.waitForClickable();
    await $openEdit.click();
  }

  async zoomToFeature(): Promise<void> {
    const $zoomToFeature = await this.findBySelector('zoom');
    await $zoomToFeature.waitForClickable();
    await $zoomToFeature.click();
  }

  async openObject(): Promise<void> {
    const $id = await this.findBySelector('id');
    await $id.waitForClickable();
    await doubleClick($id);
  }

  async selectObject(): Promise<void> {
    const $id = await this.findBySelector('id');
    await $id.waitForClickable();
    await $id.click();
  }

  async focusToObject(): Promise<void> {
    const $id = await this.findBySelector('id');
    await $id.waitForClickable();
    await $id.moveTo();
  }

  async getItemData(): Promise<string[]> {
    const $icon = await this.findBySelector('icon');
    await $icon.waitForDisplayed();

    const $id = await this.findBySelector('id');
    await $id.waitForDisplayed();

    const $layer = await this.findBySelector('layer');
    await $layer.waitForDisplayed();

    const $title = await this.findBySelector('title');
    await $title.waitForDisplayed();

    const id = await $id.getText();
    const layer = await $layer.getText();
    const title = await $title.getText();

    return [id, layer, title];
  }
}

export const featuresListItemBlock = new FeaturesListItemBlock();
