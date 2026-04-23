import { type DataTable } from '@cucumber/cucumber';
import { Given, Then, When } from '@wdio/cucumber-framework';

import { SourceType } from '../../../../src/app/services/data/basemaps/basemaps.models';
import { addBasemapToProject } from '../../commands/projects/addBasemapToProject';
import { type ScenarioScope } from '../../ScenarioScope';
import { projectsBlock, sortDirections } from './Projects.block';

Then(/^появляется форма создания проекта$/, async () => {
  await projectsBlock.waitForProjectFormVisible();
});

Then(/^список проектов пуст$/, async () => {
  await projectsBlock.checkProjectListIsEmpty();
});

When(/^я нажимаю на карточку проекта "(.*)" в списке проектов$/, async (title: string) => {
  await projectsBlock.clickCard(title);
});

When('я нажимаю на карточку папки проекта {string} в списке проектов', async (projectFolderName: string) => {
  await projectsBlock.clickFolderCard(projectFolderName);
});

When(/^на странице проектов в поле `Фильтр по названию` я ввожу значение "(.*)"$/, async (value: string) => {
  await projectsBlock.setProjectsFilerValue(value);
});

When(
  /^на странице проектов я выбираю сортировку по "(.*)" в поле `Сортировать по`$/,
  async (sortOptionName: string) => {
    const currentOptionName = await projectsBlock.projectSortTypeSelect(sortOptionName);

    expect(currentOptionName).toEqual(sortOptionName);
  }
);

When('на странице проектов я выбираю направление сортировки {string}', async (direction: string) => {
  await projectsBlock.selectProjectSortingDescending(sortDirections[direction]);
});

When('я жду отображения страницы проектов', async () => {
  await projectsBlock.waitForExist();
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

  expect(projectName).toEqual(name);
});

Then(/^в списке проектов отображаются проекты:$/, async (names: DataTable) => {
  const currentProjectsNames = await projectsBlock.multipleVisibleProject();
  const projectsNames = names.raw().map(name => name[0]);

  expect(currentProjectsNames).toEqual(projectsNames);
});

Then('я перешел на страницу созданной папки проектов', async function (this: ScenarioScope) {
  const folder = this.latestProjectFolder;
  const currentFolder = await projectsBlock.currentFolder();

  expect([folder.name, String(folder.id)]).toEqual(currentFolder);
});

Then('в хлебных крошках отображается {string} и {string}', async function (firstFolder: string, secondFolder: string) {
  const currentFolderBreadcrumbsPath = await projectsBlock.currentFolderBreadcrumbsPath();

  // первый элемент - иконка корневой папки
  expect(['', firstFolder, secondFolder]).toEqual(currentFolderBreadcrumbsPath);
});

// eslint-disable-next-line sonarjs/slow-regex -- в тестах нам это не страшно
Then(/^сортировка проектов соответствует ожидаемому (".+"[ ,]*)+$/, async (names: string) => {
  const currentProjectsNames = await projectsBlock.multipleVisibleProject();
  const newNames = names.replaceAll(/^.|.$/g, '');

  expect(currentProjectsNames).toEqual(newNames.slice(1, -1).split('", "'));
});
