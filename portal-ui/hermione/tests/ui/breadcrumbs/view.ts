import { TestDefinition } from 'hermione';

import { Breadcrumbs } from '../../../objects/blocks/Breadcrumbs/Breadcrumbs';
import { BLPage } from '../../../objects/pages/BL.page';

interface TestDefinitionWithOnly extends TestDefinition {
  only: TestDefinition;
}

declare const it: TestDefinitionWithOnly;

describe('Хлебные крошки', function () {
  describe('Внешний вид', function () {
    /**
     * Background:
     * Given открыта страница хлебных крошек в библиотеке блоков (/bl/?path=/story/breadcrumbs--regular)
     */
    beforeEach(async function () {
      const bl = new BLPage(this.browser);
      await bl.openExample('breadcrumbs', 'regular');
      const breadcrumbs = new Breadcrumbs(this.browser);
      await breadcrumbs.waitForVisible();
    });

    /**
     * Scenario: Внешний вид хлебных крошек при максимальной ширине
     *   When пользователь ничего не делает
     *   Then хлебные крошки выглядит как положено
     */
    it('Внешний вид хлебных крошек при максимальной ширине', async function () {
      const breadcrumbs = new Breadcrumbs(this.browser);
      await breadcrumbs.assertSelfie('breadcrumbs_width_max');
    });

    /**
     * Scenario: Внешний вид хлебных крошек при ширине 500 пикселей
     *   When пользователь устанавливает ширину блока в 500 пикселей
     *   Then хлебные крошки выглядит как положено
     */
    it('Внешний вид хлебных крошек при ширине 500 пикселей', async function () {
      const breadcrumbs = new Breadcrumbs(this.browser);
      await breadcrumbs.setWidthInStory(500);
      await breadcrumbs.assertSelfie('breadcrumbs_width_500');
    });

    /**
     * Scenario: Внешний вид хлебных крошек при ширине 200 пикселей
     *   When пользователь устанавливает ширину блока в 200 пикселей
     *   Then хлебные крошки выглядит как положено
     */
    it('Внешний вид хлебных крошек при ширине 200 пикселей', async function () {
      const breadcrumbs = new Breadcrumbs(this.browser);
      await breadcrumbs.setWidthInStory(200);
      await breadcrumbs.assertSelfie('breadcrumbs_width_200');
    });

    /**
     * Scenario: Внешний вид хлебных крошек при ширине 100 пикселей
     *   When пользователь устанавливает ширину блока в 200 пикселей
     *   Then хлебные крошки выглядит как положено
     */
    it('Внешний вид хлебных крошек при ширине 100 пикселей', async function () {
      const breadcrumbs = new Breadcrumbs(this.browser);
      await breadcrumbs.setWidthInStory(100);
      await breadcrumbs.assertSelfie('breadcrumbs_width_100');
    });
  });

  describe('Внешний вид при уменьшенном размере', function () {
    /**
     * Background:
     * Given открыта страница хлебных крошек уменьшенного размера в библиотеке блоков (/bl/?path=/story/breadcrumbs--small)
     */
    beforeEach(async function () {
      const bl = new BLPage(this.browser);
      await bl.openExample('breadcrumbs', 'small');
      const breadcrumbs = new Breadcrumbs(this.browser);
      await breadcrumbs.waitForVisible();
    });

    /**
     * Scenario: Внешний вид хлебных крошек при максимальной ширине
     *   When пользователь ничего не делает
     *   Then хлебные крошки выглядит как положено
     */
    it('Внешний вид хлебных крошек при максимальной ширине', async function () {
      const breadcrumbs = new Breadcrumbs(this.browser);
      await breadcrumbs.assertSelfie('breadcrumbs_width_max');
    });

    /**
     * Scenario: Внешний вид хлебных крошек при ширине 500 пикселей
     *   When пользователь устанавливает ширину блока в 500 пикселей
     *   Then хлебные крошки выглядит как положено
     */
    it('Внешний вид хлебных крошек при ширине 500 пикселей', async function () {
      const breadcrumbs = new Breadcrumbs(this.browser);
      await breadcrumbs.setWidthInStory(500);
      await breadcrumbs.assertSelfie('breadcrumbs_width_500');
    });

    /**
     * Scenario: Внешний вид хлебных крошек при ширине 200 пикселей
     *   When пользователь устанавливает ширину блока в 200 пикселей
     *   Then хлебные крошки выглядит как положено
     */
    it('Внешний вид хлебных крошек при ширине 200 пикселей', async function () {
      const breadcrumbs = new Breadcrumbs(this.browser);
      await breadcrumbs.setWidthInStory(200);
      await breadcrumbs.assertSelfie('breadcrumbs_width_200');
    });

    /**
     * Scenario: Внешний вид хлебных крошек при ширине 100 пикселей
     *   When пользователь устанавливает ширину блока в 100 пикселей
     *   Then хлебные крошки выглядит как положено
     */
    it('Внешний вид хлебных крошек при ширине 100 пикселей', async function () {
      const breadcrumbs = new Breadcrumbs(this.browser);
      await breadcrumbs.setWidthInStory(100);
      await breadcrumbs.assertSelfie('breadcrumbs_width_100');
    });
  });
});
