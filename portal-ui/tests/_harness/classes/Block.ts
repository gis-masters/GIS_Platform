import type { WdioCheckElementMethodOptions } from '@wdio/visual-service/dist/types';

interface Selectors {
  [key: string]: string;
  root: string;
}

export abstract class Block<S extends Selectors = Selectors> {
  abstract selectors: S;
  protected parent: string | WebdriverIO.Element | null;
  private readonly root?: WebdriverIO.Element;

  get name(): string {
    return this.constructor.name.replace(/Block$/, '');
  }

  constructor(parent: string | WebdriverIO.Element | null = null, root?: WebdriverIO.Element) {
    this.root = root;
    this.parent = parent;
  }

  protected async findBySelector(key: keyof this['selectors']): Promise<WebdriverIO.Element> {
    if (key === 'root' && this.root) {
      return this.root;
    }

    const $parent = await this.getParentOrRoot();

    return $parent.$(this.selectors[key]).getElement();
  }

  protected async findAllBySelector(key: keyof this['selectors']): Promise<WebdriverIO.ElementArray> {
    const $parent = await this.getParentOrRoot();

    return $parent.$$(this.selectors[key]).getElements();
  }

  async waitForExist(): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForExist();
  }

  async waitForVisible(): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForDisplayed();
  }

  async waitForHidden(): Promise<void> {
    const $root = await this.findBySelector('root');
    await $root.waitForExist({ reverse: true });
  }

  async isExisting(): Promise<boolean> {
    const $root = await this.findBySelector('root');

    return $root.isExisting();
  }

  async assertSelfie(tag = 'plain', checkElementOptions: WdioCheckElementMethodOptions = {}): Promise<void> {
    const $root = await this.findBySelector('root');

    await expect($root).toMatchElementSnapshot(`${this.name}-${tag}`, {
      disableBlinkingCursor: true,
      ...checkElementOptions
    });
  }

  async waitForLoading(): Promise<void> {
    if (!this.selectors.loader) {
      throw new Error('Чтобы использовать waitForLoading заведи селектор loader');
    }

    const loader = await this.findBySelector('loader');
    try {
      await loader.waitForDisplayed({ timeout: 1000 });
    } catch {
      // ignore
    }
    await loader.waitForDisplayed({ reverse: true });
  }

  private async getParentOrRoot(): Promise<WebdriverIO.Element | WebdriverIO.Browser> {
    if (this.root) {
      return this.root;
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
