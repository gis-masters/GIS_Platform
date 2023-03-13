import { Block } from '../../Block';

class WorkspaceHeaderBlock extends Block {
  selectors = {
    container: '.WorkspaceHeader',
    organization: '.WorkspaceHeader-Organization'
  };

  async testOrganization(organization: string) {
    await expect(this.$('organization')).toHaveText(organization);
  }
}

export const workspaceHeaderBlock = new WorkspaceHeaderBlock();
