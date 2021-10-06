import { TestDefinition } from 'hermione';
import { Form } from '../../../objects/blocks/Form/Form';

import { BLPage } from '../../../objects/pages/BL.page';

interface TestDefinitionWithOnly extends TestDefinition {
  only: TestDefinition;
}

declare const it: TestDefinitionWithOnly;

describe('Форма', () => {
  /**
   * Scenario: Внешний вид простой формы
   *   When пользователь заходит на страницу формы в библиотеке блоков
   *   Then форма выглядит как положено
   */
  it('Внешний вид', async function () {
    const bl = new BLPage(this.browser);
    const form = new Form(this.browser);

    await bl.openExample('form', 'view-content-only');
    await form.waitForVisible();
    await form.assertSelfie();
  });

  /**
   * Scenario: Внешний вид формы по схеме
   *   When пользователь заходит на страницу формы в библиотеке блоков
   *   Then форма выглядит как положено
   */
  it('Внешний вид формы по схеме', async function () {
    const bl = new BLPage(this.browser);
    const form = new Form(this.browser);

    await bl.openExample('form', 'outside-control');
    await form.waitForVisible();
    await form.assertSelfie();
  });
});
