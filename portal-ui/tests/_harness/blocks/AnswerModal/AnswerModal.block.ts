import { Block } from '../../classes/Block';
import { DialogBlock } from '../Dialog/Dialog.block';

export class AnswerModalBlock extends Block {
  selectors = {
    root: '.AnswerModal',
    content: '.AnswerModal-Content'
  };

  async clickButtonByTitle(title: string): Promise<void> {
    const $root = await this.findBySelector('root');
    const dialogBlock = new DialogBlock(null, $root);

    await dialogBlock.clickActionButton(title);
  }

  async getText(): Promise<string> {
    const $root = await this.findBySelector('root');
    const $content = await $root.$(this.selectors.content).getElement();

    return await $content.getText();
  }

  async clickPrimaryActionButton(): Promise<void> {
    const $root = await this.findBySelector('root');
    const dialogBlock = new DialogBlock(null, $root);

    await dialogBlock.clickPrimaryActionButton();
  }
}

export const answerModalBlock = new AnswerModalBlock();
