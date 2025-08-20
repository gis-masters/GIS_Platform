import { Block } from '../../Block';

class TaskPageBlock extends Block {
  selectors = {
    container: '.TaskPageContainer',
    title: '.TaskPageContainer-Title',
    actions: '.TaskPageContainer-Actions',
    card: '.TaskPageContainer .TaskCard-Card'
  };

  async isCardExist(): Promise<void> {
    const $card = await this.$('card');
    await $card.waitForDisplayed();
  }

  async isActionsExist(): Promise<void> {
    const $actions = await this.$('actions');
    await $actions.waitForDisplayed();
  }

  async getCardTitle(): Promise<string> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    const $title = await this.$('title');

    return $title.getText();
  }
}

export const taskPageBlock = new TaskPageBlock();
