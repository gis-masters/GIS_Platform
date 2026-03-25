import { AnswerModalBlock, answerModalBlock } from '../AnswerModal.block';

class AnswerModalTypeConfirmBlock extends AnswerModalBlock {
  selectors = {
    ...answerModalBlock.selectors,
    root: '.AnswerModal_type_confirm'
  };

  async confirm(): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForDisplayed();

    await this.clickPrimaryActionButton();
    await $root.waitForExist({ reverse: true });
  }
}

export const answerModalTypeConfirmBlock = new AnswerModalTypeConfirmBlock();
