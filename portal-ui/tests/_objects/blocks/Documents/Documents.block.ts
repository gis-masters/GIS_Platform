import { Block } from '../../Block';

class Documents extends Block {
  selectors = {
    container: '.Documents',
    add: '.Documents-Add .MuiButton-root'
  };

  async clickAdd() {
    const $add = await this.$('add');
    await $add.click();
  }
}

export const documents = new Documents();
