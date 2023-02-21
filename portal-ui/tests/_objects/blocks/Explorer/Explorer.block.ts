import { sleep } from '../../../../src/app/services/util/sleep';

import { Block, BlockModel } from '../../Block';

class Explorer extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.Explorer');
  }

  get $oneTitle(): Promise<WebdriverIO.Element> {
    return $('.Explorer-ItemTitle');
  }

  get $$titles(): Promise<WebdriverIO.Element[]> {
    return $$('.Explorer-ItemTitle');
  }

  get $loader(): Promise<WebdriverIO.Element> {
    return $('.Explorer .Loading');
  }

  get $empty(): Promise<WebdriverIO.Element> {
    return $('.Explorer-Empty');
  }

  get $firstItemTitle(): Promise<WebdriverIO.Element> {
    return $('.Explorer-List .Explorer-Item:first-child .MuiListItemText-primary');
  }

  get $secondItemTitle(): Promise<WebdriverIO.Element> {
    return $('.Explorer-List .Explorer-Item:last-child .MuiListItemText-primary');
  }

  get $connectionToProject(): Promise<WebdriverIO.Element> {
    return $('.Explorer .ConnectionsToProjectsWidget button');
  }

  async selectedVectorTableWithViews(): Promise<void> {
    const $firstDataset = await this.$firstItemTitle;

    const vectorTableTitle = await $firstDataset.getText();
    expect(vectorTableTitle).toEqual('админ деление с представлениями');
  }

  async authWithError(): Promise<void> {
    const $firstItemTitle = await this.$firstItemTitle;
    await $firstItemTitle.doubleClick();

    await sleep(500); // ждем анимации перехода
  }

  async selectedVectorTableWithoutViews(): Promise<void> {
    const $secondDataset = await this.$secondItemTitle;
    await $secondDataset.waitForDisplayed({ timeout: 1000 });

    const vectorTableTitle = await $secondDataset.getText();
    expect(vectorTableTitle).toEqual('админ деление без представлений');
    await $secondDataset.click();
  }

  async addToProject(): Promise<void> {
    const $connectionToProject = await this.$connectionToProject;
    await $connectionToProject.click();
  }

  async waitForLoading(): Promise<void> {
    await browser.pause(300);
    const $loader = await this.$loader;
    await $loader.waitForDisplayed({ reverse: true });
    await browser.pause(300);
  }

  async getListTitles(): Promise<string[]> {
    const $title = await this.$oneTitle;
    await $title.waitForDisplayed();
    const $$titles = await this.$$titles;

    return await Promise.all($$titles.map(async $title => await $title.getText()));
  }

  async testTitles(dirty: string) {
    const titles = dirty.slice(1, -1).split('", "');
    expect(titles).toEqual(await this.getListTitles());
  }

  async testEmptiness() {
    await expect(this.$empty).toBeDisplayedInViewport();
  }
}

export const explorer = new Explorer();
