import { Block } from '../../classes/Block';

class WorkspaceHeaderBlock extends Block {
  selectors = {
    root: '.WorkspaceHeader',
    printMap: '.WorkspaceHeader .PrintMapButton',
    organization: '.WorkspaceHeader-Organization',
    breadcrumbItem: '.WorkspaceHeader-Breadcrumbs .Breadcrumbs-Item',
    loader: '.WorkspaceHeader-Loader .MuiLinearProgress-root'
  };

  async testOrganization(organization: string) {
    const $organization = await this.findBySelector('organization');
    expect(await $organization.getText()).toContain(organization);
  }

  async clickPrintMap(): Promise<void> {
    const $printMapBtn = await this.findBySelector('printMap');
    await $printMapBtn.waitForDisplayed();

    await $printMapBtn.click();
  }

  async currentProjectBreadcrumbs(): Promise<string[]> {
    await this.waitForLoading();

    const fullPath: string[] = [];

    const $$breadcrumbsItems = await this.findAllBySelector('breadcrumbItem');

    for (const $breadcrumb of $$breadcrumbsItems) {
      const breadcrumbText = await $breadcrumb.getText();

      fullPath.push(breadcrumbText);
    }

    return fullPath;
  }

  async clickBreadcrumbsItem(title: string): Promise<void> {
    await this.waitForLoading();

    const $$breadcrumbsItems = await this.findAllBySelector('breadcrumbItem');

    for (const $breadcrumb of $$breadcrumbsItems) {
      const breadcrumbText = await $breadcrumb.getText();

      if (breadcrumbText === title) {
        await $breadcrumb.waitForClickable();
        await $breadcrumb.click();

        return;
      }
    }
  }
}

export const workspaceHeaderBlock = new WorkspaceHeaderBlock();
