import { Block } from '../../classes/Block';
import { hasClass } from '../../commands/hasClass';
import { XTableBlock } from '../XTable/XTable.block';

export class ChooseXTableBlock extends Block {
  selectors = {
    root: '.ChooseXTable',
    check: '.ChooseXTable-Check',
    selectAll: '.XTable-Head .MuiCheckbox-root',
    titleCount: '.ChooseXTable-TitleCount'
  };

  async getXTable(): Promise<XTableBlock> {
    return new XTableBlock(undefined, await this.findBySelector('root'));
  }

  async selectOne(colTitle: string, value: string): Promise<void> {
    const $check = await this.getCheckByColValue(colTitle, value);
    await $check.click();
  }

  async clickCheckByColValue(colTitle: string, value: string): Promise<void> {
    const $wrapper = await this.getCheckWrapperByColValue(colTitle, value);
    await $wrapper.click();
  }

  async isCheckDisabled(colTitle: string, value: string): Promise<boolean> {
    const $check = await this.getCheckByColValue(colTitle, value);

    return hasClass($check, 'Mui-disabled');
  }

  async isCheckChecked(colTitle: string, value: string): Promise<boolean> {
    const $check = await this.getCheckByColValue(colTitle, value);

    return hasClass($check, 'Mui-checked');
  }

  async areAllRowChecksEnabled(): Promise<boolean> {
    const $$checks = await this.findAllBySelector('check');
    if (!$$checks.length) {
      throw new Error('В таблице выбора нет переключателей строк');
    }

    for (const $check of $$checks) {
      if (await hasClass($check, 'Mui-disabled')) {
        return false;
      }
    }

    return true;
  }

  async clickSelectAll(): Promise<void> {
    const $selectAll = await this.findBySelector('selectAll');
    await $selectAll.waitForClickable();
    await $selectAll.click();
  }

  async hasSelectAll(): Promise<boolean> {
    const $selectAll = await this.findBySelector('selectAll');

    return $selectAll.isExisting();
  }

  async getSelectAllAriaChecked(): Promise<string> {
    const $selectAll = await this.findBySelector('selectAll');
    await $selectAll.waitForDisplayed();
    const $input = await $selectAll.$('input').getElement();
    const ariaChecked = await $input.getAttribute('aria-checked');
    if (ariaChecked === 'mixed' || (await hasClass($selectAll, 'MuiCheckbox-indeterminate'))) {
      return 'mixed';
    }

    if (ariaChecked === 'true' || (await hasClass($selectAll, 'Mui-checked'))) {
      return 'true';
    }

    return 'false';
  }

  async getTitleCountText(): Promise<string> {
    const $titleCount = await this.findBySelector('titleCount');
    await $titleCount.waitForDisplayed();

    return $titleCount.getText();
  }

  async hoverCheckByColValue(colTitle: string, value: string): Promise<void> {
    const $wrapper = await this.getCheckWrapperByColValue(colTitle, value);
    await $wrapper.moveTo();
  }

  async getOpenTooltipText(): Promise<string> {
    const $tooltip = await $('[role="tooltip"]').getElement();
    await $tooltip.waitForDisplayed();

    return $tooltip.getText();
  }

  private async getCheckByColValue(colTitle: string, value: string): Promise<WebdriverIO.Element> {
    const xTable = await this.getXTable();
    await xTable.waitForVisible();
    const values = await xTable.getColValues(colTitle);

    const rowIndex = values.indexOf(value);
    if (rowIndex === -1) {
      throw new Error(`Не нашли элемент: ${colTitle} - ${value}`);
    }

    const $$checks = await this.findAllBySelector('check');
    const $check = $$checks[rowIndex];
    if (!$check) {
      throw new Error(`Не нашли переключатель: ${colTitle} - ${value} (${rowIndex})`);
    }

    return $check;
  }

  private async getCheckWrapperByColValue(colTitle: string, value: string): Promise<WebdriverIO.Element> {
    const $check = await this.getCheckByColValue(colTitle, value);

    return $check.parentElement().getElement();
  }
}

export const chooseXTableBlock = new ChooseXTableBlock();
