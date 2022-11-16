import { Test, TestDefinitionCallback } from 'hermione';
import { assert } from 'chai';

import { authenticateAsOwner } from '../../../objects/commands/authenticate';
import { ProjectsPage } from '../../../objects/pages/Projects.page';
import { Projects } from '../../../objects/blocks/Projects/Projects';
import { generateRandomId } from '../../../../src/app/services/util/randomId';
import { ProjectForm } from '../../../objects/blocks/ProjectForm/ProjectForm';

declare const beforeEach: (callback?: TestDefinitionCallback) => Test;

describe('Проекты', function () {
  describe('Создание', function () {
    /**
     * Background:
     * Given Существует организация и учетная запись
     * Given Пользователь авторизован как администратор
     * Given Пользователь находится на странице "/projects"
     */
    beforeEach(async function () {
      const projectsPage = new ProjectsPage(this.browser);
      await this.browser.pause(500);
      await authenticateAsOwner(this.browser, projectsPage);
      await projectsPage.waitForVisible();
    });

    /**
     * Scenario: Пользователь может создать проект с валидными данными
     *   When пользователь создаёт проект через форму создания проекта
     *   Then созданный проект появляется в списке проектов
     */
    it('Пользователь может создать проект с валидными данными', async function () {
      const projects = new Projects(this.browser);

      const title = 'test_title_' + generateRandomId();
      await projects.createProject(title);
      await projects.waitForProjectCardVisible(title);
    });

    /**
     * Scenario: Пользователь не может создать проект с невалидными данными
     *   When пользователь открывает форму создания проекта
     *   And вводит невалидное значение в поле ввода
     *   And нажимает кнопку "Создать"
     *   Then появляется текст ошибки
     */
    it('Пользователь не может создать проект с невалидными данными', async function () {
      const projects = new Projects(this.browser);
      const projectForm = new ProjectForm(this.browser);

      const title = '//';
      await projects.createProject(title);
      assert.isNotEmpty(await projectForm.getErrors());
    });
  });
});
