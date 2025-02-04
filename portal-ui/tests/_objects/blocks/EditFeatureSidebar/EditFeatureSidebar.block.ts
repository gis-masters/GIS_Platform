import { Block } from '../../Block';
import { CopyFeaturesButtonBlock } from '../CopyFeaturesButton/CopyFeaturesButton.block';

class EditFeatureSidebarBlock extends Block {
  selectors = {
    container: '.edit-features-sidebar',
    close: '.edit-features-sidebar .close-button'
  };

  copyFeaturesButton = new CopyFeaturesButtonBlock(this.selectors.container);

  async closeFeatureSidebar(): Promise<void> {
    const $closeBtn = await this.$('close');
    await $closeBtn.waitForClickable({ timeout: 2000 });
    await $closeBtn.click();
  }
}

export const editFeatureSidebarBlock = new EditFeatureSidebarBlock();
