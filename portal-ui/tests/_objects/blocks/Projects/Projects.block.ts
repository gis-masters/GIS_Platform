import { Block } from '../../Block';
import { projectForm } from '../ProjectsForm/ProjectsForm.block';
import { loading } from '../Loading/Loading.block';

class Projects extends Block {
  selectors = {
    container: '.Projects',
    add: '.Projects-Add',
    firstCard: '.Projects-Card:first-child',
    firstCardDelete: '.Projects-Card:first-child .ProjectCard-Delete',
    cardDeleteYesButton: '.ProjectCard-DeleteDialogYes'
  };

  async clickAddButton(): Promise<void> {
    const $add = await this.$('add');
    await $add.click();
  }

  async hoverFirstCard(): Promise<void> {
    const $firstCard = await this.$('firstCard');
    await $firstCard.moveTo();
  }

  async clickFirstProjectDeleteButton(): Promise<void> {
    const $firstCardDelete = await this.$('firstCardDelete');
    await $firstCardDelete.click();
  }

  async clickDeleteYesButton(): Promise<void> {
    const $cardDeleteYesButton = await this.$('cardDeleteYesButton');
    await $cardDeleteYesButton.waitForDisplayed();
    await browser.pause(300);
    await $cardDeleteYesButton.click();
  }

  async openAddForm(): Promise<void> {
    await this.clickAddButton();
    await this.waitForProjectFormVisible();
  }

  async waitForProjectFormVisible(): Promise<void> {
    await projectForm.waitForVisible();
    await browser.pause(400);
  }

  async checkProjectListIsEmpty(): Promise<void> {
    const $firstCard = await this.$('firstCard');
    await $firstCard.waitForDisplayed({ reverse: true });
  }

  async checkDeleteButtonNotExist(): Promise<void> {
    await expect(this.$('firstCardDelete')).not.toBeDisplayed();
  }

  async createProject(title: string) {
    await this.openAddForm();
    await projectForm.setInputValue(title);
    await projectForm.submit();
    await loading.waitForHidden();
    await browser.pause(1000);
  }

  async waitForProjectCardVisible(name: string) {
    const id = await browser.execute(function (name) {
      return [...window.document.querySelectorAll('.Projects-Card')]
        .find(card => card.querySelector('.ProjectCard-Name')?.innerHTML === name)
        ?.getAttribute('data-id');
    }, name);

    if (id) {
      const $projectCard = await browser.$(`.ProjectCard[data-id="${id}"]`);
      await $projectCard.waitForClickable({ timeout: 5000, timeoutMsg: `Не появился проект ${name}[${id}]` });
    } else {
      throw new Error(`Не найден проект "${name}"`);
    }
  }
}

export const projects = new Projects();
