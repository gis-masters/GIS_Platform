import { binding, then, when } from 'cucumber-tsflow/dist';

import { Block, BlockModel } from '../../Block';
import { projectForm } from '../ProjectsForm/ProjectsForm.block';
import { loading } from '../Loading/Loading.block';

@binding()
class Projects extends Block implements BlockModel {
  get $container(): Promise<WebdriverIO.Element> {
    return $('.Projects');
  }

  get $add(): Promise<WebdriverIO.Element> {
    return $('.Projects-Add');
  }

  get $firstCard(): Promise<WebdriverIO.Element> {
    return $('.Projects-Card:first-child');
  }

  get $firstCardDelete(): Promise<WebdriverIO.Element> {
    return $('.Projects-Card:first-child .ProjectCard-Delete');
  }

  get $cardDeleteYesButton(): Promise<WebdriverIO.Element> {
    return $('.ProjectCard-DeleteDialogYes');
  }

  @when(/^я нажимаю кнопку `Создать проект`$/)
  async clickAddButton(): Promise<void> {
    const $add = await this.$add;
    await $add.click();
  }

  @when(/^я навожу курсор на первый в списке проект$/)
  async hoverFirstCard(): Promise<void> {
    const $firstCard = await this.$firstCard;
    await $firstCard.moveTo();
  }

  @when(/^я нажимаю кнопку удаления первого проекта$/)
  async clickFirstProjectDeleteButton(): Promise<void> {
    const $firstCardDelete = await this.$firstCardDelete;
    await $firstCardDelete.click();
  }

  @when(/^нажимаю на кнопку подтверждения удаления проекта в появившемся диалоговом окне$/)
  async clickDeleteYesButton(): Promise<void> {
    const $cardDeleteYesButton = await this.$cardDeleteYesButton;
    await $cardDeleteYesButton.waitForDisplayed();
    await browser.pause(300);
    await $cardDeleteYesButton.click();
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

  @then(/^список проектов пуст$/)
  async checkProjectListIsEmpty(): Promise<void> {
    const $firstCard = await this.$firstCard;
    await $firstCard.waitForDisplayed({ reverse: true });
  }

  @then(/^кнопка удаления проекта отсутствует$/)
  async checkDeleteButtonNotExist(): Promise<void> {
    await expect(this.$firstCardDelete).not.toBeDisplayed();
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
