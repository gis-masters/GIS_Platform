import { Then, When } from '@wdio/cucumber-framework';

import { projectActionsBlock } from './ProjectActions.block';

When('я нажимаю кнопку удалить в панели свойств проекта', async () => {
  await projectActionsBlock.clickDeleteBtn();
});

When('я нажимаю кнопку удалить в панели свойств папки проекта', async () => {
  await projectActionsBlock.clickDeleteBtn();
});

When('я нажимаю кнопку `Переместить` в панели свойств папки проекта', async () => {
  await projectActionsBlock.clickMoveBtn();
});

Then('в панели свойств проекта нет кнопки удаления', async () => {
  await projectActionsBlock.deleteBtnNotExist();
});

Then('в панели свойств папки проекта нет кнопки удаления', async () => {
  await projectActionsBlock.deleteBtnNotExist();
});

Then('в панели свойств проекта нет кнопки редактирования', async () => {
  await projectActionsBlock.editBtnNotExist();
});

Then('в панели свойств папки проекта нет кнопки редактирования', async () => {
  await projectActionsBlock.editBtnNotExist();
});

When('я открываю карточку редактирования проекта', async () => {
  await projectActionsBlock.clickEditBtn();
});

When('я открываю карточку редактирования папки проекта', async () => {
  await projectActionsBlock.clickEditBtn();
});

When(
  'в карточке редактирования проекта я изменяю значение поля {string} на {string}',
  async (field: string, value: string) => {
    await projectActionsBlock.editProject(field, value);
  }
);
