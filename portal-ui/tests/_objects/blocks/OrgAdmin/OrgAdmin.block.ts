import { Block } from '../../Block';

class OrgAdminBlock extends Block {
  selectors = {
    container: '.OrgAdmin',
    loading: '.OrgAdmin .Loading'
  };

  async waitForLoadingDisappear() {
    await this.waitForVisible();

    const $loading = await this.$('loading');

    try {
      await $loading.waitForDisplayed({ timeout: 1000 });
    } catch {
      // ignore
    }

    await $loading.waitForDisplayed({ reverse: true });
  }
}

export const orgAdminBlock = new OrgAdminBlock();
