import { Test, TestDefinition, TestDefinitionCallback } from 'hermione';

import { LoginPage } from '../../../objects/pages/Login.page';
import { ProjectsPage } from '../../../objects/pages/Projects.page';
import { LoginForm } from '../../../objects/blocks/LoginForm/LoginForm';
import { mockOauthToken } from '../_mock/oauthToken';
import { mockUsersCurrent } from '../_mock/usersCurrent';
import { mockProjects } from '../_mock/projects';

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
    const loginPage = new LoginPage(this.browser);

    await loginPage.open();
    await loginPage.waitForVisible();
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

    const loginForm = new LoginForm(this.browser);
    await loginForm.login('hermione@test', 'Avadakedavra1');
    const projectsPage = new ProjectsPage(this.browser);
    await projectsPage.waitForVisible();
    await projectsPage.testUrl();
  });
});
