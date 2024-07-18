import { Then, When } from '@wdio/cucumber-framework';

import { projectActionsBlock } from './ProjectActions.block';

When('я нажимаю кнопку удалить в панели свойств проекта', async () => {
  await projectActionsBlock.clickDeleteBtn();
});

Then('в панели свойств проекта нет кнопки удаления', async () => {
  await projectActionsBlock.deleteBtnNotExist();
});

Then('в панели свойств проекта нет кнопки редактирования', async () => {
  await projectActionsBlock.editBtnNotExist();
});

When('я нажимаю на кнопку подтверждения удаления проекта в появившемся диалоговом окне', async () => {
  await projectActionsBlock.confirmDeletion();
});

When('я открываю карточку редактирования проекта', async () => {
  await projectActionsBlock.clickEditBtn();
});

When(
  'в карточке редактирования проекта я изменяю значение поля {string} на {string}',
  async (field: string, value: string) => {
    await projectActionsBlock.editProject(field, value);
  }
);
