import { Block } from '../../Block';

export class Explorer extends Block {
  selectors = {
    container: '.Explorer',
    firstItem: '.Explorer-List > .MuiListItemButton-root:first-child',
    secondItem: '.Explorer-List > .MuiListItemButton-root:nth-child(2)',
    infoTitle: '.Explorer-InfoTitle',
    filter: '.Explorer-Filter input',
    sort: '.Explorer-Sort input',
    sortDir: '.Explorer-Sort button',
    pageSize: '.Explorer-PageSize input',
    registryButton: '.Explorer-ToolbarActions .RegistryButton'
  };

  async waitForVisible(): Promise<void> {
    const $container = await this.getElement('container');

    await $container.waitForDisplayed({ timeout: 2000, timeoutMsg: 'Не появляется Explorer' });
  }

  async assertSelfie(state: string = 'plain'): Promise<void> {
    const { container } = this.selectors;

    return await this.browser.assertView(state, container);
  }

  async openFirstItem(): Promise<void> {
    const $explorerItem = await this.getElement('firstItem');
    await $explorerItem.doubleClick();
    await this.browser.pause(1200); // animation
  }

  async selectFirstItem(): Promise<void> {
    const $explorerItem = await this.getElement('firstItem');
    await $explorerItem.click();
    await this.browser.pause(300); // animation
  }

  async getTitle(): Promise<string> {
    const $explorerTitle = await this.getElement('infoTitle');
    return await $explorerTitle.getText();
  }

  async getFilterValue(): Promise<string> {
    const $explorerFilter = await this.getElement('filter');
    return await $explorerFilter.getValue();
  }

  async getSortValue(): Promise<string> {
    const $explorerSort = await this.getElement('sort');
    return await $explorerSort.getValue();
  }

  async getSortDirValue(): Promise<string> {
    const $explorerSortDir = await this.getElement('sortDir');
    return await $explorerSortDir.getAttribute('aria-label');
  }

  async getPageSizeValue(): Promise<string> {
    const $explorerPageSize = await this.getElement('pageSize');
    return await $explorerPageSize.getValue();
  }

  async selectSecondItem(): Promise<void> {
    const $explorerItem = await this.getElement('secondItem');
    await $explorerItem.click();
    await this.browser.pause(300); // animation
  }

  async openRegistry() {
    const $registryButton = await this.getElement('registryButton');

    return await $registryButton.click();
  }
}
