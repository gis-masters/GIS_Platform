import { binding } from 'cucumber-tsflow/dist';
import { Block, BlockModel } from '../../Block';

@binding()
class XTable extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.XTable');
  }

  get $$firstColCellContent(): Promise<WebdriverIO.Element[]> {
    return $$('.XTable .XTable-Cell:first-child .XTable-CellContent');
  }

  get $$secondColCellContent(): Promise<WebdriverIO.Element[]> {
    return $$('.XTable .XTable-Cell:nth-child(2) .XTable-CellContent');
  }

  async getSecondColValues(): Promise<string[]> {
    const $$cellContents = await this.$$secondColCellContent;

    const contents: string[] = [];
    for (const $cell of $$cellContents) {
      contents.push(await $cell.$('.Highlight').getText());
    }

    return contents;
  }

  async getFirstColCellHighlightedValues(): Promise<string[]> {
    const $$cellContents = await this.$$firstColCellContent;

    const contents: string[] = [];
    for (const $cell of $$cellContents) {
      contents.push(await $cell.$('.Highlight').getText());
    }

    return contents;
  }

  async getFirstColCellValues(): Promise<string[]> {
    const $$cellContents = await this.$$firstColCellContent;

    const contents: string[] = [];
    for (const $cell of $$cellContents) {
      contents.push(await $cell.getText());
    }

    return contents;
  }
}

export const xTable = new XTable();
