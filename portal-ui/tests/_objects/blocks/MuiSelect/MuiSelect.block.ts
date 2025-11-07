import { sleep } from '../../../../src/app/services/util/sleep';
import { Block } from '../../Block';
import { MuiMenuBlock } from '../MuiMenu/MuiMenu.block';

export class MuiSelectBlock extends Block {
  selectors = {
    root: '.MuiInputBase-root div[class*="MuiSelect"]'
  };

  async selectOptionByTitle(optionTitle: string, contains?: boolean): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.moveTo();

    await sleep(300); // ждем анимации отображения
    await $root.click();

    const muiMenuBlock = new MuiMenuBlock();
    await muiMenuBlock.clickItemByTitle(optionTitle, contains);
  }

  async getText(): Promise<string> {
    const $root = await this.findBySelector('root');

    return $root.getText();
  }

  async close(): Promise<void> {
    const muiMenuBlock = new MuiMenuBlock();
    await muiMenuBlock.close();
  }
}
