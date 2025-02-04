import { sleep } from '../../../../src/app/services/util/sleep';
import { Block } from '../../Block';
import { MuiMenuBlock } from '../MuiMenu/MuiMenu.block';

export class MuiSelectBlock extends Block {
  selectors = {
    container: '.MuiInputBase-root div[class*="MuiSelect"]'
  };

  async selectOptionByTitle(optionTitle: string, contains?: boolean): Promise<void> {
    const $container = await this.$('container');
    await $container.moveTo();

    await sleep(300); // ждем анимации отображения
    await $container.click();

    const muiMenuBlock = new MuiMenuBlock();
    await muiMenuBlock.clickItemByTitle(optionTitle, contains);
  }

  async getText(): Promise<string> {
    const $container = await this.$('container');

    return $container.getText();
  }

  async close(): Promise<void> {
    const muiMenuBlock = new MuiMenuBlock();
    await muiMenuBlock.close();
  }
}
