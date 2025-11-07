import { Block } from '../../Block';

class DocumentsBlock extends Block {
  selectors = {
    root: '.Documents',
    add: '.Documents-Add .MuiButton-root'
  };

  async clickAdd() {
    const $add = await this.findBySelector('add');
    await $add.click();
  }
}

export const documentsBlock = new DocumentsBlock();
