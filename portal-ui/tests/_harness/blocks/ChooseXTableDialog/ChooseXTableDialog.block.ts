import { Block } from '../../classes/Block';
import { XTableBlock } from '../XTable/XTable.block';

export class ChooseXTableDialogBlock extends Block {
  selectors = {
    root: '.ChooseXTableDialog',
    submit: '.ChooseXTableDialog-Submit',
    secondAction: '.ChooseXTableDialog-Close',
    actionButtons: '.ChooseXTableDialog .Button'
  };

  async clickSubmitButton(): Promise<void> {
    const $submitBtn = await this.findBySelector('submit');
    await $submitBtn.waitForClickable();
    await $submitBtn.click();
  }

  async isSubmitEnabled(): Promise<boolean> {
    const $submitBtn = await this.findBySelector('submit');
    await $submitBtn.waitForDisplayed();

    return $submitBtn.isEnabled();
  }

  async getXTable(): Promise<XTableBlock> {
    return new XTableBlock(undefined, await this.findBySelector('root'));
  }

  async getSecondActionText(): Promise<string> {
    const $button = await this.findBySelector('secondAction');
    await $button.waitForDisplayed();

    return $button.getText();
  }

  async clickActionByTitle(title: string): Promise<void> {
    const $$buttons = await this.findAllBySelector('actionButtons');

    for (const $button of $$buttons) {
      if ((await $button.getText()) === title) {
        await $button.waitForClickable();
        await $button.click();

        return;
      }
    }

    throw new Error(`Не найдена кнопка ${title}`);
  }
}

export const chooseXTableDialogBlock = new ChooseXTableDialogBlock();
