import { Then, When } from '@wdio/cucumber-framework';

import { answerModalTypeFormPromptBlock } from './_type/AnswerModal_type_formPrompt.block';
import { answerModalBlock } from './AnswerModal.block';

When('в появившемся диалоговом окне подтверждения нажимаю на кнопку {string}', async (title: string) => {
  await answerModalBlock.clickButtonByTitle(title);
});

When('в диалоге с формой нажимаю кнопку отправки', async () => {
  await answerModalTypeFormPromptBlock.submit();
});

When('в диалоге с формой кнопкой выбора действия выбираю {string}', async (splitMenuLabel: string) => {
  await answerModalTypeFormPromptBlock.submitFromSplitMenu(splitMenuLabel);
});

When('жду отображения диалогового окна', async () => {
  await answerModalBlock.waitForVisible();
});

Then('отобразилось диалоговое окно', async () => {
  await answerModalBlock.waitForVisible();
});

Then('я дожидаюсь исчезновения диалогового окна', async () => {
  await answerModalBlock.waitForHidden();
});

Then('отобразилось диалоговое окно с текстом {string}', async (content: string) => {
  const result = await answerModalBlock.getText();

  expect(result).toBe(content);
});
