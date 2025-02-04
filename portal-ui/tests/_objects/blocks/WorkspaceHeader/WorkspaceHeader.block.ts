import { Block } from '../../Block';

class WorkspaceHeaderBlock extends Block {
  selectors = {
    container: '.WorkspaceHeader',
    printMap: '.WorkspaceHeader .PrintMapButton',
    organization: '.WorkspaceHeader-Organization',
    loader: '.WorkspaceHeader-Loader .MuiLinearProgress-root'
  };

  async testOrganization(organization: string) {
    await expect(this.$('organization')).toHaveTextContaining(organization);
  }

  async clickPrintMap(): Promise<void> {
    const $printMapBtn = await this.$('printMap');
    await $printMapBtn.waitForDisplayed();

    await $printMapBtn.click();
  }

  async waitForLoaderEnd(): Promise<void> {
    const loader = await this.$('loader');
    try {
      await loader.waitForDisplayed({ timeout: 1000 });
    } catch {
      // ignore
    }
    await loader.waitForDisplayed({ reverse: true });
  }
}

export const workspaceHeaderBlock = new WorkspaceHeaderBlock();
