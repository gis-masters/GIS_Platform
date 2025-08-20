import { Block } from '../../Block';

export class FeaturesListItemBlock extends Block {
  selectors = {
    container: '.FeaturesListItem',
    id: '.FeaturesListItem-Id',
    icon: '.FeaturesListItem-Icon',
    layer: '.FeaturesListItem-Layer',
    title: '.FeaturesListItem-Title',
    openEdit: '.FeaturesListItem-OpenEdit',
    zoom: '.ZoomToFeature'
  };

  async openEdit(): Promise<void> {
    const $openEdit = await this.$('openEdit');
    await $openEdit.waitForClickable();
    await $openEdit.click();
  }

  async zoomToFeature(): Promise<void> {
    const $zoomToFeature = await this.$('zoom');
    await $zoomToFeature.waitForClickable();
    await $zoomToFeature.click();
  }

  async openObject(): Promise<void> {
    const $title = await this.$('id');
    await $title.waitForClickable();
    await $title.doubleClick();
  }

  async selectObject(): Promise<void> {
    const $title = await this.$('id');
    await $title.waitForClickable();
    await $title.click();
  }

  async focusToObject(): Promise<void> {
    const $title = await this.$('id');
    await $title.waitForClickable();
    await $title.moveTo();
  }

  async getItemData(): Promise<string[]> {
    const $icon = await this.$('icon');
    await $icon.waitForDisplayed();

    const $id = await this.$('id');
    await $id.waitForDisplayed();

    const $layer = await this.$('layer');
    await $layer.waitForDisplayed();

    const $title = await this.$('title');
    await $title.waitForDisplayed();

    const id = await $id.getText();
    const layer = await $layer.getText();
    const title = await $title.getText();

    return [id, layer, title];
  }
}

export const featuresListItemBlock = new FeaturesListItemBlock();
