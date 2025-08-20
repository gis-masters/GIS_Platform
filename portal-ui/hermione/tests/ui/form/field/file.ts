import { TestDefinition } from 'hermione';

import { Form } from '../../../../objects/blocks/Form/Form';
import { BLPage } from '../../../../objects/pages/BL.page';

interface TestDefinitionWithOnly extends TestDefinition {
  only: TestDefinition;
}

declare const it: TestDefinitionWithOnly;

describe('Форма', () => {
  describe('Поле file', () => {
    /**
     * Scenario: Внешний вид
     *   When Пользователь открывает в библиотеке блоков поле file редактируемое
     *   Then Поле выглядит как положено
     */
    it('Внешний вид', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);

      await bl.openExample('form-field-file', 'single-editable');
      await form.waitForVisible();
      await form.assertSelfie('single-editable');
    });

    /**
     * Scenario: Внешний вид пустого поля
     *   When Пользователь открывает в библиотеке блоков поле file редактируемое пустое
     *   Then Поле выглядит как положено
     */
    it('Внешний вид пустого поля', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);

      await bl.openExample('form-field-file', 'single-editable-empty');
      await form.waitForVisible();
      await form.assertSelfie('single-editable-empty');
    });

    /**
     * Scenario: Внешний вид множественного поля
     *   When Пользователь открывает в библиотеке блоков поле file редактируемое множественное
     *   Then Поле выглядит как положено
     */
    it('Внешний вид множественного поля', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);

      await bl.openExample('form-field-file', 'multiple-editable');
      await form.waitForVisible();
      await form.assertSelfie('multiple-editable');
    });

    /**
     * Scenario: Внешний вид множественного поля с переполнением
     *   When Пользователь открывает в библиотеке блоков поле file редактируемое множественное
     *   Then Поле выглядит как положено
     */
    it('Внешний вид множественного поля с переполнением', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);

      await bl.openExample('form-field-file', 'multiple-editable-scroll');
      await form.waitForVisible();
      await form.assertSelfie('multiple-editable-scroll');
    });

    /**
     * Scenario: Внешний вид пустого множественного поля
     *   When Пользователь открывает в библиотеке блоков поле file редактируемое множественное
     *   Then Поле выглядит как положено
     */
    it('Внешний вид пустого множественного поля', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);

      await bl.openExample('form-field-file', 'multiple-editable-empty');
      await form.waitForVisible();
      await form.assertSelfie('multiple-editable-empty');
    });

    /**
     * Scenario: Внешний вид в режиме чтения
     *   When Пользователь открывает в библиотеке блоков поле для чтения file
     *   Then Поле выглядит как положено
     */
    it('Внешний вид в режиме чтения', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);

      await bl.openExample('form-field-file', 'single-view');
      await form.waitForVisible();
      await form.assertSelfie('single-view');
    });

    /**
     * Scenario: Внешний вид пустого поля в режиме чтения
     *   When Пользователь открывает в библиотеке блоков поле для чтения file пустое
     *   Then Поле выглядит как положено
     */
    it('Внешний вид пустого поля в режиме чтения', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);

      await bl.openExample('form-field-file', 'single-view-empty');
      await form.waitForVisible();
      await form.assertSelfie('single-view-empty');
    });

    /**
     * Scenario: Внешний вид множественного поля в режиме чтения
     *   When Пользователь открывает в библиотеке блоков поле для чтения file пустое
     *   Then Поле выглядит как положено
     */
    it('Внешний вид множественного поля в режиме чтения', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);

      await bl.openExample('form-field-file', 'multiple-view');
      await form.waitForVisible();
      await form.assertSelfie('multiple-view');
    });

    /**
     * Scenario: Внешний вид множественного поля в режиме чтения с переполнением
     *   When Пользователь открывает в библиотеке блоков поле для чтения file пустое
     *   Then Поле выглядит как положено
     */
    it('Внешний вид множественного поля в режиме чтения с переполнением', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);

      await bl.openExample('form-field-file', 'multiple-view-scroll');
      await form.waitForVisible();
      await form.assertSelfie('multiple-view-scroll');
    });

    /**
     * Scenario: Внешний вид пустого множественного поля в режиме чтения
     *   When Пользователь открывает в библиотеке блоков поле для чтения file пустое
     *   Then Поле выглядит как положено
     */
    it('Внешний вид пустого множественного поля в режиме чтения', async function () {
      const bl = new BLPage(this.browser);
      const form = new Form(this.browser);

      await bl.openExample('form-field-file', 'multiple-view-empty');
      await form.waitForVisible();
      await form.assertSelfie('multiple-view-empty');
    });
  });
});
