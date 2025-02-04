import { TestDefinition } from 'hermione';

import { Form } from '../../../objects/blocks/Form/Form';
import { FormStoryActions } from '../../../objects/blocks/FormStoryActions/FormStoryActions';
import { BLPage } from '../../../objects/pages/BL.page';

interface TestDefinitionWithOnly extends TestDefinition {
  only: TestDefinition;
}

declare const it: TestDefinitionWithOnly;

describe('Форма', () => {
  describe('Общее', () => {
    /**
     * Scenario: Внешний вид простой формы
     *   When пользователь заходит на страницу формы в библиотеке блоков
     *   Then форма выглядит как положено
     */
    it('Внешний вид', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);

      await bl.openExample('form', 'content-only');
      await form.waitForVisible();
      await form.assertSelfie('plain');
    });

    /**
     * Scenario: Внешний вид формы по схеме
     *   When пользователь заходит на страницу формы в библиотеке блоков /bl/?path=/story/example-form--outside-control
     *   Then форма выглядит как положено с данными по-умолчанию
     */
    it('Внешний вид формы по схеме', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);

      await bl.openExample('form', 'outside-control');
      await form.waitForVisible();
      await form.assertSelfie('plain');
    });

    /**
     * Scenario: Внешний вид формы по схеме (пустая)
     *   When пользователь заходит на страницу формы в библиотеке блоков /bl/?path=/story/example-form--outside-control
     *   And нажимает кнопку 'Clear'
     *   Then форма выглядит как положено с пустыми полями
     */
    it('Внешний вид формы по схеме (пустая)', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);
      const formActions = new FormStoryActions(this.browser);

      await bl.openExample('form', 'outside-control');
      await form.waitForVisible();
      await formActions.clear();
      await form.assertSelfie('empty');
    });

    /**
     * Scenario: Внешний вид формы по схеме (заполненная валидными данными)
     *   When пользователь заходит на страницу формы в библиотеке блоков /bl/?path=/story/example-form--outside-control
     *   And нажимает кнопку 'Set Valid Data'
     *   And нажимает кнопку 'Validate'
     *   Then форма выглядит как положено с заполненными валидными данными полями
     */
    it('Внешний вид формы по схеме (заполненная валидными данными)', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);
      const formActions = new FormStoryActions(this.browser);

      await bl.openExample('form', 'outside-control');
      await form.waitForVisible();
      await formActions.setValidData();
      await formActions.validate();
      await form.assertSelfie('valid');
    });

    /**
     * Scenario: Внешний вид формы по схеме (заполненная невалидными данными)
     *   When пользователь заходит на страницу формы в библиотеке блоков /bl/?path=/story/example-form--outside-control
     *   And нажимает кнопку 'Set Error Data'
     *   And нажимает кнопку 'Validate'
     *   Then форма выглядит как положено с заполненными невалидными данными полями
     */
    it('Внешний вид формы по схеме (заполненная невалидными данными)', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);
      const formActions = new FormStoryActions(this.browser);

      await bl.openExample('form', 'outside-control');
      await form.waitForVisible();
      await formActions.setErrorData();
      await formActions.validate();
      await form.assertSelfie('error');
    });
  });
});
