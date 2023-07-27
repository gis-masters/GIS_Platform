export const blocksRegistry: Record<string, Block> = {};

interface Selectors {
  [key: string]: string;
  container: string;
}

export abstract class Block<S extends Selectors = Selectors> {
  abstract selectors: S;
  protected parent: string | WebdriverIO.Element;
  private readonly container?: WebdriverIO.Element;

  get name(): string {
    return this.constructor.name.replace(/Block$/, '');
  }

  constructor(parent: string | WebdriverIO.Element = '', container?: WebdriverIO.Element) {
    this.container = container;
    this.parent = parent;
    if (!parent && !container) {
      blocksRegistry[this.constructor.name.replace(/Block$/, '')] = this;
    }
  }

  protected async $(key: keyof this['selectors']): Promise<WebdriverIO.Element> {
    if (key === 'container' && this.container) {
      return this.container;
    }

    const $parent = await this.getParentOrContainer();

    return $parent.$(this.selectors[key]);
  }

  protected async $$(key: keyof this['selectors']): Promise<WebdriverIO.Element[]> {
    const $parent = await this.getParentOrContainer();

    return $parent.$$(this.selectors[key]);
  }

  async waitForExist(): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForExist({ timeout: 5000 });
  }

  async waitForVisible(): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForDisplayed({ timeout: 5000 });
  }

  async waitForHidden(): Promise<void> {
    const $container = await this.$('container');

    await $container.waitForDisplayed({ reverse: true, timeout: 5000 });
  }

  async assertSelfie(tag = 'plain'): Promise<void> {
    const $container = await this.$('container');

    await expect(await browser.checkElement($container, `${this.name}-${tag}`, {})).toEqual(0);
  }

  private async getParentOrContainer() {
    if (this.container) {
      return this.container;
    }

    if (this.parent && typeof this.parent === 'string') {
      return $(this.parent);
    }

    if (this.parent && typeof this.parent !== 'string') {
      return this.parent;
    }

    return browser;
  }
}
