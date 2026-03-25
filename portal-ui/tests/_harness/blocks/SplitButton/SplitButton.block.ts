import { Block } from '../../classes/Block';

export class SplitButtonBlock extends Block {
  selectors = {
    root: '.SplitButton',
    main: '.SplitButton-Main',
    mainText: '.SplitButton-Main .Button-Text',
    toggle: '.SplitButton-Toggle'
  };

  private async getMainButtonLabel(): Promise<string> {
    const $text = await this.findBySelector('mainText');
    const t = await $text.getText();

    return t.trim();
  }

  async clickMain(): Promise<void> {
    const $btn = await this.findBySelector('main');
    await $btn.waitForClickable();
    await $btn.click();
  }

  /**
   * Если текст совпадает с кнопкой действия по умолчанию — клик по ней; иначе меню и пункт с таким текстом.
   */
  async clickByLabel(label: string): Promise<void> {
    const labelNorm = label.trim();
    const $mainButton = await this.findBySelector('main');
    await $mainButton.waitForDisplayed();

    const mainButtonText = await this.getMainButtonLabel();
    if (mainButtonText === labelNorm) {
      await $mainButton.click();

      return;
    }

    const $toggle = await this.findBySelector('toggle');
    await $toggle.waitForClickable();
    await $toggle.click();

    await browser.waitUntil(async () => await browser.$('.MuiPopover-root .MuiMenu-list').isDisplayed(), {
      timeoutMsg: 'Меню SplitButton не открылось'
    });

    const $$items = await browser.$$('.MuiPopover-root .MuiMenuItem-root').getElements();
    const allItemsText: string[] = [];
    for (const $item of $$items) {
      const itemText = await $item.getText();
      allItemsText.push(itemText);
      if (itemText.trim() === labelNorm) {
        await $item.waitForClickable();
        await $item.click();

        return;
      }
    }
    throw new Error(
      `Кнопка SplitButton "${label}" не найдена (ни кнопка по умолчанию, ни пункт меню). Доступные пункты: ${mainButtonText}, ${allItemsText.join(', ')}`
    );
  }
}

export const splitButtonBlock = new SplitButtonBlock();
