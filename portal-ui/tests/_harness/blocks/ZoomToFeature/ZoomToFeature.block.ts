import { Block } from '../../classes/Block';

class ZoomToFeatureBlock extends Block {
  selectors = {
    root: '.ZoomToFeature'
  };

  async click(): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForClickable();
    await $root.click();
  }
}

export const zoomToFeatureBlock = new ZoomToFeatureBlock('.EditFeature');
