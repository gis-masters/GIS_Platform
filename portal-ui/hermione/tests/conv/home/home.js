/* global it */

const assert = require('chai').assert;

const HomePage = require('../../../objects/Home/Home.page');
const RegisterPage = require('../../../objects/Register/Register.page');
const LoginPage = require('../../../objects/Login/Login.page');
const Header = require('../../../objects/Header/Header.block');

describe('conv: Начальная страница', () => {
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
   *   Then главная страница выглядит как положено
   */
  it('Внешний вид', async function() {
    const homePage = new HomePage(this.browser);

    await homePage.assertSelfie();
  });

  /**
   * Scenario: Переход на страницу регистрации
   *   When пользователь заходит на главную страницу
   *   And  нажимает на кнопку "зарегистрироваться"
   *   Then открывается страница регистрации предприятия
   */
  it('Переход на страницу регистрации', async function() {
    const header = new Header(this.browser);
    const registerPage = new RegisterPage(this.browser);

    await header.clickRegButton();
    await registerPage.waitForVisible();
    await registerPage.testUrl();
  });

  /**
   * Scenario: Переход на страницу входа
   *   When пользователь заходит на главную страницу
   *   And  нажимает кнопку "Войти"
   *   Then открывается страница авторизации
   */
  it('Переход на страницу входа', async function() {
    const header = new Header(this.browser);
    const loginPage = new LoginPage(this.browser);

    await header.clickLoginButton();
    await loginPage.waitForVisible();
    await loginPage.testUrl();
  });
});
