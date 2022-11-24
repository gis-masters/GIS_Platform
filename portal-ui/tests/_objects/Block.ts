import { Then } from '@wdio/cucumber-framework';

export interface BlockModel {
  $container: Promise<WebdriverIO.Element>;
}

const blocksRegistry: Record<string, Block> = {};

Then(/^блок "([\dA-Za-z]*)" вариант "([\dA-Za-z-]*)" выглядит как положено$/, async (name: string, variant: string) => {
  await blocksRegistry[name].assertSelfie(variant);
});

export abstract class Block {
  get name(): string {
    return this.constructor.name;
  }

  constructor() {
    blocksRegistry[this.constructor.name] = this;
  }

  async waitForVisible(): Promise<true | void> {
    const $container = await (this as unknown as BlockModel).$container;

    return $container.waitForDisplayed({ timeout: 5000 });
  }

  async waitForHidden(): Promise<void> {
    const $container = await (this as unknown as BlockModel).$container;

    await $container.waitForDisplayed({
      reverse: true,
      timeout: 5000
    });
  }

  async assertSelfie(tag = 'plain'): Promise<void> {
    const $container = await (this as unknown as BlockModel).$container;

    expect(await browser.checkElement($container, `${this.name}-${tag}`, {})).toEqual(0);
  }
}
