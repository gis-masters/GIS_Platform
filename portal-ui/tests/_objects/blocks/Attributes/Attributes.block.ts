import { Block } from '../../Block';

class Attributes extends Block {
  selectors = {
    container: '.Attributes',
    attributeTableHead: '.Attributes-Table .XTable-Head',
    attributeTableCols: '.Attributes-Table .XTable-Head .XTable-CellContent'
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
}

export const attributes = new Attributes();
