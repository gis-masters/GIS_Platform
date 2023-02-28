import { Block } from '../../Block';

class WorkspaceHeader extends Block {
  selectors = {
    container: '.WorkspaceHeader',
    organization: '.WorkspaceHeader-Organization'
  };

  async testOrganization(organization: string) {
    await expect(this.$('organization')).toHaveText(organization);
  }
}

export const workspaceHeader = new WorkspaceHeader();
