import { Block } from '../../Block';

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

  async currentProjectBreadcrumbs(): Promise<string[]> {
    await this.waitForLoaderEnd();

    const fullPath: string[] = [];

    const $$breadcrumbsItems = await this.findAllBySelector('breadcrumbItem');

    for (const $breadcrumb of $$breadcrumbsItems) {
      const breadcrumbText = await $breadcrumb.getText();

      fullPath.push(breadcrumbText);
    }

    return fullPath;
  }

  async clickBreadcrumbsItem(title: string): Promise<void> {
    await this.waitForLoaderEnd();

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
