import { Block } from '../../Block';

class WorkspaceHeaderBlock extends Block {
  selectors = {
    root: '.WorkspaceHeader',
    printMap: '.WorkspaceHeader .PrintMapButton',
    organization: '.WorkspaceHeader-Organization',
    loader: '.WorkspaceHeader-Loader .MuiLinearProgress-root'
  };

  async testOrganization(organization: string) {
    const $organization = await this.findBySelector('organization');
    await expect(await $organization.getText()).toContain(organization);
  }

  async clickPrintMap(): Promise<void> {
    const $printMapBtn = await this.findBySelector('printMap');
    await $printMapBtn.waitForDisplayed();

    await $printMapBtn.click();
  }

  async waitForLoaderEnd(): Promise<void> {
    const loader = await this.findBySelector('loader');
    try {
      await loader.waitForDisplayed({ timeout: 1000 });
    } catch {
      // ignore
    }
    await loader.waitForExist({ reverse: true });
  }
}

export const workspaceHeaderBlock = new WorkspaceHeaderBlock();
