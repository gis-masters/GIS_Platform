import { Page } from '../classes/Page';

class BLPage extends Page {
  title = 'Библиотека блоков';
  url = '';

  selectors = {
    root: '.StoryWrapper',
    loader: '.StoryWrapper .Loading'
  };

  async openExample(story: string): Promise<void> {
    await browser.url(`iframe.html?id=${story}&viewMode=story`);
    await this.waitForVisible();
    await browser.pause(500); // отрисовка блока в storybook
    await this.markStoryDocument();
  }

  async openExampleWithQuery(story: string, query: Record<string, string>): Promise<void> {
    const url = new URL('iframe.html', 'http://placeholder/');
    url.searchParams.set('id', story);
    url.searchParams.set('viewMode', 'story');
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }

    await browser.url(`${url.pathname.slice(1)}${url.search}`);
    await this.waitForVisible();
    await this.markStoryDocument();
  }

  async refresh(): Promise<void> {
    await browser.refresh();
    await this.waitForVisible();
    await this.markStoryDocument();
  }

  async goBack(): Promise<void> {
    await browser.back();
    await this.waitUntilStoryReadyAfterHistory();
  }

  async goForward(): Promise<void> {
    await browser.forward();
    await this.waitUntilStoryReadyAfterHistory();
  }

  private async waitUntilStoryReadyAfterHistory(): Promise<void> {
    await browser.waitUntil(
      async () => {
        try {
          await this.waitForVisible();
          await this.waitForLoading();

          return true;
        } catch {
          return false;
        }
      },
      {
        timeoutMsg: 'Страница библиотеки блоков не загрузилась после навигации по истории'
      }
    );
  }

  private async markStoryDocument(): Promise<void> {
    await browser.execute(() => {
      document.querySelector('html')?.classList.add('StoryDocument');
    });
  }
}

export const blPage = new BLPage();
