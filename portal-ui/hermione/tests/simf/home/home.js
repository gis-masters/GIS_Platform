const HomePage = require('../../../objects/Home/Home.page');

describe('simf: Начальная страница', () => {
  beforeEach(async function () {
    const homePage = new HomePage(this.browser);

    await homePage.open();
    await homePage.waitForVisible();

    // TODO: удалить, когда будет сделана #135
    await this.browser.pause(2000);
  });

  /**
   * Scenario: Переход на страницу регистрации
   *   When пользователь заходит на главную страницу
   *   Then главная страница выглядит как форма логина
   */
  it('Внешний вид', async function() {
    const homePage = new HomePage(this.browser);

    await homePage.assertSelfie();
  });
});
