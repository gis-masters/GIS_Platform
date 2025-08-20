import { Key } from 'webdriverio';

import { SortOrder } from '../../../../src/app/services/models';
import { Block } from '../../Block';
import { extractText } from '../../commands/extractText';
import { hasClass } from '../../utils/hasClass';
import { MuiSelectBlock } from '../MuiSelect/MuiSelect.block';
import { XTableFilterTypeDocumentBlock } from './Filter/_type/XTable-Filter_type_document.block';
import { XTableFilterTypeFiasBlock } from './Filter/_type/XTable-Filter_type_fias.block';
import { XTableFilterTypeIdBlock } from './Filter/_type/XTable-Filter_type_id.block';
import { XTableFilterTypeStringBlock } from './Filter/_type/XTable-Filter_type_string.block';

export class XTableBlock extends Block {
  selectors = {
    container: '.XTable',
    loading: '.XTable .Loading',
    head: '.XTable-Head',
    headCell: '.XTable-HeadCell',
    colTitle: '.XTable-HeadCellTitle',
    rows: '.XTable-Row',
    firstColCellContent: '.XTable .XTable-Cell:first-child .XTable-CellContent',
    firstColCellTitle: '.XTable .XTable-Head .MuiTableRow-head .XTable-HeadCell:first-child .XTable-HeadCellTitle',
    secondColCellContent: '.XTable-Row .XTable-Cell:nth-child(2) .XTable-CellContent'
  };

  async focusFirstColTitle(): Promise<void> {
    const $cellContents = await this.$('firstColCellTitle');

    await $cellContents.moveTo();
  }

  async getFirstColCellValues(): Promise<string[]> {
    const $$cellContents = await this.$$('firstColCellContent');

    const contents: string[] = [];
    for (const $cell of $$cellContents) {
      contents.push(await $cell.getText());
    }

    return contents;
  }

  async getSecondColValues(): Promise<string[]> {
    const $loading = await this.$('loading');
    await $loading.waitForDisplayed({ reverse: true });

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
    await $headCellTitle.scrollIntoView();
    await $headCellTitle.moveTo();

    const $filter = await $headCellTitle.$('.XTable-Filter');

    return await $filter.isExisting();
  }

  async sortColumn(title: string, direction: string): Promise<void> {
    await this.waitForLoading();

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

  async waitForLoading(): Promise<void> {
    await this.waitForVisible();
    const $loading = await this.$('loading');
    try {
      await $loading.waitForDisplayed();
    } catch {
      // ignore
    }
    await $loading.waitForDisplayed({ reverse: true });
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
    const xTableFilterTypeStringBlock = new XTableFilterTypeStringBlock($headCell);
    await xTableFilterTypeStringBlock.setValue(filter);
    const $loading = await this.$('loading');
    await $loading.waitForDisplayed({ reverse: true });
  }

  async filterIdColumn(colTitle: string, filter: string): Promise<void> {
    const $headCell = await this.getHeadCell(colTitle);
    const xTableFilterTypeIdBlock = new XTableFilterTypeIdBlock($headCell);
    await xTableFilterTypeIdBlock.setValue(filter);
    const $loading = await this.$('loading');
    await $loading.waitForDisplayed({ reverse: true });
  }

  async filterDocumentColumn(colTitle: string, filter: string): Promise<void> {
    const $headCell = await this.getHeadCell(colTitle);
    const xTableFilterTypeDocumentBlock = new XTableFilterTypeDocumentBlock($headCell);
    await xTableFilterTypeDocumentBlock.setValue(filter);
    const $loading = await this.$('loading');
    await $loading.waitForDisplayed({ reverse: true });
  }

  async filterFiasColumn(colTitle: string, filter: string): Promise<void> {
    const $headCell = await this.getHeadCell(colTitle);
    const xTableFilterTypeFiasBlock = new XTableFilterTypeFiasBlock($headCell);
    await xTableFilterTypeFiasBlock.setValue(filter);
    const $loading = await this.$('loading');
    await $loading.waitForDisplayed({ reverse: true });
  }

  async filterChoiceColumn(colTitle: string, optionTitle: string): Promise<void> {
    const $headCell = await this.getHeadCell(colTitle);

    const $muiSelectBlock = new MuiSelectBlock($headCell);
    await $muiSelectBlock.selectOptionByTitle(optionTitle);
    await browser.keys([Key.Escape]);
    await browser.pause(300); // анимация закрытия выпадающего списка
  }

  async getFilterValue(colTitle: string): Promise<string> {
    const $headCell = await this.getHeadCell(colTitle);
    const $input = await $headCell.$('.XTable-Filter input');

    return await $input.getValue();
  }

  private async getCellsByTitle(title: string): Promise<WebdriverIO.Element[]> {
    const headerTitles = await extractText([...(await this.$$('colTitle'))]);

    const index = headerTitles.indexOf(title);

    const $container = await this.$('container');

    return [...(await $container.$$(`.XTable-Row .XTable-Cell:nth-child(${index + 1}) .XTable-CellContent`))];
  }

  async getRowByFieldValue(value: string, field: string): Promise<WebdriverIO.Element> {
    const headerTitles = await extractText([...(await this.$$('colTitle'))]);
    const index = headerTitles.indexOf(field);
    const $$rows = await this.$$('rows');

    for (const $row of $$rows) {
      const $cell = await $row.$(`td:nth-child(${index + 1})`);
      const cellValue = await $cell.getText();

      if (cellValue === value) {
        return $row;
      }
    }

    throw new Error(`Элемент с значением ${value} в поле ${field} не найден`);
  }

  async getRows(rows: number): Promise<WebdriverIO.Element[]> {
    const $$rows = await this.$$('rows');

    return $$rows.slice(0, rows);
  }

  async getAllRows(): Promise<WebdriverIO.ElementArray> {
    return await this.$$('rows');
  }
}

export const xTableBlock = new XTableBlock();
