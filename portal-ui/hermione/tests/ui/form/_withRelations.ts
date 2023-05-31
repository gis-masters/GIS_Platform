import { TestDefinition } from 'hermione';

import { Form } from '../../../objects/blocks/Form/Form';
import { FormStoryActions } from '../../../objects/blocks/FormStoryActions/FormStoryActions';
import { BLPage } from '../../../objects/pages/BL.page';

interface TestDefinitionWithOnly extends TestDefinition {
  only: TestDefinition;
}

declare const it: TestDefinitionWithOnly;

describe('Форма', () => {
  describe('Связанные документы', () => {
    /**
     * Scenario: Внешний вид
     *   When пользователь заходит на страницу формы со связанными документами
     *        в библиотеке блоков /bl/?path=/story/form-field-withrelations--editable
     *   Then форма выглядит как положено с кнопкой "Связанные документы"
     */
    it('Внешний вид', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);

      await bl.openExample('form-field-withrelations', 'editable');
      await form.waitForVisible();
      await form.assertSelfie('editable');
    });

    /**
     * Scenario: Внешний вид (только для чтения)
     *   When пользователь заходит на страницу формы в режиме чтения со связанными документами
     *        в библиотеке блоков /bl/?path=/story/form-field-withrelations--editable
     *   Then форма выглядит как положено с кнопкой "Связанные документы"
     */
    it('Внешний вид (в режиме чтения)', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);
      const formActions = new FormStoryActions(this.browser);

      await bl.openExample('form-field-withrelations', 'read-only');
      await form.waitForVisible();
      await form.assertSelfie('read-only');
    });
  });
});
