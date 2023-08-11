import { Block } from '../../Block';

class OrgAdminBlock extends Block {
  selectors = {
    container: '.OrgAdmin',
    loading: '.OrgAdmin .Loading'
  };

  async waitForLoadingDisappear() {
    const $loading = await this.$('loading');
    await $loading.waitForDisplayed({ reverse: true });
  }
}

export const orgAdminBlock = new OrgAdminBlock();
