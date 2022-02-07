import { TestDefinition } from 'hermione';

import { Form } from '../../../objects/blocks/Form/Form';
import { FormStorybookActions } from '../../../objects/blocks/FormStorybookActions/FormStorybookActions';
import { UrlsList } from '../../../objects/blocks/UrlsList/UrlsList';
import { BLPage } from '../../../objects/pages/BL.page';

interface TestDefinitionWithOnly extends TestDefinition {
  only: TestDefinition;
}

declare const it: TestDefinitionWithOnly;

describe('Поле url', () => {
  /**
   * Scenario: Внешний вид поля url в режиме редактирования
   *   When пользователь заходит на страницу поля url в режиме редактирования
   *   Then поле выглядит как положено
   */
  it('Внешний вид поля url в режиме редактирования', async function () {
    const bl = new BLPage(this.browser);
    const form = new Form(this.browser);

    await bl.openExample('form-field-url', 'editable-url');
    await form.waitForVisible();
    await form.assertSelfie('editable');
  });

  /**
   * Scenario: Внешний вид поля url в режиме чтения
   *   When пользователь заходит на страницу поля url в режиме чтения
   *   Then поле выглядит как положено без элементов управления
   */
  it('Внешний вид поля url в режиме чтения', async function () {
    const bl = new BLPage(this.browser);
    const form = new Form(this.browser);

    await bl.openExample('form-field-url', 'readonly-url');
    await form.waitForVisible();
    await form.assertSelfie('readonly');
  });

  /**
   * Scenario: Внешний вид поля url c ошибками
   *   When пользователь заходит на страницу поля url с ошибками
   *   Then поле выглядит как положено с невалидными данными полями
   */
  it('Внешний вид поля url c ошибками', async function () {
    const bl = new BLPage(this.browser);
    const form = new Form(this.browser);
    const formActions = new FormStorybookActions(this.browser);

    await bl.openExample('form-field-url', 'errors-url');
    await form.waitForVisible();
    await formActions.validate();
    await form.assertSelfie('errors');
  });

  /**
   * Scenario: Внешний вид поля url с формой добавления новой ссылки
   *   When пользователь заходит на страницу поля url
   *   Then поле выглядит как положено с формой добавления новой ссылки
   */
  it('Внешний вид поля url c формой добавления новой ссылки', async function () {
    const bl = new BLPage(this.browser);
    const form = new Form(this.browser);
    const urlFieldActions = new UrlsList(this.browser);

    await bl.openExample('form-field-url', 'errors-url');
    await form.waitForVisible();
    await urlFieldActions.addUrl();
    await urlFieldActions.assertSelfie('add new link');
  });

  /**
   * Scenario: Внешний вид поля url с открытым диалоговым окном
   *   When пользователь заходит на страницу поля url
   *   Then поле выглядит как положено с диалоговым окном
   */
  it('Внешний вид поля url c открытым диалоговым окном', async function () {
    const bl = new BLPage(this.browser);
    const form = new Form(this.browser);
    const urlFieldActions = new UrlsList(this.browser);

    await bl.openExample('form-field-url', 'editable-url');
    await form.waitForVisible();
    await urlFieldActions.openPopup();
    await form.assertSelfie('popup');
  });

  /**
   * Scenario: Внешний вид поля url с пустыми данными
   *   When пользователь заходит на страницу поля url
   *   Then поле выглядит как положено с пустыми данными
   */
  it('Внешний вид поля url с пустыми данными', async function () {
    const bl = new BLPage(this.browser);
    const form = new Form(this.browser);
    const urlFieldActions = new UrlsList(this.browser);

    await bl.openExample('form-field-url', 'empty-url');
    await form.waitForVisible();
    await form.assertSelfie('empty');
  });

  /**
   * Scenario: Внешний вид поля url с валидацией пустых данных
   *   When пользователь заходит на страницу поля url
   *   Then поле выглядит как положено с валидацией пустых данных
   */
  it('Внешний вид поля url c валидацией пустых данных', async function () {
    const bl = new BLPage(this.browser);
    const form = new Form(this.browser);
    const formActions = new FormStorybookActions(this.browser);

    await bl.openExample('form-field-url', 'empty-url');
    await form.waitForVisible();
    await formActions.validate();
    await form.assertSelfie('empty validate');
  });

  /**
   * Scenario: Внешний вид поля url с пустыми данными только для чтения
   *   When пользователь заходит на страницу поля url
   *   Then поле выглядит как положено с пустыми данными только для чтения
   */
  it('Внешний вид поля url c пустыми данными только для чтения', async function () {
    const bl = new BLPage(this.browser);
    const form = new Form(this.browser);

    await bl.openExample('form-field-url', 'read-only-empty-url');
    await form.waitForVisible();
    await form.assertSelfie('empty readonly');
  });
});
