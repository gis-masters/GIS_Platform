import { binding, then, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';
import { projectForm } from '../ProjectForm/ProjectForm.block';
import { loading } from '../Loading/Loading.block';

@binding()
class Projects extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.Projects');
  }

  get $add(): Promise<WebdriverIO.Element> {
    return $('.Projects-Add');
  }

  @when(/^я нажимаю кнопку `Создать проект`$/)
  async clickAddButton(): Promise<void> {
    const $add = await this.$add;
    await $add.click();
  }

  @when(/^я открываю форму создания проекта$/)
  async openAddForm(): Promise<void> {
    await this.clickAddButton();
    await this.waitForProjectFormVisible();
  }

  @then(/^появляется форма создания проекта$/)
  async waitForProjectFormVisible(): Promise<void> {
    await projectForm.waitForVisible();
    await browser.pause(400);
  }

  @when(/^я создаю проект с названием "(.*)"$/)
  async createProject(title: string) {
    await this.openAddForm();
    await projectForm.setInputValue(title);
    await projectForm.submit();
    await loading.waitForHidden();
    await browser.pause(1000);
  }

  @then(/^в списке проектов появляется "(.*)" и он доступен для взаимодействия$/)
  async waitForProjectCardVisible(name: string) {
    const id = await browser.execute(function (name) {
      return [...window.document.querySelectorAll('.Projects-Card')]
        .find(card => card.querySelector('.ProjectCard-Name')?.innerHTML === name)
        ?.getAttribute('data-id');
    }, name);

    const $projectCard = await browser.$(`.ProjectCard[data-id="${id}"]`);
    await $projectCard.waitForClickable({ timeout: 5000, timeoutMsg: `Не появился проект ${name}[${id}]` });
  }
}

export const projects = new Projects();
