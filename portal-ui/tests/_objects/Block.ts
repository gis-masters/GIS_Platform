import type { WdioCheckElementMethodOptions } from '@wdio/visual-service/dist/types';

interface Selectors {
  [key: string]: string;
  container: string;
}

export abstract class Block<S extends Selectors = Selectors> {
  abstract selectors: S;
  protected parent: string | WebdriverIO.Element | null;
  private readonly container?: WebdriverIO.Element;

  get name(): string {
    return this.constructor.name.replace(/Block$/, '');
  }

  constructor(parent: string | WebdriverIO.Element | null = null, container?: WebdriverIO.Element) {
    this.container = container;
    this.parent = parent;
  }

  protected async findBySelector(key: keyof this['selectors']): Promise<WebdriverIO.Element> {
    if (key === 'container' && this.container) {
      return this.container;
    }

    const $parent = await this.getParentOrContainer();

    return $parent.$(this.selectors[key]).getElement();
  }

  protected async findAllBySelector(key: keyof this['selectors']): Promise<WebdriverIO.ElementArray> {
    const $parent = await this.getParentOrContainer();

    return $parent.$$(this.selectors[key]).getElements();
  }

  async waitForExist(): Promise<void> {
    const $container = await this.findBySelector('container');
    await $container.waitForExist();
  }

  async waitForVisible(): Promise<void> {
    const $container = await this.findBySelector('container');
    await $container.waitForDisplayed();
  }

  async waitForHidden(): Promise<void> {
    const $container = await this.findBySelector('container');
    await $container.waitForExist({ reverse: true });
  }

  async assertSelfie(tag = 'plain', checkElementOptions: WdioCheckElementMethodOptions = {}): Promise<void> {
    const $container = await this.findBySelector('container');
    await expect($container).toMatchElementSnapshot(`${this.name}-${tag}`, {
      disableBlinkingCursor: true,
      ...checkElementOptions
    });
  }

  private async getParentOrContainer(): Promise<WebdriverIO.Element | WebdriverIO.Browser> {
    if (this.container) {
      return this.container;
    }

    if (this.parent && typeof this.parent === 'string') {
      return $(this.parent).getElement();
    }

    if (this.parent && typeof this.parent !== 'string') {
      return this.parent;
    }

    return browser;
  }
}
