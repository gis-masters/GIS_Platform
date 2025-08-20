import { describe, expect, test } from '@jest/globals';

import { PropertySchemaChoice, PropertyType } from '../../data/schema/schema.models';
import { validateFieldValue } from './formValidation.utils';

describe('валидация значения поля validateFieldValue', () => {
  describe('поле choice', () => {
    const choiceProperty: PropertySchemaChoice = {
      name: 'a',
      title: 'a',
      propertyType: PropertyType.CHOICE,
      options: [
        { value: 'a', title: 'a' },
        { value: 'b', title: 'b' },
        { value: 3, title: '#3' }
      ]
    };

    const aRequiredError = { field: 'a', hidden: undefined, messages: ['Обязательное поле '], title: 'a' };
    const aNoError = { field: 'a', hidden: undefined, messages: [], title: 'a' };
    const aNotInOptionsError = { field: 'a', hidden: undefined, messages: ['Недопустимое значение '], title: 'a' };

    const choicePropertyRequired: PropertySchemaChoice = {
      ...choiceProperty,
      required: true
    };

    describe('single', () => {
      test('значение `` считается пустым и не проходит проверку required', () => {
        expect(validateFieldValue('', choicePropertyRequired, { a: '' })).toEqual(aRequiredError);
      });

      test('значение `` считается пустым, является не обязательным и проходит проверку required', () => {
        expect(validateFieldValue('', choiceProperty, { a: '' })).toEqual(aNoError);
      });

      test('значение undefined считается пустым и не проходит проверку required', () => {
        expect(validateFieldValue(undefined, choicePropertyRequired, {})).toEqual(aRequiredError);
      });

      test('значение null считается пустым и не проходит проверку required', () => {
        expect(validateFieldValue(null, choicePropertyRequired, { a: null })).toEqual(aRequiredError);
      });

      test('значение `bb` не содержится в опциях и не проходит проверку', () => {
        expect(validateFieldValue('bb', choicePropertyRequired, { a: 'bb' })).toEqual(aNotInOptionsError);
      });

      test('значение `` содержится в опциях, но не проходит проверку required', () => {
        expect(
          validateFieldValue(
            '',
            {
              ...choicePropertyRequired,
              options: [...choicePropertyRequired.options, { title: 'пустота', value: '' }]
            },
            { a: '' }
          )
        ).toEqual(aRequiredError);
      });
    });

    describe('multiple', () => {
      const choicePropertyRequiredMultiple = {
        ...choicePropertyRequired,
        multiple: true
      };

      test('значение `[]` считается пустым и не проходит проверку required', () => {
        expect(validateFieldValue('[]', choicePropertyRequiredMultiple, { a: '[]' })).toEqual(aRequiredError);
      });

      test('значение undefined считается пустым и не проходит проверку required', () => {
        expect(validateFieldValue(undefined, choicePropertyRequiredMultiple, {})).toEqual(aRequiredError);
      });

      test('значение null считается пустым и не проходит проверку required', () => {
        expect(validateFieldValue(null, choicePropertyRequiredMultiple, { a: null })).toEqual(aRequiredError);
      });

      test('значение `` считается пустым и не проходит проверку required', () => {
        expect(validateFieldValue('', choicePropertyRequiredMultiple, { a: '' })).toEqual(aRequiredError);
      });

      test("значение `['bb']` не содержится в опциях и не проходит проверку", () => {
        expect(validateFieldValue(['bb'], choicePropertyRequiredMultiple, { a: ['bb'] })).toEqual(aNotInOptionsError);
      });

      test('значение `` содержится в опциях и не проходит проверку required', () => {
        expect(
          validateFieldValue(
            '',
            {
              ...choicePropertyRequiredMultiple,
              options: [...choicePropertyRequiredMultiple.options, { title: 'пустота', value: '' }]
            },
            { a: '' }
          )
        ).toEqual(aRequiredError);
      });

      test("значение `['b']` содержится в опциях и проходит проверку", () => {
        expect(validateFieldValue(['b'], choicePropertyRequiredMultiple, { a: ['b'] })).toEqual(aNoError);
      });

      test('значение `b` содержится в опциях и проходит проверку', () => {
        expect(validateFieldValue('b', choicePropertyRequiredMultiple, { a: 'b' })).toEqual(aNoError);
      });

      test("значение `['b', 3]` содержится в опциях и проходит проверку", () => {
        expect(validateFieldValue(['b', 3], choicePropertyRequiredMultiple, { a: ['b', 3] })).toEqual(aNoError);
      });
    });
  });
});
