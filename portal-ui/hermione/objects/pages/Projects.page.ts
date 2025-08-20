import { Page } from '../Page';

export class ProjectsPage extends Page {
  selectors = {
    container: '.Projects'
  };

  url = 'projects';

  async waitForVisible() {
    const $container = await this.getElement('container');

    return $container.waitForDisplayed({ timeout: 5000, timeoutMsg: 'Не появилась страница проектов' });
  }
}
