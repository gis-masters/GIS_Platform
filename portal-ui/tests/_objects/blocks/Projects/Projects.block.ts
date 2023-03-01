import { Block } from '../../Block';
import { projectForm } from '../ProjectsForm/ProjectsForm.block';
import { loading } from '../Loading/Loading.block';
import { getProjectsByTitleFromServer } from '../../commands/projects/getProjectsByTitleFromServer';

class Projects extends Block {
  selectors = {
    container: '.Projects',
    add: '.Projects-Add',
    firstCard: '.Projects-Card:first-child',
    firstCardDelete: '.Projects-Card:first-child .ProjectCard-Delete',
    cardDeleteYesButton: '.ProjectCard-DeleteDialogYes',
    projectsCards: '.Projects-Card'
  };

  async hoverFirstCard(): Promise<void> {
    const $firstCard = await this.$('firstCard');
    await $firstCard.moveTo();
  }

  async clickAddButton(): Promise<void> {
    const $add = await this.$('add');
    await $add.click();
  }

  async clickCard(name: string): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    const $$projectsCards = await this.$$('projectsCards');

    for (const $card of $$projectsCards) {
      const projectName = await this.getProjectCardText($card);

      if (projectName === name) {
        await $card.moveTo();
        await $card.click();

        break;
      }
    }
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

  async createProject(title: string) {
    await this.openAddForm();
    await projectForm.setInputValue(title);
    await projectForm.submit();
    await loading.waitForHidden();
  }

  async createProjectBtn() {
    await projectForm.submit();
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

  async singleVisibleProject(name: string): Promise<void> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    const $$projectsCards = await this.$$('projectsCards');

    expect($$projectsCards.length).toEqual(1);

    const projectName = await this.getProjectCardText($$projectsCards[0]);

    expect(projectName).toEqual(name);
  }

  async projectValidationError() {
    await projectForm.waitForErrors();
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

  async getProjectCardText($card: WebdriverIO.Element): Promise<string> {
    const $projectName = await $card.$('.ProjectCard-Name');

    return await $projectName.getText();
  }

  async projectIsDeleted(projectName: string): Promise<void> {
    const projects = await getProjectsByTitleFromServer(projectName);

    expect(projects.length).toEqual(0);
  }
}

export const projects = new Projects();
