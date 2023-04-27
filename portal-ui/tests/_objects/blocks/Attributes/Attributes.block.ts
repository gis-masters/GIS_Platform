import { Block } from '../../Block';
import { XTableBlock } from '../XTable/XTable.block';

class AttributesBlock extends Block {
  selectors = {
    container: '.Attributes',
    bar: '.Attributes-Bar',
    loading: '.Attributes .Loading',
    attributeTableCols: '.Attributes-Table .XTable-Head .XTable-CellContent',
    barTitle: '.Attributes-BarTitle',
    barMinimize: '.Attributes-BarMinimize',
    attributesTabs: '.Attributes-Tabs',
    filtersEnabler: '.Attributes-FiltersEnabler',
    pagination: '.Attributes-Pagination',
    attributesTab: '.Attributes-Tabs .Attributes-Tab',
    attributesTableHead: '.Attributes-Table .XTable-Head',
    attributesTableHeadCellContent: '.Attributes-Table .XTable-Head .XTable-CellContent',
    selectedYes: '.Attributes-CheckFilterButton_selected_yes',
    selectedNo: '.Attributes-CheckFilterButton_selected_no'
  };

  readonly xTable = new XTableBlock(this.selectors.container);

  async waitForTableVisible(): Promise<void> {
    await this.xTable.waitForVisible();
  }

  async waitForBarHidden(): Promise<void> {
    const $bar = await this.$('bar');

    await $bar.waitForDisplayed({ reverse: true });
  }

  async checkTableSingleColTitle(title: string): Promise<void> {
    const $attributeTableHead = await this.$('attributesTableHead');
    await $attributeTableHead.waitForDisplayed({ timeout: 13_000 });

    const values = await this.getHeadCellsValues();

    expect(values).toEqual(['', 'ID', title]);
  }

  async selectTab(title: string): Promise<void> {
    const $attributesTab = await this.getAttributesTabByName(title);

    await $attributesTab.click();
  }

  private async getAttributesTabByName(name: string): Promise<WebdriverIO.Element> {
    const $attributesTabs = await this.$('attributesTabs');
    await $attributesTabs.waitForDisplayed();

    const $$attributesTab = await this.$$('attributesTab');

    for (const $tab of $$attributesTab) {
      const tabName = await $tab.getText();

      if (tabName === name) {
        return $tab;
      }
    }

    throw new Error(`Не найден элемент "${name}"`);
  }

  async getHeadCellsValues(): Promise<string[]> {
    const $$cellContents = await this.$$('attributesTableHeadCellContent');

    const contents: string[] = [];
    for (const $cell of $$cellContents) {
      contents.push(await $cell.$('.XTable-HeadCellTitle').getText());
    }

    return contents;
  }

  async getTitle(): Promise<string> {
    const $barTitle = await this.$('barTitle');
    await $barTitle.waitForDisplayed({ timeout: 13_000 });

    return await $barTitle.getText();
  }

  async clickPaginationItem(page: number): Promise<void> {
    const $pagination = await this.$('pagination');
    const $paginationBtn = await $pagination.$(`.MuiPaginationItem-root=${page}`);
    await $paginationBtn.click();
  }

  async clickTab(layerTitle: string) {
    const $attributesTabs = await this.$('attributesTabs');
    const $tabTitle = await $attributesTabs.$(`.Attributes-TabTitle=${layerTitle}`);
    await $tabTitle.click();
  }

  async clickFiltersEnabler() {
    const $attributesTabs = await this.$('filtersEnabler');
    await $attributesTabs.waitForDisplayed();
    await $attributesTabs.click();

    await this.waitForLoadingDisappear();
  }

  async waitForLoadingDisappear() {
    const $loading = await this.$('loading');
    await $loading.waitForDisplayed({ reverse: true });
  }

  async minimize() {
    const $barMinimize = await this.$('barMinimize');
    await $barMinimize.click();
  }

  async closeTab(layerTitle: string) {
    const $attributesTabs = await this.$('attributesTabs');
    const $tabTitle = await $attributesTabs.$(`.Attributes-TabTitle=${layerTitle}`);
    const $attributeTab = await $tabTitle.parentElement();
    const $closeIcon = await $attributeTab.$('.Attributes-TabClose');
    await $closeIcon.waitForClickable();
    await $closeIcon.click();
  }

  async filterBySelection(inverse: boolean): Promise<void> {
    const $selected = await this.$(inverse ? 'selectedYes' : 'selectedNo');
    await $selected.waitForClickable();
    await $selected.click();
  }
}

export const attributesBlock = new AttributesBlock();
