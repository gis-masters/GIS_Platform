import { Block } from '../../Block';
import { extractText } from '../../commands/extractText';
import { MuiSelectBlock } from '../MuiSelect/MuiSelect.block';
import { SortOrder } from '../../../../src/app/services/models';
import { hasClass } from '../../utils/hasClass';

export class XTableBlock extends Block {
  selectors = {
    container: '.XTable',
    loading: '.XTable .Loading',
    head: '.XTable-Head',
    headCell: '.XTable-HeadCell',
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

  async getHeadCellTitle(title: string): Promise<WebdriverIO.Element> {
    const $head = await this.$('head');

    const $headCell = await $head.$(String(`${this.selectors.colTitle}=${title}`));
    await $headCell.waitForDisplayed();

    return $headCell;
  }

  async getHeadCell(title: string): Promise<WebdriverIO.Element> {
    const $oneCell = await this.$('headCell');
    await $oneCell.waitForDisplayed();
    const $$headCells = await this.$$('headCell');
    for (const $cell of $$headCells) {
      const $title = await $cell.$(this.selectors.colTitle);
      const cellTitle = await $title.getText();
      if (cellTitle === title) {
        return $cell;
      }
    }

    throw new Error('Could not find head cell ' + title);
  }

  async getColValues(title: string): Promise<string[]> {
    return await extractText(await this.getCellsByTitle(title));
  }

  async getBooleanColValues(title: string): Promise<boolean[]> {
    const $$cells = await this.getCellsByTitle(title);

    const result: boolean[] = [];
    for (const $cell of $$cells) {
      const $icon = await $cell.$('.MuiSvgIcon-root');

      const isOn = await hasClass($icon, 'XTable-BoolIcon_val_on');
      const isOff = await hasClass($icon, 'XTable-BoolIcon_val_off');
      if (isOn) {
        result.push(true);
      } else if (isOff) {
        result.push(false);
      } else {
        throw new Error('Значение отсутствует');
      }
    }

    return result;
  }

  async getColumnType(title: string): Promise<string> {
    const $headCell = await this.getHeadCell(title);
    const classes = await $headCell.getAttribute('class');

    for (const cls of classes.split(' ')) {
      const found = /^XTable-HeadCell_type_(\S+)$/.exec(cls);
      if (found && found[1]) {
        return found[1];
      }
    }

    throw new Error('Could not find column type');
  }

  async isColumnSortable(title: string): Promise<boolean> {
    const $headCellTitle = await this.getHeadCellTitle(title);
    await $headCellTitle.moveTo();

    const $muiTableSortLabelIcon = await $headCellTitle.$('.MuiTableSortLabel-icon');

    return await $muiTableSortLabelIcon.isDisplayed();
  }

  async isColumnFilterable(title: string): Promise<boolean> {
    const $headCellTitle = await this.getHeadCellTitle(title);
    await $headCellTitle.moveTo();

    const $filter = await $headCellTitle.$('.XTable-Filter');

    return await $filter.isExisting();
  }

  async sortColumn(title: string, direction: string): Promise<void> {
    const $loading = await this.$('loading');
    await $loading.waitForDisplayed({ reverse: true });

    const $headCellTitle = await this.getHeadCellTitle(title);
    await $headCellTitle.waitForClickable();
    if (direction.toLowerCase() === SortOrder.ASC) {
      await $headCellTitle.click();
    } else if (direction.toLowerCase() === SortOrder.DESC) {
      await $headCellTitle.click();
      await $headCellTitle.click();
    } else {
      throw new Error('Unsupported direction: ' + direction);
    }
  }

  async filterNumerableColumn(colTitle: string, lte: string, gte: string): Promise<void> {
    const $headCell = await this.getHeadCell(colTitle);
    const $inputLte = $headCell.$('.XTable-Filter .MuiTextField-root:first-child input');
    const $inputGte = $headCell.$('.XTable-Filter .MuiTextField-root:last-child input');

    await $inputLte.setValue(lte);
    await $inputGte.setValue(gte);
  }

  async filterStringColumn(colTitle: string, filter: string): Promise<void> {
    const $headCell = await this.getHeadCell(colTitle);
    const $input = $headCell.$('.XTable-Filter input');
    await $input.setValue(filter);
  }

  async filterChoiceColumn(colTitle: string, optionTitle: string): Promise<void> {
    const $headCell = await this.getHeadCell(colTitle);

    const $muiSelectBlock = new MuiSelectBlock($headCell);
    await $muiSelectBlock.selectOptionByTitle(optionTitle);
  }

  async getFilterValue(colTitle: string): Promise<string> {
    const $headCell = await this.getHeadCell(colTitle);
    const $input = await $headCell.$('.XTable-Filter input');

    return await $input.getValue();
  }

  private async getCellsByTitle(title: string): Promise<WebdriverIO.Element[]> {
    const headerTitles = await extractText(await this.$$('colTitle'));

    const index = headerTitles.indexOf(title);

    return $$(`.XTable-Row .XTable-Cell:nth-child(${index + 1}) .XTable-CellContent`);
  }
}

export const xTableBlock = new XTableBlock();
