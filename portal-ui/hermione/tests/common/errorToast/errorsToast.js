/* global it */

const assert = require('chai').assert;

const HomePage = require('../../../objects/Home/Home.page');
const ToastError = require('../../../objects/ToastError/ToastError.block');

describe('common: Нотификация пользователя при непредвиденных ошибках', () => {
  beforeEach(async function () {
    const homePage = new HomePage(this.browser);
    const toastError = new ToastError(this.browser);

    await homePage.open();
    await homePage.waitForVisible();
    await toastError.produceError();
    await toastError.waitForVisible();
  });

  /**
   * Scenario: возникновение ошибки
   *   When пользователь заходит на главную страницу
   *   Given возникает ошибка
   *   Then появляется нотификация
   *   Then нотифификация выглядит как положено
   */
  it('Внешний вид', async function() {
    const toastError = new ToastError(this.browser);

    await toastError.assertSelfie();
  });

  /**
   * Scenario: возникновение ошибки
   *   When пользователь заходит на главную страницу
   *   Given возникает ошибка
   *   Then появляется нотификация
   *   When пользователь нажимает на ссылку "Подробнее"
   *   Then появляются подробности ошибки
   *   Then нотифификация с подробностями выглядит как положено
   *   When пользователь нажимает на ссылку "Скрыть подробности"
   *   Then исчезают подробности ошибки
   */
  it('Подробности', async function() {
    const toastError = new ToastError(this.browser);

    await toastError.clickMoar();
    await toastError.waitForDetails();
    await toastError.assertSelfie();
    await toastError.clickMoar();
    await toastError.waitForDetailsHidden();
  });
});
