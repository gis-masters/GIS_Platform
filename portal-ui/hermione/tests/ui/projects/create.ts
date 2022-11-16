import { assert } from 'chai';
import { Test, TestDefinition, TestDefinitionCallback } from 'hermione';
import { generateRandomId } from '../../../../src/app/services/util/randomId';

import { ProjectForm } from '../../../objects/blocks/ProjectForm/ProjectForm';
import { Projects } from '../../../objects/blocks/Projects/Projects';
import { BLPage } from '../../../objects/pages/BL.page';

interface TestDefinitionWithOnly extends TestDefinition {
  only: TestDefinition;
}

declare const beforeEach: (callback?: TestDefinitionCallback) => Test;
declare const it: TestDefinitionWithOnly;

describe('Проекты', () => {
  describe('Создание', function () {
    /**
     * Background:
     * Given открыта страница списка проектов в библиотеке блоков (/bl/?path=/story/projects--regular)
     */
    beforeEach(async function () {
      const bl = new BLPage(this.browser);
      await bl.openExample('projects', 'regular');
      await this.browser.pause(999);
      const projects = new Projects(this.browser);
      await projects.waitForVisible();
    });

    /**
     * Scenario: При нажатии кнопки "Создать проект" появляется форма создания проекта
     *   When пользователь нажимает на кнопку "Создать проект"
     *   Then появляется форма создания проекта
     *   And внешний вид формы совпадает с эталонным
     */
    it('При нажатии кнопки "Создать проект" появляется форма создания проекта', async function () {
      const projects = new Projects(this.browser);
      const projectForm = new ProjectForm(this.browser);

      await projects.openAddForm();
      await projectForm.assertSelfie();
    });

    /**
     * Scenario: Закрытие и повторное открытие окна создания проекта сбрасывает введённый текст
     *   When пользователь открывает форму создания проекта
     *   And вводит текст в поле ввода
     *   And нажимает кнопку "Отмена"
     *   Then форма закрывается
     *   When пользователь открывает форму создания проекта
     *   Then поле ввода пустое
     */
    it('Закрытие и повторное открытие окна создания проекта сбрасывает введённый текст', async function () {
      const projects = new Projects(this.browser);
      const projectForm = new ProjectForm(this.browser);

      await projects.openAddForm();
      await projectForm.setInputValue('текст');
      await projectForm.cancel();
      await projects.openAddForm();
      assert.isEmpty(await projectForm.getInputValue());
    });

    /**
     * Scenario: При отправке формы с невалидными данными появляются ошибки на форме
     *   When пользователь открывает форму создания проекта
     *   And вводит невалидное значение в поле ввода
     *   And нажимает кнопку "Создать"
     *   Then появляется текст ошибки
     */
    it('При отправке формы с невалидными данными появляются ошибки на форме', async function () {
      const projects = new Projects(this.browser);
      const projectForm = new ProjectForm(this.browser);

      await projects.openAddForm();
      await projectForm.setInputValue('//');
      await projectForm.submit();
      assert.isNotEmpty(await projectForm.getErrors());
    });

    /**
     * Scenario: Закрытие и повторное открытие окна создания проекта сбрасывает ошибки
     *   When пользователь открывает форму создания проекта
     *   And вводит невалидное значение в поле ввода
     *   And нажимает кнопку "Создать"
     *   And нажимает кнопку "Отмена"
     *   And снова открывает форму создания проекта
     *   Then текст ошибки отсутствует
     */
    it('Закрытие и повторное открытие окна создания проекта сбрасывает ошибки', async function () {
      const projects = new Projects(this.browser);
      const projectForm = new ProjectForm(this.browser);

      await projects.openAddForm();
      await projectForm.setInputValue('//');
      await projectForm.submit();
      await projectForm.cancel();
      await projects.openAddForm();
      assert.isEmpty(await projectForm.getErrors());
    });

    /**
     * Scenario: При открытии формы создания проекта фокус находится в поле "Название проекта"
     *   When пользователь открывает форму создания проекта
     *   Then фокус находится в поле "Название проекта"
     */
    it('При открытии формы создания проекта фокус находится в поле "Название проекта"', async function () {
      const projects = new Projects(this.browser);
      const projectForm = new ProjectForm(this.browser);

      await projects.openAddForm();
      assert.isTrue(await projectForm.isInputFocused());
    });

    /**
     * Scenario: Если созданный проект вне поля видимости, то происходит прокрутка к нему
     *   Given количество проектов на странице таково, что существует прокрутка
     *   When пользователь создаёт проект, используя форму создания проекта
     *   Then список проектов прокручивается к созданному проекту
     */
    it('Если созданный проект вне поля видимости, то происходит прокрутка к нему', async function () {
      const projects = new Projects(this.browser);
      const title = 'test_title_' + generateRandomId();
      await projects.createProject(title);
      await projects.waitForProjectCardVisible(title);
    });
  });
});
