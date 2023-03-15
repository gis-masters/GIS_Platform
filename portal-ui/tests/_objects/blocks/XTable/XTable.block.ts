import { Block } from '../../Block';
import { extractText } from '../../commands/extractText';
import { SortOrder } from '../../../../src/app/services/models';

export class XTableBlock extends Block {
  selectors = {
    container: '.XTable',
    head: '.XTable-Head',
    colTitle: '.XTable-HeadCellTitle',
    firstColCellContent: '.XTable .XTable-Cell:first-child .XTable-CellContent',
    secondColCellContent: '.XTable-Row .XTable-Cell:nth-child(2) .XTable-CellContent'
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

  async getHeadCellByTitle(title: string): Promise<WebdriverIO.Element> {
    const $head = await this.$('head');

    return $head.$(String(this.selectors.colTitle + '=' + title));
  }

  async getColValues(title: string): Promise<string[]> {
    return await extractText(await this.getCellsByTitle(title));
  }

  async sortColumn(title: string, direction: string): Promise<void> {
    const $title = await this.getHeadCellByTitle(title);
    if (!$title) {
      throw new Error('Не найдена колонка: ' + title);
    }

    await $title.waitForClickable();
    if (direction.toLowerCase() === SortOrder.ASC) {
      await $title.click();
    } else if (direction.toLowerCase() === SortOrder.DESC) {
      await $title.click();
      await $title.click();
    } else {
      throw new Error('Unsupported direction: ' + direction);
    }
  }

  private async getCellsByTitle(title: string): Promise<WebdriverIO.Element[]> {
    const headerTitles = await extractText(await this.$$('colTitle'));

    const index = headerTitles.indexOf(title);

    return $$(`.XTable-Row .XTable-Cell:nth-child(${index + 1}) .XTable-CellContent`);
  }
}

export const xTableBlock = new XTableBlock();
