import { Block } from '../../../Block';
import { FormBlock } from '../Form.block';

class FormControlTypeUrlBlock extends Block {
  selectors = {
    container: '.Form-Control_type_url'
  };

  async clickAddUrlBtn(title: string): Promise<void> {
    const formBlock = new FormBlock();
    const $field = await formBlock.getField(title);

    const $addUrlBtn = await $field.$('.UrlsList-AddUrl');
    await $addUrlBtn.click();
  }

  async clickFirstUrlLink(title: string): Promise<void> {
    const formBlock = new FormBlock();
    const $field = await formBlock.getField(title);
    const $urlLink = await $field.$('.UrlsList .UrlsList-Item:first-child .PseudoLink');

    await $urlLink.click();
  }
}

export const formControlTypeUrlBlock = new FormControlTypeUrlBlock();
