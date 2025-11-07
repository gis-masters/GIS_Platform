import { Block } from '../../Block';
import { XTableBlock } from '../XTable/XTable.block';

export class ChooseXTableBlock extends Block {
  selectors = {
    root: '.ChooseXTable',
    check: '.ChooseXTable-Check'
  };

  async getXTable(): Promise<XTableBlock> {
    return new XTableBlock(undefined, await this.findBySelector('root'));
  }

  async selectOne(colTitle: string, value: string): Promise<void> {
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

    await $check.click();
  }
}

export const chooseXTableBlock = new ChooseXTableBlock();
