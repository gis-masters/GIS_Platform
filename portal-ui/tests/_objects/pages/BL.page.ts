import { Page } from '../Page';

class BLPage extends Page {
  title = 'Библиотека блоков';
  url = '';

  selectors = {
    container: '.StoryWrapper'
  };

  async openExample(story: string): Promise<void> {
    await browser.url(`iframe.html?id=${story}&viewMode=story`);
    await this.waitForVisible();
    await browser.pause(500); // отрисовка блока в storybook
    await browser.execute(() => {
      document.querySelector('html')?.classList.add('StoryDocument');
    });
  }
}

export const blPage = new BLPage();
