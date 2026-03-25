import { SplitButtonBlock } from '../../SplitButton/SplitButton.block';
import { AnswerModalBlock, answerModalBlock } from '../AnswerModal.block';

class AnswerModalTypeFormPromptBlock extends AnswerModalBlock {
  selectors = {
    ...answerModalBlock.selectors,
    root: '.AnswerModal_type_formPrompt',
    submit: '.AnswerModal_type_formPrompt .AnswerModal-Actions button[type="submit"]',
    splitButton: '.AnswerModal_type_formPrompt .AnswerModal-Actions .SplitButton'
  };

  async submit(): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForDisplayed();

    const $submit = await this.findBySelector('submit');
    if (await $submit.isExisting()) {
      await $submit.waitForClickable();
      await $submit.click();

      return;
    }

    const $split = await this.findBySelector('splitButton');
    if (await $split.isExisting()) {
      const splitButton = new SplitButtonBlock(null, $split);
      await splitButton.clickMain();

      return;
    }

    throw new Error('Не найдена кнопка отправки формы в AnswerModal_type_formPrompt');
  }

  async submitFromSplitMenu(splitMenuLabel: string): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForDisplayed();

    const $split = await this.findBySelector('splitButton');
    if (!(await $split.isExisting())) {
      throw new Error('В диалоге с формой нет SplitButton');
    }

    const splitButton = new SplitButtonBlock(null, $split);
    await splitButton.clickByLabel(splitMenuLabel);
  }
}

export const answerModalTypeFormPromptBlock = new AnswerModalTypeFormPromptBlock();
