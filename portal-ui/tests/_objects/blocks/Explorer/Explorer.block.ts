import { binding, then, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';

@binding()
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

  @when(/^я дожидаюсь окончания загрузки в explorer$/)
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

  @then(/^список названий в explorer: (".+"[ ,]*)+$/)
  async testTitles(dirty: string) {
    const titles = dirty.slice(1, -1).split('", "');
    expect(titles).toEqual(await this.getListTitles());
  }

  @then(/^список в explorer пуст$/)
  async testEmptiness() {
    await expect(this.$empty).toBeDisplayedInViewport();
  }
}

export const explorer = new Explorer();
