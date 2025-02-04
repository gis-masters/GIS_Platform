import { Block } from '../../Block';
import { Loading } from '../Loading/Loading';
import { ProjectForm } from '../ProjectForm/ProjectForm';

export class Projects extends Block {
  selectors = {
    container: '.Projects',
    add: '.Projects-Add'
  };

  async waitForVisible(): Promise<void> {
    const $container = await this.getElement('container');

    await $container.waitForDisplayed({ timeout: 2000, timeoutMsg: 'Не появляется список проектов' });
  }

  async openAddForm(): Promise<void> {
    const projectForm = new ProjectForm(this.browser);

    await this.clickAddButton();
    await projectForm.waitForVisible();
  }

  async clickAddButton(): Promise<void> {
    const $add = await this.getElement('add');
    await $add.click();
  }

  async createProject(title: string) {
    const projectForm = new ProjectForm(this.browser);
    const loading = new Loading(this.browser);

    await this.openAddForm();
    await projectForm.setInputValue(title);
    await projectForm.submit();
    await loading.waitForHidden();
    await this.browser.pause(1000);
  }

  async waitForProjectCardVisible(name: string) {
    const id = await this.browser.execute(function (name) {
      return [...window.document.querySelectorAll('.Projects-Card')]
        .find(card => card.querySelector('.ProjectCard-Name')?.innerHTML === name)
        ?.getAttribute('data-id');
    }, name);

    const $projectCard = await this.browser.$(`.ProjectCard[data-id="${id}"]`);
    await $projectCard.waitForClickable({ timeout: 5000, timeoutMsg: `Не появился проект ${name}[${id}]` });
  }

  async assertSelfie(state: string = 'plain'): Promise<void> {
    const { container } = this.selectors;

    return await this.browser.assertView(state, container);
  }
}
