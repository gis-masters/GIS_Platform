import { Block } from '../../Block';
import { XTableBlock } from '../XTable/XTable.block';

class AttributesBlock extends Block {
  private readonly xTable = new XTableBlock('.Attributes');

  selectors = {
    container: '.Attributes',
    attributeTableHead: '.Attributes-Table .XTable-Head',
    attributeTableCols: '.Attributes-Table .XTable-Head .XTable-CellContent',
    barTitle: '.Attributes-BarTitle',
    pagination: '.Attributes-Pagination'
  };

  async checkTableSingleColTitle(title: string): Promise<void> {
    const $attributeTableHead = await this.$('attributeTableHead');
    await $attributeTableHead.waitForDisplayed({ timeout: 13_000 });

    const values = await this.getHeadCellsValues();

    expect(values).toEqual(['', 'ID', title]);
  }

  async getHeadCellsValues(): Promise<string[]> {
    const $$cellContents = await this.$$('attributeTableCols');

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

  async sortColumn(title: string, direction: string) {
    await this.xTable.sortColumn(title, direction);
  }

  async getColValues(title: string): Promise<string[]> {
    return await this.xTable.getColValues(title);
  }
}

export const attributesBlock = new AttributesBlock();
