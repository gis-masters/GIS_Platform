import { Test, TestDefinition, TestDefinitionCallback } from 'hermione';

import { HomePage } from '../../../objects/pages/Home.page';
import { ProjectsPage } from '../../../objects/pages/Projects.page';
import { LoginForm } from '../../../objects/blocks/LoginForm/LoginForm';
import { mockOauthToken } from '../_mock/oauthToken';
import { mockUsersCurrent } from '../_mock/usersCurrent';
import { mockProjects } from '../_mock/projects';
import { mockSettings } from '../_mock/settings';
import { mockKnownSettings } from '../_mock/knownSettings';

interface TestDefinitionWithOnly extends TestDefinition {
  only: TestDefinition;
}

declare const beforeEach: (callback?: TestDefinitionCallback) => Test;
declare const it: TestDefinitionWithOnly;

describe('Авторизация', () => {
  /**
   * Background: 
   *   Given Существует организация и учетная запись с данными
        | E-mail        | Пароль        |
        | hermione@test | Avadakedavra1 |
   *   Given пользователь зашёл на страницу авторизации
   */
  beforeEach(async function () {
    const homePage = new HomePage(this.browser);

    await homePage.open();
    await homePage.waitForVisible();
  });

  /**
   * Scenario: Успешный вход
   *   When пользователь заполняет поля логина и пароля
   *   And нажимает кнопку "Войти"
   *   Then открывается страница проектов
   */
  it('Успешный вход', async function () {
    await mockOauthToken(this.browser);
    await mockUsersCurrent(this.browser);
    await mockProjects(this.browser);
    await mockSettings(this.browser);
    await mockKnownSettings(this.browser);

    const loginForm = new LoginForm(this.browser);
    await loginForm.login('hermione@test', 'Avadakedavra1');
    const projectsPage = new ProjectsPage(this.browser);
    await projectsPage.waitForVisible();
    await projectsPage.testUrl();
  });
});
