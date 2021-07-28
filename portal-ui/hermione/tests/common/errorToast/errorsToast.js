/* global it */

const assert = require('chai').assert;

const HomePage = require('../../../objects/Home/Home.page');
const Toast = require('../../../objects/Toast/Toast.block');

describe('common: Нотификация пользователя при непредвиденных ошибках', () => {
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
   * Scenario: возникновение ошибки
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
});
