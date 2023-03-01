import { Then, When } from '@wdio/cucumber-framework';

import { projects } from './Projects.block';

When(/^я нажимаю кнопку `Создать проект`$/, async () => {
  await projects.clickAddButton();
});

When(/^я навожу курсор на первый в списке проект$/, async () => {
  await projects.hoverFirstCard();
});

When(/^я нажимаю кнопку удаления первого проекта$/, async () => {
  await projects.clickFirstProjectDeleteButton();
});

When(/^нажимаю на кнопку подтверждения удаления проекта в появившемся диалоговом окне$/, async () => {
  await projects.clickDeleteYesButton();
});

When(/^я открываю форму создания проекта$/, async () => {
  await projects.openAddForm();
});

Then(/^появляется форма создания проекта$/, async () => {
  await projects.waitForProjectFormVisible();
});

Then(/^список проектов пуст$/, async () => {
  await projects.checkProjectListIsEmpty();
});

Then(/^кнопка удаления проекта отсутствует$/, async () => {
  await projects.checkDeleteButtonNotExist();
});

When(/^я создаю проект с названием "(.*)"$/, async (title: string) => {
  await projects.createProject(title);
});

When(/^я нажимаю на карточку проекта "(.*)" в списке проектов$/, async (title: string) => {
  await projects.clickCard(title);
});

When(/^в диалоговом окне создания проекта я нажимаю кнопку `Создать`$/, async () => {
  await projects.createProjectBtn();
});

Then(/^в списке проектов появляется "(.*)" и он доступен для взаимодействия$/, async (name: string) => {
  await projects.waitForProjectCardVisible(name);
});

Then(/^в списке проектов отображается только один проект "(.*)"$/, async (name: string) => {
  await projects.singleVisibleProject(name);
});

Then(/^в диалоговом окне создания проекта появляется сообщение об ошибке валидации$/, async () => {
  await projects.projectValidationError();
});

Then(/^проект "(.*)" удален$/, async (projectName: string) => {
  await projects.projectIsDeleted(projectName);
});
