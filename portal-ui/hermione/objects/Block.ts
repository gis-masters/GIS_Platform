/// <reference path='../../node_modules/hermione/typings/webdriverio/index.d.ts' />

export class Block<S extends Record<string, string> = Record<string, string>> {
  protected browser: WebdriverIO.Browser;

  parentSelector: string;

  selectors: Partial<S> = {};

  constructor(browser: WebdriverIO.Browser, parentSelector: string = '') {
    this.browser = browser;
    this.parentSelector = parentSelector;
  }

  async getElement(key: keyof this['selectors']): Promise<WebdriverIO.Element> {
    return await this.browser.$((this.parentSelector || '') + String(this.selectors[key]));
  }

  async getElementsList(keys: (keyof this['selectors'])[]): Promise<WebdriverIO.Element[]> {
    return await Promise.all(keys.map(key => this.getElement(key)));
  }

  async getElements(key: keyof this['selectors']): Promise<WebdriverIO.Element[]> {
    return await this.browser.$$((this.parentSelector || '') + String(this.selectors[key]));
  }

  async getSubElement(element: WebdriverIO.Element, key: keyof this['selectors']): Promise<WebdriverIO.Element> {
    return await element.$((this.parentSelector || '') + String(this.selectors[key]));
  }

  async getSubElements(element: WebdriverIO.Element, key: keyof this['selectors']): Promise<WebdriverIO.Element[]> {
    return await element.$$((this.parentSelector || '') + String(this.selectors[key]));
  }
}
