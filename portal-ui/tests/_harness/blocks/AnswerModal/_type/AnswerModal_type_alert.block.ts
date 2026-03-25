import { AnswerModalBlock, answerModalBlock } from '../AnswerModal.block';

class AnswerModalTypeAlertBlock extends AnswerModalBlock {
  selectors = {
    ...answerModalBlock.selectors,
    root: '.AnswerModal_type_alert'
  };

  async closeDialog(): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForDisplayed();

    await this.clickPrimaryActionButton();
    await $root.waitForExist({ reverse: true });
  }
}

export const answerModalTypeAlertBlock = new AnswerModalTypeAlertBlock();
