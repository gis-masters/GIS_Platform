import { Test, TestDefinitionCallback } from 'hermione';

import { HomePage } from '../../../objects/pages/Home.page';
import { Toast } from '../../../objects/blocks/Toast/Toast';

declare const beforeEach: (callback?: TestDefinitionCallback) => Test;

describe('Нотификация пользователя при непредвиденных ошибках', () => {
  beforeEach(async function () {
    const homePage = new HomePage(this.browser);
    const toast = new Toast(this.browser);

    await homePage.open();
    await homePage.waitForVisible();
    await toast.produceError();
    await toast.waitForVisible();
  });

  /**
   * Scenario: возникновение ошибки
   *   When пользователь заходит на главную страницу
   *   Given возникает ошибка
   *   Then появляется нотификация
   *   Then нотификация выглядит как положено
   */
  it('Внешний вид', async function () {
    const toast = new Toast(this.browser);

    await toast.assertSelfie();
  });

  /**
   * Scenario: подробности ошибки
   *   When пользователь заходит на главную страницу
   *   Given возникает ошибка
   *   Then появляется нотификация
   *   When пользователь нажимает на ссылку "Подробнее"
   *   Then появляются подробности ошибки
   *   Then нотификация с подробностями выглядит как положено
   *   When пользователь нажимает на ссылку "Скрыть подробности"
   *   Then исчезают подробности ошибки
   */
  it('Подробности', async function () {
    const toast = new Toast(this.browser);

    await toast.clickMoar();
    await toast.waitForDetails();
    await toast.mockErrorFile();
    await toast.assertSelfie();
    await toast.clickMoar();
    await toast.waitForDetailsHidden();
  });

  /**
   * Scenario: закрытие ошибки
   *   When пользователь заходит на главную страницу
   *   Given возникает ошибка
   *   Then появляется нотификация
   *   When пользователь нажимает на кнопку "Закрыть"
   *   Then исчезает нотификация
   */
  it('Закрытие', async function () {
    const toast = new Toast(this.browser);

    await toast.clickClose();
    await toast.waitForHidden();
  });
});
