import { TestDefinition } from 'hermione';

import { BLPage } from '../../../../objects/pages/BL.page';
import { XTable } from '../../../../objects/blocks/XTable/XTable';
import { XTableFilterPanel } from '../../../../objects/blocks/XTable/filterPanel/XTable-FilterPanel';
import { assert } from 'chai';

interface TestDefinitionWithOnly extends TestDefinition {
  only: TestDefinition;
}

declare const it: TestDefinitionWithOnly;

describe('XTable', () => {
  describe('Панель фильтров', () => {
    /**
     * Background:
     * Given открыта страница XTable в библиотеке блоков (/bl/?path=/story/xtable--filter-panel)
     * Given фильтры таблицы включены
     */
    beforeEach(async function () {
      const bl = new BLPage(this.browser);
      const xTable = new XTable(this.browser);

      await bl.openExample('xtable', 'filter-panel');
      await xTable.waitForVisible();
    });

    /**
     * Scenario: При пустом значении фильтров панель фильтров не видна
     *   When Значения всех фильтров пустые
     *   Then Панель фильтров не отображается
     */
    it('При пустом значении фильтров панель фильтров не видна', async function () {
      const xTableFilterPanel = new XTableFilterPanel(this.browser);

      assert.isFalse(await xTableFilterPanel.isFiltersPanelEmpty(), 'Панель фильтров не пуста, хотя должна быть');
    });

    /**
     * Scenario: При введённом значении в фильтре в панели фильтров отображается кнопка очистки фильтров и указанный фильтр
     *   When пользователь вводит текст в поле
     *   Then в панели фильтров отображается кнопка очистки фильтров
     *   And в панели фильтров отображается указанный фильтр
     */
    it('При введённом значении в фильтре в панели фильтров отображается кнопка очистки фильтров и указанный фильтр', async function () {
      const xTableFilterPanel = new XTableFilterPanel(this.browser);

      await xTableFilterPanel.setStringFieldValue('бу');

      assert.isTrue(await xTableFilterPanel.isFilterShow(), 'Фильтр в панель фильтров отсутствует, хотя должен быть');

      const title = await xTableFilterPanel.getFilterTitle();
      assert.equal('Название', title);

      const value = await xTableFilterPanel.getFirstFilterValue();
      assert.equal('%бу%', value);
    });

    /**
     * Scenario: При клике на кнопку Очистить все фильтры удаляются все фильтры
     *   Given заданы фильтры для поля String и Bool
     *   When пользователь нажимает на кнопку Очистить все фильтры
     *   Then в панели фильтров удаляются все фильтры
     *   And значения всех фильтров в таблице становятся пустые
     */
    it('При клике на кнопку Очистить все фильтры удаляются все фильтры', async function () {
      const xTableFilterPanel = new XTableFilterPanel(this.browser);

      await xTableFilterPanel.setStringFieldValue('бу');
      const stringValue = await xTableFilterPanel.getFirstFilterValue();
      assert.equal('%бу%', stringValue);

      await xTableFilterPanel.setBoolFieldValue(true);

      const boolValue = await xTableFilterPanel.getSecondFilterValue();
      assert.equal('да', boolValue);

      await xTableFilterPanel.clearAllFilter();

      assert.isFalse(await xTableFilterPanel.isFiltersPanelEmpty(), 'Панель фильтров не пуста, хотя должна быть');
    });

    /**
     * Scenario: При клике на крестик у фильтра в панели фильтров удаляется этот фильтра и очищается соответствующее поле фильтра в таблице
     *   Given задан фильтр для поля String и Bool
     *   When пользователь нажимает на крестик у фильтра в панели фильтров
     *   Then в панели фильтров удаляется фильтр для String
     *   And значения фильтра String в таблице становится пустым
     */
    it('При клике на крестик у фильтра в панели фильтров удаляется этот фильтра и очищается соответствующее поле фильтра в таблице', async function () {
      const xTableFilterPanel = new XTableFilterPanel(this.browser);

      await xTableFilterPanel.setStringFieldValue('бу');
      await xTableFilterPanel.setBoolFieldValue(true);

      const boolValue = await xTableFilterPanel.getSecondFilterValue();
      assert.equal('да', boolValue);

      await xTableFilterPanel.clearFirstFilter();

      const remainingValue = await xTableFilterPanel.getFirstFilterValue();
      assert.equal('да', remainingValue);

      const tableFilterValue = await xTableFilterPanel.getFirstColValues();
      assert.deepEqual(tableFilterValue, ['Дыба'], 'Не правильная работа фильтра');
    });

    /**
     * Scenario: При изменении введённого значения у поля типа String в фильтре в панели фильтров изменяется содержимое фильтра
     *   When пользователь изменяет текст и тип фильтрации в поле типа String
     *   Then в панели фильтров изменяется указанный фильтр
     */
    it('При изменении введённого значения у поля типа String в фильтре в панели фильтров изменяется содержимое фильтра', async function () {
      const xTableFilterPanel = new XTableFilterPanel(this.browser);

      await xTableFilterPanel.setStringFieldValue('бу');

      const title = await xTableFilterPanel.getFilterTitle();
      assert.equal('Название', title);

      const firstValue = await xTableFilterPanel.getFirstFilterValue();
      assert.equal('%бу%', firstValue);

      await xTableFilterPanel.setStringFieldValue('ск');
      await xTableFilterPanel.toggleStrictness();

      const value = await xTableFilterPanel.getFirstFilterValue();
      assert.equal('буск', value);
    });

    /**
     * Scenario: При изменении введённого значения у поля типа Float в фильтре в панели фильтров изменяется содержимое фильтра
     *   When пользователь изменяет выбранные значения в поле типа Float
     *   Then в панели фильтров изменяется указанный фильтр
     */
    it('При изменении введённого значения у поля типа Float в фильтре в панели фильтров изменяется содержимое фильтра', async function () {
      const xTableFilterPanel = new XTableFilterPanel(this.browser);

      await xTableFilterPanel.setFloatFieldValue(1, 2);

      const title = await xTableFilterPanel.getFilterTitle();
      assert.equal('Вес', title);

      const firstValue = await xTableFilterPanel.getFirstFilterValue();
      assert.equal('от 1 до 2', firstValue);

      await xTableFilterPanel.setFloatFieldValue(4, 8);
      const secondValue = await xTableFilterPanel.getFirstFilterValue();
      assert.equal('от 14 до 28', secondValue);
    });

    /**
     * Scenario: При введённом значении в фильтре у поля типа DateTime в фильтре в панели фильтров отображается значение фильтра
     *   When пользователь изменяет выбранные значения в поле типа DateTime
     *   Then в панели фильтров изменяется указанный фильтр
     */
    it('При изменении введённого значения у поля типа DateTime в фильтре в панели фильтров изменяется содержимое фильтра', async function () {
      const xTableFilterPanel = new XTableFilterPanel(this.browser);

      await xTableFilterPanel.setDateTimeFieldValue(10102020, 12122020);

      const firstValue = await xTableFilterPanel.getFirstFilterValue();
      assert.equal('от 10.10.2020 до 12.12.2020', firstValue);
    });

    /**
     * Scenario: При изменении введённого значения у поля типа Bool в фильтре в панели фильтров изменяется содержимое фильтра
     *   When пользователь изменяет выбранные значения в поле типа Bool
     *   Then в панели фильтров изменяется указанный фильтр
     */
    it('При изменении введённого значения у поля типа Bool в фильтре в панели фильтров изменяется содержимое фильтра', async function () {
      const xTableFilterPanel = new XTableFilterPanel(this.browser);

      await xTableFilterPanel.setBoolFieldValue(true);

      const title = await xTableFilterPanel.getFilterTitle();
      assert.equal('Решает', title);

      const firstValue = await xTableFilterPanel.getFirstFilterValue();
      assert.equal('да', firstValue);

      await xTableFilterPanel.setBoolFieldValue(false);
      const secondValue = await xTableFilterPanel.getFirstFilterValue();
      assert.equal('нет', secondValue);
    });
  });
});
