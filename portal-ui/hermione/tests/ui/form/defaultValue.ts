import { TestDefinition } from 'hermione';
import { assert } from 'chai';

import { Form } from '../../../objects/blocks/Form/Form';
import { BLPage } from '../../../objects/pages/BL.page';

interface TestDefinitionWithOnly extends TestDefinition {
  only: TestDefinition;
}

declare const it: TestDefinitionWithOnly;

describe('Форма', () => {
  describe('Значение по-умолчанию', () => {
    /**
     * Background:
     *   Given открыта страница формы со значениями по-умолчанию в библиотеке блоков (/bl/?path=/story/form--default-value)
     */
    beforeEach(async function () {
      const bl = new BLPage(this.browser);
      await bl.openExample('form', 'default-value');
      const form = new Form(this.browser);
      await form.waitForVisible();
    });

    /**
     * Scenario: При использовании свойства defaultValue в схеме поля значение по-умолчанию этого поля соответствует значению свойства
     *   Given В форме присутствует поле "name" со свойством defaultValue равным "John"
     *   When Открывается страница формы
     *   Then Поле "Имя" имеет значение "John"
     */
    it('При использовании свойства defaultValue в схеме поля значение по-умолчанию этого поля соответствует значению свойства', async function () {
      const form = new Form(this.browser);
      const value = await form.getInputValue('name');
      assert.equal(value, 'John');
    });

    /**
     * Scenario: При использовании свойства defaultValueWellKnownFormula со значением "inherit" в схеме поля значение по-умолчанию этого поля берётся из одноимённого поля родителя
     *   Given В форме присутствует поле "surname" со свойством defaultValueWellKnownFormula равным "inherit"
     *   Given В качестве родителя указан объект { "surname": "Doe" }
     *   When Открывается страница формы
     *   Then Поле "Фамилия" имеет значение "Doe"
     */
    it('При использовании свойства defaultValueWellKnownFormula со значением "inherit" в схеме поля значение по-умолчанию этого поля берётся из одноимённого поля родителя', async function () {
      const form = new Form(this.browser);
      const value = await form.getInputValue('surname');
      assert.equal(value, 'Doe');
    });

    /**
     * Scenario:При использовании свойства defaultValueFormula в схеме поля значение по-умолчанию этого поля вычисляется согласно js-формуле из этого свойства
     *   Given В форме присутствует поле "initials" со свойством defaultValueFormula равным "return obj.name.slice(0,1) + '. ' + parent.surname.slice(0,1) + '.'"
     *   Given В качестве родителя указан объект { "surname": "Doe" }
     *   Given В поле "name" указано значение "John"
     *   When Открывается страница формы
     *   Then Поле "Инициалы" имеет значение "J. D."
     */
    it('При использовании свойства defaultValueFormula в схеме поля значение по-умолчанию этого поля вычисляется согласно js-формуле из этого свойства', async function () {
      const form = new Form(this.browser);
      const value = await form.getInputValue('initials');
      assert.equal(value, 'J. D.');
    });
  });
});
