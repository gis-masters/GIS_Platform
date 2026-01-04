import { type WdioCheckElementMethodOptions } from '@wdio/visual-service/dist/types';

import { Block } from '../../Block';
import { extractText } from '../../commands/extractText';
import { CopyFeaturesButtonBlock } from '../CopyFeaturesButton/CopyFeaturesButton.block';
import { XTableBlock } from '../XTable/XTable.block';

class AttributesBlock extends Block {
  selectors = {
    root: '.Attributes',
    bar: '.Attributes-Bar',
    loader: '.Attributes .Loading',
    attributeTableCols: '.Attributes-Table .XTable-Head .XTable-CellContent',
    barTitle: '.Attributes-BarTitle',
    barMinimize: '.Attributes-BarMinimize',
    attributesTabs: '.Attributes-Tabs',
    filtersEnabler: '.Attributes-FiltersEnabler',
    pagination: '.Attributes-Pagination',
    attributesTab: '.Attributes-Tabs .Attributes-Tab',
    attributesTableHead: '.Attributes-Table .XTable-Head',
    attributesTableHeadCellContent: '.Attributes-Table .XTable-Head .XTable-CellContent',
    attributesTableCellContentTooltip: '.Attributes-Table .XTable-CellContent .XTable-TooltipTrigger',
    selectedYes: '.Attributes-CheckFilterButton_selected_yes',
    selectedNo: '.Attributes-CheckFilterButton_selected_no',
    multipleCopy: '.Attributes .CopyFeaturesButton',
    multipleEdit: '.Attributes .EditFeaturesButton',
    counterItem: '.Attributes .Attributes-CounterItem'
  };

  xTable = new XTableBlock(this.selectors.root);
  copyFeaturesButton = new CopyFeaturesButtonBlock(this.selectors.root);

  async waitForTableVisible(): Promise<void> {
    await this.xTable.waitForVisible();
  }

  async waitForBarHidden(): Promise<void> {
    const $bar = await this.findBySelector('bar');

    await $bar.waitForExist({ reverse: true });
  }

  async checkTableSingleColTitle(title: string): Promise<void> {
    const $attributeTableHead = await this.findBySelector('attributesTableHead');
    await $attributeTableHead.waitForDisplayed({ timeout: 13_000 });

    const values = await this.getHeadCellsValues();

    expect(values).toEqual(['', title]);
  }

  async selectTab(title: string): Promise<void> {
    const $attributesTab = await this.getAttributesTabByName(title);

    await $attributesTab.click();
  }

  async getHeadCellsValues(): Promise<string[]> {
    const $$cellContents = await this.findAllBySelector('attributesTableHeadCellContent');

    const contents: string[] = [];
    for (const $cell of $$cellContents) {
      contents.push(await $cell.$('.XTable-HeadCellTitle').getText());
    }

    return contents;
  }

  async clickFirstTooltip(): Promise<void> {
    const $$cellContents = await this.findAllBySelector('attributesTableCellContentTooltip');

    await $$cellContents[0].click();
  }

  async getTitle(): Promise<string> {
    const $barTitle = await this.findBySelector('barTitle');
    await $barTitle.waitForDisplayed({ timeout: 13_000 });

    return await $barTitle.getText();
  }

  async clickPaginationItem(page: number): Promise<void> {
    const $pagination = await this.findBySelector('pagination');
    const $paginationBtn = await $pagination.$(`.MuiPaginationItem-root=${page}`).getElement();
    await $paginationBtn.click();
  }

  async clickTab(layerTitle: string) {
    const $attributesTabs = await this.findBySelector('attributesTabs');
    const $tabTitle = await $attributesTabs.$(`.TabTitle=${layerTitle}`).getElement();
    await $tabTitle.click();
  }

  async clickMultipleCopy() {
    const $multipleCopy = await this.findBySelector('multipleCopy');
    await $multipleCopy.waitForClickable();
    await $multipleCopy.click();
  }

  async clickMultipleEdit() {
    const $multipleEdit = await this.findBySelector('multipleEdit');
    await $multipleEdit.waitForClickable();
    await $multipleEdit.click();
  }

  async clickFiltersEnabler() {
    const $attributesTabs = await this.findBySelector('filtersEnabler');
    await $attributesTabs.waitForDisplayed();
    await $attributesTabs.click();

    await this.waitForLoading();
  }

  async minimize() {
    const $barMinimize = await this.findBySelector('barMinimize');
    await $barMinimize.click();
  }

  async getTabsTitles() {
    const $attributesTabs = await this.findBySelector('attributesTabs');
    await $attributesTabs.waitForDisplayed();

    return await extractText(await $attributesTabs.$$('.TabTitle').getElements());
  }

  async closeTab(layerTitle: string) {
    const $attributesTabs = await this.findBySelector('attributesTabs');
    const $tabTitle = await $attributesTabs.$(`.TabTitle=${layerTitle}`).getElement();
    const $attributeTab = await $tabTitle.parentElement().getElement();
    const $closeIcon = await $attributeTab.$('.Attributes-TabClose').getElement();
    await $closeIcon.waitForClickable();
    await $closeIcon.click();
  }

  async filterBySelection(inverse: boolean): Promise<void> {
    const $selected = await this.findBySelector(inverse ? 'selectedYes' : 'selectedNo');
    await $selected.waitForClickable();
    await $selected.click();
  }

  async selectItems(itemsNumber: number): Promise<void> {
    await this.xTable.waitForLoading();
    const $$documentRow = await this.xTable.getRows(itemsNumber);

    for (const $documentRow of $$documentRow) {
      const $xTableDocumentRowSelect = await $documentRow.$('td:first-child input').getElement();
      await $xTableDocumentRowSelect.click();
    }
  }

  async getTotalObjectsNumber() {
    const $counterItem = await this.findBySelector('counterItem');
    const counterItemTest = await $counterItem.getText();
    const counterNumber = counterItemTest.split(':')[1];

    return Number(counterNumber);
  }

  async getSelectedObjectsCount(): Promise<number> {
    const $counterItem = await this.findBySelector('counterItem');
    const counterText = await $counterItem.getText();
    const selectedCount = counterText.split('выделено: ')[1].split(' ')[0];

    return Number(selectedCount);
  }

  async assertSelfie(tag?: string, checkElementOptions?: WdioCheckElementMethodOptions): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForDisplayed();

    await super.assertSelfie(tag, {
      hideElements: [...(checkElementOptions?.hideElements || [])],
      ...checkElementOptions
    });
  }

  private async getAttributesTabByName(name: string): Promise<WebdriverIO.Element> {
    const $attributesTabs = await this.findBySelector('attributesTabs');
    await $attributesTabs.waitForDisplayed();

    const $$attributesTab = await this.findAllBySelector('attributesTab');

    for (const $tab of $$attributesTab) {
      const tabName = await $tab.getText();

      if (tabName === name) {
        return $tab;
      }
    }

    throw new Error(`Не найден элемент "${name}"`);
  }
}

export const attributesBlock = new AttributesBlock();
