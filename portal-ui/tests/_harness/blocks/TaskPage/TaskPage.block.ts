import { Block } from '../../classes/Block';

class TaskPageBlock extends Block {
  selectors = {
    root: '.TaskPageContainer',
    title: '.TaskPageContainer-Title',
    actions: '.TaskPageContainer-Actions',
    card: '.TaskPageContainer .TaskCard-Card'
  };

  async isCardExist(): Promise<void> {
    const $card = await this.findBySelector('card');
    await $card.waitForDisplayed();
  }

  async isActionsExist(): Promise<void> {
    const $actions = await this.findBySelector('actions');
    await $actions.waitForDisplayed();
  }

  async getCardTitle(): Promise<string> {
    const $root = await this.findBySelector('root');
    await $root.waitForDisplayed();

    const $title = await this.findBySelector('title');

    return $title.getText();
  }
}

export const taskPageBlock = new TaskPageBlock();
