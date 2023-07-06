import { Block } from '../../Block';

class WorkspaceHeaderBlock extends Block {
  selectors = {
    container: '.WorkspaceHeader',
    organization: '.WorkspaceHeader-Organization',
    loader: '.WorkspaceHeader-Loader .MuiLinearProgress-root'
  };

  async testOrganization(organization: string) {
    await expect(this.$('organization')).toHaveTextContaining(organization);
  }

  async waitForLoaderEnd(): Promise<void> {
    const loader = await this.$('loader');
    await loader.waitForDisplayed({ reverse: true });
  }
}

export const workspaceHeaderBlock = new WorkspaceHeaderBlock();
