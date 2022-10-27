import { TestDefinition } from 'hermione';
import { assert } from 'chai';

import { BLPage } from '../../../../objects/pages/BL.page';
import { XTable } from '../../../../objects/blocks/XTable/XTable';
import { XTableFilterTypeString } from '../../../../objects/blocks/XTable/filter/XTableFilter_type_string';

interface TestDefinitionWithOnly extends TestDefinition {
  only: TestDefinition;
}

declare const it: TestDefinitionWithOnly;

describe('XTable', () => {
  describe('Filter', () => {
    describe('string', () => {
      /**
       * Background:
       * Given открыта страница XTable в библиотеке блоков (/bl/?path=/story/xtable--standard)
       * Given фильтры таблицы включены
       */
      beforeEach(async function () {
        const bl = new BLPage(this.browser);
        const xTable = new XTable(this.browser);

        await bl.openExample('xtable', 'standard');
        await xTable.waitForVisible();
        await xTable.enableFilters();
      });

      /**
       * Scenario: При пустом значении и выключенном строгом поиске фильтр выглядит неактивным (вид по-умолчанию)
       *   When пользователь ничего не делает
       *   Then кнопка переключения режимов фильтра не имеет жёлтой подсветки
       */
      it('При пустом значении и выключенном строгом поиске фильтр выглядит неактивным (вид по-умолчанию)', async function () {
        const xTableFilterTypeString = new XTableFilterTypeString(this.browser);

        assert.isFalse(await xTableFilterTypeString.isFilterActive(), 'Фильтр активирован, хотя не должен быть');
        await xTableFilterTypeString.assertSelfie('default');
      });

      /**
       * Scenario: При введённом значении фильтр выглядит активным
       *   When пользователь вводит текст в поле
       *   Then кнопка переключения режимов фильтра получает жёлтую подсветку
       */
      it('При введённом значении фильтр выглядит активным', async function () {
        const xTableFilterTypeString = new XTableFilterTypeString(this.browser);

        await xTableFilterTypeString.setValue('бу');

        assert.isTrue(await xTableFilterTypeString.isFilterActive(), 'Фильтр не активирован, хотя должен быть');
        await xTableFilterTypeString.assertSelfie('activeWithText');
      });

      /**
       * Scenario: При включенном строгом режиме и пустом фильтр выглядит активным
       *   When пользователь кликает по кнопке переключения режима фильтрации
       *   Then кнопка переключения режимов фильтра получает жёлтую подсветку
       */
      it('При включенном строгом режиме и пустом фильтр выглядит активным', async function () {
        const xTableFilterTypeString = new XTableFilterTypeString(this.browser);

        await xTableFilterTypeString.toggleStrictness();

        assert.isTrue(await xTableFilterTypeString.isFilterActive(), 'Фильтр не активирован, хотя должен быть');
        await xTableFilterTypeString.assertSelfie('activeWithStrict');
      });

      /**
       * Scenario: Если у активного фильтра с непустым значением удалить значение, то он становится неактивным
       *   When пользователь вводит текст в поле
       *   Then кнопка переключения режимов фильтра получает жёлтую подсветку
       *   When пользователь удаляет текст из поля
       *   Then кнопка переключения режимов фильтра теряет жёлтую подсветку
       */
      it('Если у активного фильтра с непустым значением удалить значение, то он становится неактивным', async function () {
        const xTableFilterTypeString = new XTableFilterTypeString(this.browser);

        await xTableFilterTypeString.setValue('бу');
        assert.isTrue(await xTableFilterTypeString.isFilterActive(), 'Фильтр не активирован, хотя должен быть');
        await this.browser.keys(['Backspace']);
        await this.browser.keys(['Backspace']);
        assert.isFalse(await xTableFilterTypeString.isFilterActive(), 'Фильтр активирован, хотя не должен быть');
      });

      /**
       * Scenario: Если ввести значение в фильтр, то таблица показывает только элементы, содержащие введённую подстроку
       *   When пользователь вводит текст в поле
       *   Then в таблице отображаются только элементы, содержащие введённую подстроку
       */
      it('Если ввести значение в фильтр, то таблица показывает только элементы, содержащие введённую подстроку', async function () {
        const xTableFilterTypeString = new XTableFilterTypeString(this.browser);

        await xTableFilterTypeString.setValue('кровать');
        const firstCol = await xTableFilterTypeString.getFirstColValues();

        assert.deepEqual(['Кровать', 'Кровать детская', 'Эвкалиптовая кровать'], firstCol);
      });

      /**
       * Scenario: Если ввести значение в фильтр в строгом режиме, то таблица показывает только элементы, значение которых совпадает с введённой строкой
       *   When пользователь кликает по кнопке переключения режима фильтрации
       *   And пользователь вводит текст в поле
       *   Then в таблице отображаются только элементы, значение которых совпадает с введённой строкой
       */
      it('Если ввести значение в фильтр в строгом режиме, то таблица показывает только элементы, значение которых совпадает с введённой строкой', async function () {
        const xTableFilterTypeString = new XTableFilterTypeString(this.browser);

        await xTableFilterTypeString.toggleStrictness();
        await xTableFilterTypeString.setValue('кровать');
        const firstCol = await xTableFilterTypeString.getFirstColValues();

        assert.deepEqual(['Кровать'], firstCol);
      });

      /**
       * Scenario: Если ввести значение в фильтр в строгом режиме с % в конце, то таблица показывает только элементы, значение которых начинается с введённой строки
       *   When пользователь кликает по кнопке переключения режима фильтрации
       *   And пользователь вводит в поле текст с % в конце
       *   Then в таблице отображаются только элементы, значение которых начинается с введённой строки
       */
      it('Если ввести значение в фильтр в строгом режиме с % в конце, то таблица показывает только элементы, значение которых начинается с введённой строки', async function () {
        const xTableFilterTypeString = new XTableFilterTypeString(this.browser);

        await xTableFilterTypeString.toggleStrictness();
        await xTableFilterTypeString.setValue('кровать%');
        const firstCol = await xTableFilterTypeString.getFirstColValues();

        assert.deepEqual(['Кровать', 'Кровать детская'], firstCol);
      });

      /**
       * Scenario: Если ввести значение в фильтр в строгом режиме с % в начале, то таблица показывает только элементы, значение которых заканчивается введённой строкой
       *   When пользователь кликает по кнопке переключения режима фильтрации
       *   And пользователь вводит текст в поле с % в начале
       *   Then в таблице отображаются только элементы, значение которых заканчивается введённой строкой
       */
      it('Если ввести значение в фильтр в строгом режиме с % в начале, то таблица показывает только элементы, значение которых заканчивается введённой строкой', async function () {
        const xTableFilterTypeString = new XTableFilterTypeString(this.browser);

        await xTableFilterTypeString.toggleStrictness();
        await xTableFilterTypeString.setValue('%кровать');
        const firstCol = await xTableFilterTypeString.getFirstColValues();

        assert.deepEqual(['Кровать', 'Эвкалиптовая кровать'], firstCol);
      });

      /**
       * Scenario: Если ввести значение в фильтр в строгом режиме с % в начале и в конце, то фильтр переходит в нестрогий режим
       *   When пользователь кликает по кнопке переключения режима фильтрации
       *   Then фильтр переходит в строгий режим
       *   When пользователь вводит текст в поле с % в начале и в конце
       *   Then фильтр переходит в нестрогий режим
       *   And символы % в начале и в конце значения фильтра скрываются
       */
      it('Если ввести значение в фильтр в строгом режиме с % в начале и в конце, то фильтр переходит в нестрогий режим', async function () {
        const xTableFilterTypeString = new XTableFilterTypeString(this.browser);

        await xTableFilterTypeString.toggleStrictness();
        await xTableFilterTypeString.setValue('%кровать%');
        assert.isFalse(await xTableFilterTypeString.isStrict(), 'Фильтр не перешёл в нестрогий режим');

        const firstCol = await xTableFilterTypeString.getFirstColValues();
        assert.deepEqual(['Кровать', 'Кровать детская', 'Эвкалиптовая кровать'], firstCol);
      });

      /**
       * Scenario: Если ввести значение в фильтр с % в середине, то таблица показывает только элементы, которые содержат подстроку, подходящую под введённый шаблон
       *   When пользователь вводит текст в поле с % в середине
       *   Then таблица показывает только элементы, которые содержат подстроку, подходящую под введённый шаблон
       */
      it('Если ввести значение в фильтр с % в середине, то таблица показывает только элементы, которые содержат подстроку, подходящую под введённый шаблон', async function () {
        const xTableFilterTypeString = new XTableFilterTypeString(this.browser);

        await xTableFilterTypeString.setValue('к%ть');

        const firstCol = await xTableFilterTypeString.getFirstColValues();
        assert.deepEqual(['Кровать', 'Кровать детская', 'Скатерть', 'Эвкалиптовая кровать'], firstCol);
      });

      /**
       * Scenario: Если ввести значение в фильтр с "%" в середине в строгом режиме, то таблица показывает только элементы, значение которых подходит под введённый шаблон
       *   When пользователь кликает по кнопке переключения режима фильтрации
       *   Then фильтр переходит в строгий режим
       *   When пользователь вводит текст в поле с "%" в середине
       *   Then таблица показывает только элементы, значение которых подходит под введённый шаблон
       */
      it('Если ввести значение в фильтр с "%" в середине, то таблица показывает только элементы, значение которых подходит под введённый шаблон', async function () {
        const xTableFilterTypeString = new XTableFilterTypeString(this.browser);

        await xTableFilterTypeString.toggleStrictness();
        await xTableFilterTypeString.setValue('к%ть');

        const firstCol = await xTableFilterTypeString.getFirstColValues();
        assert.deepEqual(['Кровать'], firstCol);
      });

      /**
       * Scenario: Если ввести значение в фильтр с "." в строгом режиме, то таблица показывает только элементы, значение которых подходит под введённый шаблон
       *   When пользователь кликает по кнопке переключения режима фильтрации
       *   Then фильтр переходит в строгий режим
       *   When пользователь вводит текст в поле с "."
       *   Then таблица показывает только элементы, значение которых подходит под введённый шаблон
       */
      it('Если ввести значение в фильтр с ".", то таблица показывает только элементы, значение которых подходит под введённый шаблон', async function () {
        const xTableFilterTypeString = new XTableFilterTypeString(this.browser);

        await xTableFilterTypeString.toggleStrictness();
        await xTableFilterTypeString.setValue('ст.л');

        const firstCol = await xTableFilterTypeString.getFirstColValues();
        assert.deepEqual(['Стол', 'Стул'], firstCol);
      });
    });
  });
});
