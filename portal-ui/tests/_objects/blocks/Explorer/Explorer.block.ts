import { sleep } from '../../../../src/app/services/util/sleep';

import { Block } from '../../Block';

class ExplorerBlock extends Block {
  selectors = {
    container: '.Explorer',
    oneTitle: '.Explorer-ItemTitle',
    titles: '.Explorer-ItemTitle',
    loader: '.Explorer .Loading',
    empty: '.Explorer-Empty',
    firstItemTitle: '.Explorer-List .Explorer-Item:first-child .MuiListItemText-primary',
    secondItemTitle: '.Explorer-List .Explorer-Item:last-child .MuiListItemText-primary',
    connectionToProject: '.Explorer .ConnectionsToProjectsWidget button'
  };

  async selectedVectorTableWithViews(): Promise<void> {
    const $firstDataset = await this.$('firstItemTitle');

    const vectorTableTitle = await $firstDataset.getText();
    expect(vectorTableTitle).toEqual('админ деление с представлениями');
  }

  async authWithError(): Promise<void> {
    const $firstItemTitle = await this.$('firstItemTitle');
    await $firstItemTitle.doubleClick();

    await sleep(500); // ждем анимации перехода
  }

  async selectedVectorTableWithoutViews(): Promise<void> {
    const $secondDataset = await this.$('secondItemTitle');
    await $secondDataset.waitForDisplayed({ timeout: 1000 });

    const vectorTableTitle = await $secondDataset.getText();
    expect(vectorTableTitle).toEqual('админ деление без представлений');
    await $secondDataset.click();
  }

  async addToProject(): Promise<void> {
    const $connectionToProject = await this.$('connectionToProject');
    await $connectionToProject.click();
  }

  async waitForLoading(): Promise<void> {
    await browser.pause(300);
    const $loader = await this.$('loader');
    await $loader.waitForDisplayed({ reverse: true });
    await browser.pause(300);
  }

  async getListTitles(): Promise<string[]> {
    const $title = await this.$('oneTitle');
    await $title.waitForDisplayed();
    const $$titles = await this.$$('titles');

    return await Promise.all($$titles.map(async $title => await $title.getText()));
  }

  async testTitles(dirty: string) {
    const titles = dirty.slice(1, -1).split('", "');
    expect(titles).toEqual(await this.getListTitles());
  }

  async testEmptiness() {
    await expect(this.$('empty')).toBeDisplayedInViewport();
  }
}

export const explorerBlock = new ExplorerBlock();
