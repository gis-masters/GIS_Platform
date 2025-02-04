import { Block } from '../../Block';

export class LibraryRegistry extends Block {
  selectors = {
    container: '.LibraryRegistry',
    titleFilter: '.MuiTableHead-root .XTable-HeadCell_filterType_string:first-child input',
    titleSort: '.MuiTableHead-root .XTable-HeadCell_filterType_string:first-child .MuiTableSortLabel-root svg',
    titleHeader: '.MuiTableHead-root .XTable-HeadCell_filterType_string:first-child'
  };

  async waitForVisible(): Promise<void> {
    const $container = await this.getElement('container');

    await $container.waitForDisplayed({ timeout: 2000, timeoutMsg: 'Не появляется LibraryRegistry' });
  }

  async assertTitleHeader(state: string = 'plain'): Promise<void> {
    const { titleHeader } = this.selectors;

    return await this.browser.assertView(state, titleHeader);
  }

  async setTitleValue(): Promise<void> {
    const $titleFilter = await this.getElement('titleFilter');

    await $titleFilter.setValue('123');
  }

  async changeSort(): Promise<void> {
    const $titleSort = await this.getElement('titleSort');

    await $titleSort.click();
  }
}
