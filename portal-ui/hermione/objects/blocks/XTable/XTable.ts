import { Block } from '../../Block';

export class XTable extends Block {
  selectors = {
    container: '.XTable',
    filterEnabler: '.TableOverHead-FilterButton'
  };

  async enableFilters(): Promise<void> {
    const $filterEnabler = await this.getElement('filterEnabler');

    await $filterEnabler.click();
    await $filterEnabler.waitForDisplayed({ timeoutMsg: 'Не появляется фильтр' });
  }

  async waitForVisible(): Promise<void> {
    const $container = await this.getElement('container');

    await $container.waitForDisplayed({ timeout: 2000, timeoutMsg: 'Не появляется таблица' });
  }

  async assertSelfie(state: string = 'plain'): Promise<void> {
    const { container } = this.selectors;

    return await this.browser.assertView(state, container);
  }
}
