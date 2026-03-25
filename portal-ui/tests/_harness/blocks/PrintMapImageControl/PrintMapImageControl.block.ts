import { Block } from '../../classes/Block';

export class PrintMapImageControlBlock extends Block {
  selectors = {
    root: '.PrintMapImageControl',
    selectedImage: '.PrintMapImageControl-Image'
  };

  async clickChooseMapFragment(): Promise<void> {
    const $btn = await this.findBySelector('root');
    await $btn.waitForClickable();
    await $btn.click();
  }

  async waitForSelectedImage(): Promise<void> {
    const $img = await this.findBySelector('selectedImage');
    await $img.waitForDisplayed();
  }
}

export const printMapImageControlBlock = new PrintMapImageControlBlock();
