import { Given, Then, When } from '@wdio/cucumber-framework';
import { DataTable } from '@cucumber/cucumber';

import { projectsBlock, sortDirections } from './Projects.block';
import { addBasemapToProject } from '../../commands/projects/addBasemapToProject';
import { ScenarioScope } from '../../ScenarioScope';
import { SourceType } from '../../../../src/app/services/data/basemaps/basemaps.models';

When(/^я нажимаю кнопку `Создать проект`$/, async () => {
  await projectsBlock.clickAddButton();
});

When(/^я навожу курсор на проект "(.*)"$/, async (title: string) => {
  await projectsBlock.hoverProjectCard(title);
});

When(/^я нажимаю кнопку удаления проекта "(.*)"$/, async (title: string) => {
  await projectsBlock.clickProjectDeleteButton(title);
});

When(/^нажимаю на кнопку подтверждения удаления проекта в появившемся диалоговом окне$/, async () => {
  await projectsBlock.clickDeleteYesButton();
});

When(/^я открываю форму создания проекта$/, async () => {
  await projectsBlock.openAddForm();
});

Then(/^появляется форма создания проекта$/, async () => {
  await projectsBlock.waitForProjectFormVisible();
});

Then(/^список проектов пуст$/, async () => {
  await projectsBlock.checkProjectListIsEmpty();
});

Then(/^кнопка удаления проекта "(.*)" отсутствует$/, async (title: string) => {
  const deleteBtn = await projectsBlock.isProjectCardDeleteButtonNotDisplayed(title);

  await expect(deleteBtn).toEqual(true);
});

When(/^я создаю проект с названием "(.*)"$/, async (title: string) => {
  await projectsBlock.createProject(title);
});

When(/^я нажимаю на карточку проекта "(.*)" в списке проектов$/, async (title: string) => {
  await projectsBlock.clickCard(title);
});

When(/^в форме создания проекта я нажимаю кнопку `Создать`$/, async () => {
  await projectsBlock.createProjectBtn();
});

When(/^на странице проектов в поле `Фильтр по названию` я ввожу значение "(.*)"$/, async (value: string) => {
  await projectsBlock.setProjectsFilerValue(value);
});

When(
  /^на странице проектов я выбираю сортировку по "(.*)" в поле `Сортировать по`$/,
  async (sortOptionName: string) => {
    const currentOptionName = await projectsBlock.projectSortTypeSelect(sortOptionName);

    await expect(currentOptionName).toEqual(sortOptionName);
  }
);

When('на странице проектов я выбираю направление сортировки {string}', async (direction: string) => {
  await projectsBlock.selectProjectSortingDescending(sortDirections[direction]);
});

Given('в текущий проект подключена пустая подложка', async function (this: ScenarioScope) {
  const whiteBasemap = {
    id: 1,
    name: 'empty',
    thumbnailUrn: '/assets/images/thumbnail-empty.jpg',
    title: 'Без подложки',
    type: SourceType.XYZ
  };

  await addBasemapToProject(this.latestProject, whiteBasemap);
});

Then(/^в списке проектов появляется "(.*)" и он доступен для взаимодействия$/, async (name: string) => {
  await projectsBlock.waitForProjectCardVisible(name);
});

Then(/^в списке проектов отображается один проект "(.*)"$/, async (name: string) => {
  const projectName = await projectsBlock.singleVisibleProject();

  await expect(projectName).toEqual(name);
});

Then(/^в списке проектов отображаются проекты:$/, async (names: DataTable) => {
  const currentProjectsNames = await projectsBlock.multipleVisibleProject();
  const projectsNames = names.raw().map(name => name[0]);

  await expect(currentProjectsNames).toEqual(projectsNames);
});

Then(/^сортировка проектов соответствует ожидаемому (".+"[ ,]*)+$/, async (names: string) => {
  const currentProjectsNames = await projectsBlock.multipleVisibleProject();
  const newNames = names.replaceAll(/^.|.$/g, '');

  await expect(currentProjectsNames).toEqual(newNames.slice(1, -1).split('", "'));
});

Then(/^в форме создания проекта появляется сообщение об ошибке валидации$/, async () => {
  await projectsBlock.projectValidationError();
});
