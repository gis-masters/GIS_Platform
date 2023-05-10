import { Block } from '../../Block';

export class FeaturesListItemBlock extends Block {
  selectors = {
    container: '.FeaturesListItem',
    id: '.FeaturesListItem-Id',
    icon: '.FeaturesListItem-Icon',
    layer: '.FeaturesListItem-Layer',
    openEdit: '.FeaturesListItem-OpenEdit',
    zoom: '.ZoomToFeature'
  };

  async openEdit(): Promise<void> {
    const $openEdit = await this.$('openEdit');
    await $openEdit.click();
  }

  async zoomToFeature(): Promise<void> {
    const $zoomToFeature = await this.$('zoom');
    await $zoomToFeature.click();
  }

  async openObject(): Promise<void> {
    const $title = await this.$('id');
    await $title.doubleClick();
  }

  async selectObject(): Promise<void> {
    const $title = await this.$('id');
    await $title.click();
  }

  async getItemData(): Promise<(string | undefined)[]> {
    const $icon = await this.$('icon');
    await $icon.waitForDisplayed();

    const $id = await this.$('id');
    const $layer = await this.$('layer');

    const id = await $id.getText();
    const layer = await $layer.getText();

    return [id, layer];
  }
}
