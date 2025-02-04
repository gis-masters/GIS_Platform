import { Page } from '../Page';

export class BLPage extends Page {
  selectors = {
    storyWrapper: '.StoryWrapper'
  };

  url = '/bl/';

  async openExample(blockName: string, storyName: string): Promise<void> {
    await this.browser.url(`${this.url}iframe.html?id=${blockName}--${storyName}&viewMode=story`);
    const $storyWrapper = await this.getElement('storyWrapper');
    await $storyWrapper.waitForDisplayed();
  }
}
