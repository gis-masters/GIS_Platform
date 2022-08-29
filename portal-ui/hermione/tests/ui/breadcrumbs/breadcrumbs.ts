import { TestDefinition } from 'hermione';

import { Breadcrumbs } from '../../../objects/blocks/Breadcrumbs/Breadcrumbs';
import { BLPage } from '../../../objects/pages/BL.page';

interface TestDefinitionWithOnly extends TestDefinition {
  only: TestDefinition;
}

declare const it: TestDefinitionWithOnly;

describe('Хлебные крошки', () => {
  describe('Общее', () => {
    /**
     * Scenario: Внешний вид хлебных крошек
     *   When пользователь заходит на страницу хлебных крошек в библиотеке блоков
     *   Then хлебные крошки выглядит как положено
     */
    it('Внешний вид', async function () {
      const bl = new BLPage(this.browser);
      const breadcrumbs = new Breadcrumbs(this.browser);

      await bl.openExample('breadcrumbs', 'regular');
      await breadcrumbs.waitForVisible();
      await breadcrumbs.assertSelfie('plain');
    });

    /**
     * Scenario: Внешний вид хлебных крошек
     *   When пользователь заходит на страницу хлебных крошек в библиотеке блоков /bl/?path=/story/example-breadcrumbs--max-width-500-breadcrumbs
     *   Then хлебные крошки выглядит как положено с заданной шириной в 500
     */
    it('Внешний вид хлебных крошек с заданной шириной в 500', async function () {
      const bl = new BLPage(this.browser);
      const breadcrumbs = new Breadcrumbs(this.browser);

      await bl.openExample('breadcrumbs', 'max-width-500-breadcrumbs');
      await breadcrumbs.waitForVisible();
      await breadcrumbs.assertSelfie('plain');
    });

    /**
     * Scenario: Внешний вид хлебных крошек
     *   When пользователь заходит на страницу хлебных крошек в библиотеке блоков /bl/?path=/story/example-breadcrumbs--max-width-250-breadcrumbs
     *   Then хлебные крошки выглядит как положено с заданной шириной в 250
     */
    it('Внешний вид хлебных крошек с заданной шириной в 250', async function () {
      const bl = new BLPage(this.browser);
      const breadcrumbs = new Breadcrumbs(this.browser);

      await bl.openExample('breadcrumbs', 'max-width-250-breadcrumbs');
      await breadcrumbs.waitForVisible();
      await breadcrumbs.assertSelfie('plain');
    });

    /**
     * Scenario: Внешний вид хлебных крошек
     *   When пользователь заходит на страницу хлебных крошек в библиотеке блоков /bl/?path=/story/example-breadcrumbs--max-width-100-breadcrumbs
     *   Then хлебные крошки выглядит как положено с заданной шириной в 100
     */
    it('Внешний вид хлебных крошек с заданной шириной в 100', async function () {
      const bl = new BLPage(this.browser);
      const breadcrumbs = new Breadcrumbs(this.browser);

      await bl.openExample('breadcrumbs', 'max-width-100-breadcrumbs');
      await breadcrumbs.waitForVisible();
      await breadcrumbs.assertSelfie('plain');
    });
  });
});
