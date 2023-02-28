export const blocksRegistry: Record<string, Block> = {};

interface Selectors {
  [key: string]: string;
  container: string;
}

export abstract class Block<S extends Selectors = Selectors> {
  abstract selectors: S;
  parentSelector: string;

  get name(): string {
    return this.constructor.name;
  }

  constructor(parentSelector = '') {
    this.parentSelector = parentSelector;
    blocksRegistry[this.constructor.name] = this;
  }

  protected async $(key: keyof this['selectors']): Promise<WebdriverIO.Element> {
    const $parent = this.parentSelector ? await $(this.parentSelector) : browser;

    return await $parent.$(this.selectors[key]);
  }

  protected async $$(key: keyof this['selectors']): Promise<WebdriverIO.Element[]> {
    const $parent = this.parentSelector ? await $(this.parentSelector) : browser;

    return await $parent.$$(this.selectors[key]);
  }

  async waitForExist(): Promise<true | void> {
    const $container = await this.$('container');

    return $container.waitForExist({ timeout: 5000 });
  }

  async waitForVisible(): Promise<true | void> {
    const $container = await this.$('container');

    return $container.waitForDisplayed({ timeout: 5000 });
  }

  async waitForHidden(): Promise<void> {
    const $container = await this.$('container');

    await $container.waitForDisplayed({ reverse: true, timeout: 5000 });
  }

  async assertSelfie(tag = 'plain'): Promise<void> {
    const $container = await this.$('container');

    expect(await browser.checkElement($container, `${this.name}-${tag}`, {})).toEqual(0);
  }
}
