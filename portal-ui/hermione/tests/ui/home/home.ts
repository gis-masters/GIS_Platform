import { Test, TestDefinitionCallback } from 'hermione';

import { HomePage } from '../../../objects/pages/Home.page';
import { RegisterPage } from '../../../objects/pages/Register.page';
import { Header } from '../../../objects/blocks/Header/Header';

declare const beforeEach: (callback?: TestDefinitionCallback) => Test;

describe('Начальная страница', () => {
  beforeEach(async function () {
    const homePage = new HomePage(this.browser);

    await homePage.open();
    await homePage.waitForVisible();
    await this.browser.pause(500);
  });

  /**
   * Scenario: Внешний
   *   When пользователь заходит на главную страницу
   *   Then главная страница выглядит как положено
   */
  it('Внешний вид', async function () {
    const homePage = new HomePage(this.browser);

    await homePage.assertSelfie();
  });

  /**
   * Scenario: Переход на страницу регистрации
   *   When пользователь заходит на главную страницу
   *   And  нажимает на кнопку "зарегистрироваться"
   *   Then открывается страница регистрации предприятия
   */
  it('Переход на страницу регистрации', async function () {
    const header = new Header(this.browser);
    const registerPage = new RegisterPage(this.browser);

    await header.clickRegButton();
    await registerPage.waitForVisible();
    await registerPage.testUrl();
  });
});
