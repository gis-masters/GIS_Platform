import { Block } from '../../classes/Block';

export class EditFeatureNavigationBlock extends Block {
  selectors = {
    root: '.EditFeatureNavigation',
    textBox: '.EditFeatureNavigation-TextBox',
    prevBtn: '.EditFeatureNavigation-Prev .MuiButtonBase-root',
    nextBtn: '.EditFeatureNavigation-Next .MuiButtonBase-root'
  };

  async clickPrev(): Promise<void> {
    const $prevBtn = await this.findBySelector('prevBtn');
    await $prevBtn.click();
  }

  async clickNext(): Promise<void> {
    const $nextBtn = await this.findBySelector('nextBtn');
    await $nextBtn.click();
  }

  async getValue(): Promise<string> {
    const $textBox = await this.findBySelector('textBox');

    return $textBox.getText();
  }
}

export const editFeatureNavigationBlock = new EditFeatureNavigationBlock('.EditFeature');
