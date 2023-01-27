import { binding, then } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';

@binding()
class WorkspaceHeader extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.WorkspaceHeader');
  }

  get $organization(): Promise<WebdriverIO.Element> {
    return $('.WorkspaceHeader-Organization');
  }

  @then(/^в хедере страницы название организации — "(.*)"$/)
  async testOrganization(organization: string) {
    await expect(this.$organization).toHaveText(organization);
  }
}

export const workspaceHeader = new WorkspaceHeader();
