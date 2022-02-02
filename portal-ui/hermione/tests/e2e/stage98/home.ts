import { Test, TestDefinitionCallback } from 'hermione';

import { HomePage } from '../../../objects/pages/Home.page';

declare const beforeEach: (callback?: TestDefinitionCallback) => Test;

describe('staging: Начальная страница', () => {
  beforeEach(async function () {
    const homePage = new HomePage(this.browser);

    await homePage.open();
    await homePage.waitForVisible();
    await this.browser.pause(500);
  });

  /**
   * Scenario: Переход на страницу регистрации
   *   When пользователь заходит на главную страницу
   *   Then главная страница выглядит как главная страница
   */
  it('Внешний вид', async function () {
    const homePage = new HomePage(this.browser);

    await homePage.assertSelfie();
  });
});
