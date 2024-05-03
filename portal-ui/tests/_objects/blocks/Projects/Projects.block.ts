import { SortOrder } from '../../../../src/app/services/models';
import { Block } from '../../Block';
import { loadingBlock } from '../Loading/Loading.block';
import { MuiSelectBlock } from '../MuiSelect/MuiSelect.block';
import { projectFormBlock } from '../ProjectsForm/ProjectsForm.block';
import { sortOrderButtonBlock } from '../SortOrderButtonBlock/SortOrderButtonBlock';

export const sortDirections: Record<string, SortOrder> = {
  'По возрастанию': SortOrder.ASC,
  'По убыванию': SortOrder.DESC
};

class ProjectsBlock extends Block {
  selectors = {
    container: '.Projects',
    add: '.Projects-Add',
    firstCard: '.Projects-Card:first-child',
    cardDeleteYesButton: '.ProjectCard-DeleteDialogYes',
    projectsCards: '.Projects-Card',
    projectsFilter: '.Projects-Filter input'
  };

  async hoverProjectCard(projectName: string): Promise<void> {
    const $projectCard = await this.getProjectCard(projectName);

    await $projectCard.moveTo();
  }

  async clickAddButton(): Promise<void> {
    const $add = await this.$('add');
    await $add.click();
  }

  async clickCard(projectName: string): Promise<void> {
    const $projectCard = await this.getProjectCard(projectName);

    await $projectCard.moveTo();
    await $projectCard.click();
  }

  async clickProjectDeleteButton(projectName: string): Promise<void> {
    const $cardDeleteBtn = await this.getProjectCardDeleteButton(projectName);
    await $cardDeleteBtn.click();
  }

  async clickDeleteYesButton(): Promise<void> {
    const $cardDeleteYesButton = await this.$('cardDeleteYesButton');
    await $cardDeleteYesButton.waitForDisplayed();
    await browser.pause(300); // анимация появления кнопки
    await $cardDeleteYesButton.click();
  }

  async openAddForm(): Promise<void> {
    await this.clickAddButton();
    await this.waitForProjectFormVisible();
  }

  async createProject(title: string) {
    await this.openAddForm();
    await projectFormBlock.setInputValue(title);
    await projectFormBlock.submit();
    await loadingBlock.waitForHidden();
  }

  async createProjectBtn() {
    await projectFormBlock.submit();
  }

  async waitForProjectFormVisible(): Promise<void> {
    await projectFormBlock.waitForVisible();
    await browser.pause(300); // анимация появления формы
  }

  async checkProjectListIsEmpty(): Promise<void> {
    const $firstCard = await this.$('firstCard');
    await $firstCard.waitForDisplayed({ reverse: true });
  }

  private async getProjectCardDeleteButton(projectName: string): Promise<WebdriverIO.Element> {
    const $projectCard = await this.getProjectCard(projectName);

    return await $projectCard.$('.ProjectCard-Delete');
  }

  async isProjectCardDeleteButtonNotDisplayed(projectName: string): Promise<boolean> {
    const $deleteBtn = await this.getProjectCardDeleteButton(projectName);

    return $deleteBtn.waitForDisplayed({ reverse: true });
  }

  async singleVisibleProject(): Promise<string> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    const $$projectsCards = await this.$$('projectsCards');

    await expect($$projectsCards.length).toEqual(1);

    return await this.getProjectCardText($$projectsCards[0]);
  }

  async projectValidationError() {
    await projectFormBlock.waitForErrors();
  }

  async waitForProjectCardVisible(name: string) {
    await loadingBlock.waitForGlobalHidden();

    const id = await browser.execute<string, [string]>(function (name) {
      const cards = [...window.document.querySelectorAll('.Projects-Card')];
      const card = cards.find(card => card.querySelector('.ProjectCard-Name')?.innerHTML === name);

      return card?.getAttribute('data-id') || '0';
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

  async setProjectsFilerValue(value: string): Promise<void> {
    const $projectsFilter = await this.$('projectsFilter');
    await $projectsFilter.waitForDisplayed();

    await $projectsFilter.setValue(value);
  }

  async getProjectCard(name: string): Promise<WebdriverIO.Element> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    const $$projectsCards = await this.$$('projectsCards');

    for (const $card of $$projectsCards) {
      const projectName = await this.getProjectCardText($card);

      if (projectName === name) {
        return $card;
      }
    }

    throw new Error(`Не найден проект "${name}"`);
  }

  async multipleVisibleProject(): Promise<string[]> {
    const $container = await this.$('container');
    await $container.waitForDisplayed();

    const $$projectsCards = await this.$$('projectsCards');
    const currentProjectsNames: string[] = [];

    for (const $card of $$projectsCards) {
      const cardName = await this.getProjectCardText($card);
      currentProjectsNames.push(cardName);
    }

    return currentProjectsNames;
  }

  async projectSortTypeSelect(sortOptionName: string): Promise<string> {
    const muiSelect = new MuiSelectBlock('.Projects-SortBy');
    await muiSelect.selectOptionByTitle(sortOptionName);

    return await muiSelect.getText();
  }

  async selectProjectSortingDescending(direction: SortOrder): Promise<void> {
    await sortOrderButtonBlock.waitForVisible();
    await sortOrderButtonBlock.setSortOrder(direction);
  }
}

export const projectsBlock = new ProjectsBlock();
