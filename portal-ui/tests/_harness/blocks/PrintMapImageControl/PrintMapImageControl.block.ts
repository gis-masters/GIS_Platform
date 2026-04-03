import { Block } from '../../classes/Block';

export class PrintMapImageControlBlock extends Block {
  selectors = {
    root: '.PrintMapImageControl',
    selectedPreview: '.PrintMapImageControl-Preview',
    loader: '.PrintMapImageControl-Loading',
    clearButton: '.PrintMapImageControl-Clear',
    chooseButton: '.PrintMapImageControl-ChooseButton'
  };

  async clickChooseMapFragment(): Promise<void> {
    const $btn = await this.findBySelector('chooseButton');
    await $btn.waitForClickable();
    await $btn.click();
  }

  async waitForSelectedImage(): Promise<void> {
    const $preview = await this.findBySelector('selectedPreview');
    await $preview.waitForDisplayed();
    await this.waitForLoading();
  }
}

export const printMapImageControlBlock = new PrintMapImageControlBlock();
