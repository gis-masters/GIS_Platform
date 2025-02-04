import { TestDefinition } from 'hermione';

import { Form } from '../../../objects/blocks/Form/Form';
import { FormStoryActions } from '../../../objects/blocks/FormStoryActions/FormStoryActions';
import { BLPage } from '../../../objects/pages/BL.page';

interface TestDefinitionWithOnly extends TestDefinition {
  only: TestDefinition;
}

declare const it: TestDefinitionWithOnly;

describe('Форма', () => {
  describe('Режим чтения', () => {
    /**
     * Scenario: Внешний вид
     *   When пользователь заходит на страницу формы в библиотеке блоков /bl/?path=/story/example-form--read-only
     *   Then форма выглядит как положено с данными по-умолчанию
     */
    it('Внешний вид', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);

      await bl.openExample('form', 'read-only');
      await form.waitForVisible();
      await form.assertSelfie('plain');
    });

    /**
     * Scenario: Внешний вид (пустая)
     *   When пользователь заходит на страницу формы в библиотеке блоков /bl/?path=/story/example-form--read-only
     *   And нажимает кнопку 'Clear'
     *   Then форма выглядит как положено с пустыми полями
     */
    it('Внешний вид (пустая)', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);
      const formActions = new FormStoryActions(this.browser);

      await bl.openExample('form', 'read-only');
      await form.waitForVisible();
      await formActions.clear();
      await form.assertSelfie('empty');
    });

    /**
     * Scenario: Внешний вид (заполненная валидными данными)
     *   When пользователь заходит на страницу формы в библиотеке блоков /bl/?path=/story/example-form--read-only
     *   And нажимает кнопку 'Set Valid Data'
     *   And нажимает кнопку 'Validate'
     *   Then форма выглядит как положено с заполненными валидными данными полями
     */
    it('Внешний вид (заполненная валидными данными)', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);
      const formActions = new FormStoryActions(this.browser);

      await bl.openExample('form', 'read-only');
      await form.waitForVisible();
      await formActions.setValidData();
      await formActions.validate();
      await form.assertSelfie('valid');
    });

    /**
     * Scenario: Внешний вид (заполненная невалидными данными)
     *   When пользователь заходит на страницу формы в библиотеке блоков /bl/?path=/story/example-form--read-only
     *   And нажимает кнопку 'Set Error Data'
     *   And нажимает кнопку 'Validate'
     *   Then форма выглядит как положено с заполненными невалидными данными полями
     */
    it('Внешний вид (заполненная невалидными данными)', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);
      const formActions = new FormStoryActions(this.browser);

      await bl.openExample('form', 'read-only');
      await form.waitForVisible();
      await formActions.setErrorData();
      await formActions.validate();
      await form.assertSelfie('error');
    });
  });
});
