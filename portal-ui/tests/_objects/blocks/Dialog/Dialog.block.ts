import { Block } from '../../Block';

export class DialogBlock extends Block {
  selectors = {
    root: '.MuiDialog-paper',
    actions: '.MuiDialog-paper .MuiDialogActions-root',
    actionsButtons: '.MuiDialog-paper .MuiDialogActions-root .Button',
    primaryAction: '.MuiDialog-paper .MuiDialogActions-root .MuiButton-outlinedPrimary'
  };

  private async getButtonByTitle(buttonTitle: string): Promise<WebdriverIO.Element> {
    await this.waitForVisible();
    const $actions = await this.findBySelector('actions');
    await $actions.waitForDisplayed();

    const $$buttons = await this.findAllBySelector('actionsButtons');

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

  async clickActionButton(title: string): Promise<void> {
    const $button = await this.getButtonByTitle(title);
    await $button.click();
  }

  async clickPrimaryActionButton(): Promise<void> {
    const $$buttons = await this.findAllBySelector('primaryAction');

    if ($$buttons.length !== 1) {
      throw new Error(`Ожидалась одна primary кнопка, найдено: ${$$buttons.length}`);
    }

    await $$buttons[0].click();
  }
}
