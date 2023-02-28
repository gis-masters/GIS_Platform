import { Block } from '../../Block';

class XTable extends Block {
  selectors = {
    container: '.XTable',
    firstColCellContent: '.XTable .XTable-Cell:first-child .XTable-CellContent',
    secondColCellContent: '.XTable .XTable-Cell:nth-child(2) .XTable-CellContent'
  };

  async getFirstColCellValues(): Promise<string[]> {
    const $$cellContents = await this.$$('firstColCellContent');

    const contents: string[] = [];
    for (const $cell of $$cellContents) {
      contents.push(await $cell.getText());
    }

    return contents;
  }

  async getSecondColValues(): Promise<string[]> {
    const $$cellContents = await this.$$('secondColCellContent');

    const contents: string[] = [];
    for (const $cell of $$cellContents) {
      contents.push(await $cell.getText());
    }

    return contents;
  }
}

export const xTable = new XTable();
