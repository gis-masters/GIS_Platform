import { Block } from '../../Block';

export class DialogBlock extends Block {
  selectors = {
    container: '.MuiDialog-paper',
    actions: '.MuiDialog-paper .MuiDialogActions-root',
    actionsButtons: '.MuiDialog-paper .MuiDialogActions-root .Button'
  };

  private async getButtonByTitle(buttonTitle: string): Promise<WebdriverIO.Element> {
    await this.waitForVisible();
    const $actions = await this.$('actions');
    await $actions.waitForDisplayed();

    const $$buttons = await this.$$('actionsButtons');

    if (!$$buttons.length) {
      throw new Error('В диалоговом окне отсутствуют кнопки');
    }

    for (const $button of $$buttons) {
      const title = await $button.getText();

      if (title === buttonTitle) {
        return $button;
      }
    }

    throw new Error(`Не найден элемент ${buttonTitle}`);
  }

  async clickButtonByTitle(title: string): Promise<void> {
    const $button = await this.getButtonByTitle(title);
    await $button.click();
  }
}
