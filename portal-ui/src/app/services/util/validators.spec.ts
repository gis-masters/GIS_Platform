/* eslint-disable unicorn/numeric-separators-style */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-undef */

import { UntypedFormControl } from '@angular/forms';

import { OldPropertySchema, ValueType } from '../data/schemaOld.models';
import { FeaturePropertyValidators } from './FeaturePropertyValidators';

describe('Property validation test', () => {
  it('should validate required', () => {
    const requiredProperty: OldPropertySchema = {
      name: 'requiredProperty',
      title: 'Required property',
      valueType: ValueType.CHOICE,
      required: true
    };

    const notRequiredProperty: OldPropertySchema = {
      name: 'requiredProperty',
      title: 'Required property',
      valueType: ValueType.CHOICE,
      required: false
    };

    const fcValid = new UntypedFormControl('someValue', [FeaturePropertyValidators.validate(requiredProperty)]);
    const fcNotValid = new UntypedFormControl('', [FeaturePropertyValidators.validate(requiredProperty)]);
    const fcNotValid2 = new UntypedFormControl(undefined, [FeaturePropertyValidators.validate(requiredProperty)]);
    const fcNotValid3 = new UntypedFormControl(null, [FeaturePropertyValidators.validate(requiredProperty)]);
    const fc1 = new UntypedFormControl('', [FeaturePropertyValidators.validate(notRequiredProperty)]);

    expect(true).toEqual(fcValid.valid);
    expect(false).toEqual(fcNotValid.valid);
    expect(false).toEqual(fcNotValid2.valid);
    expect(false).toEqual(fcNotValid3.valid);
    expect(true).toEqual(fc1.valid);
    expect('Поле обязательно к заполнению').toEqual(fcNotValid3.errors['required']);
  });

  it('should validate minLength', () => {
    const minLengthProperty: OldPropertySchema = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: ValueType.STRING,
      required: true,
      minLength: 5
    };

    const requiredStringProperty: OldPropertySchema = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: ValueType.STRING,
      required: true,
      minLength: 0
    };

    const requiredUndefinedProperty: OldPropertySchema = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: ValueType.STRING,
      required: true,
      minLength: undefined
    };

    const notMinLengthProperty: OldPropertySchema = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: ValueType.STRING,
      required: true,
      minLength: -1
    };

    const minLengthValid = new UntypedFormControl('12345', [FeaturePropertyValidators.validate(minLengthProperty)]);
    const minLengthValid1 = new UntypedFormControl('123456', [FeaturePropertyValidators.validate(minLengthProperty)]);
    const minLengthNotValid = new UntypedFormControl('', [FeaturePropertyValidators.validate(minLengthProperty)]);
    const minLengthNotValid2 = new UntypedFormControl('123', [FeaturePropertyValidators.validate(minLengthProperty)]);
    const notEmptyValue = new UntypedFormControl('123', [FeaturePropertyValidators.validate(requiredStringProperty)]);
    const emptyValue = new UntypedFormControl('', [FeaturePropertyValidators.validate(requiredStringProperty)]);
    const undefinedMinLengthValid = new UntypedFormControl('123', [
      FeaturePropertyValidators.validate(requiredUndefinedProperty)
    ]);
    const emptyValue2 = new UntypedFormControl('', [FeaturePropertyValidators.validate(requiredUndefinedProperty)]);
    const notMinLengthValid = new UntypedFormControl('123', [FeaturePropertyValidators.validate(notMinLengthProperty)]);
    const notMinLengthValid2 = new UntypedFormControl('', [FeaturePropertyValidators.validate(notMinLengthProperty)]);

    expect(true).toEqual(minLengthValid.valid);
    expect(true).toEqual(minLengthValid1.valid);
    expect(false).toEqual(minLengthNotValid.valid);
    expect(false).toEqual(minLengthNotValid2.valid);
    expect(true).toEqual(notEmptyValue.valid);
    expect(false).toEqual(emptyValue.valid);
    expect(true).toEqual(undefinedMinLengthValid.valid);
    expect(false).toEqual(emptyValue2.valid);
    expect(true).toEqual(notMinLengthValid.valid);
    expect(false).toEqual(notMinLengthValid2.valid);
  });

  it('should validate maxLength', () => {
    const maxLengthProperty: OldPropertySchema = {
      name: 'maxLengthProperty',
      title: 'maxLength property',
      valueType: ValueType.STRING,
      required: true,
      maxLength: 5
    };

    const nullMaxLengthProperty: OldPropertySchema = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: ValueType.STRING,
      required: true,
      minLength: 0
    };

    const undefinedMaxLengthProperty: OldPropertySchema = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: ValueType.STRING,
      required: true,
      minLength: undefined
    };

    const notMaxLengthProperty: OldPropertySchema = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: ValueType.STRING,
      required: true,
      minLength: -1
    };

    const maxLengthValid = new UntypedFormControl('12345', [FeaturePropertyValidators.validate(maxLengthProperty)]);
    const maxLengthValid2 = new UntypedFormControl('123', [FeaturePropertyValidators.validate(maxLengthProperty)]);
    const maxLengthValid3 = new UntypedFormControl('', [FeaturePropertyValidators.validate(maxLengthProperty)]);
    const maxLengthNotValid = new UntypedFormControl('123456', [FeaturePropertyValidators.validate(maxLengthProperty)]);
    const nullMaxLengthValid = new UntypedFormControl('123', [
      FeaturePropertyValidators.validate(nullMaxLengthProperty)
    ]);
    const nullMaxLengthValid2 = new UntypedFormControl('', [FeaturePropertyValidators.validate(nullMaxLengthProperty)]);
    const undefinedMaxLengthValid = new UntypedFormControl('123', [
      FeaturePropertyValidators.validate(undefinedMaxLengthProperty)
    ]);
    const undefinedMaxLengthValid2 = new UntypedFormControl('', [
      FeaturePropertyValidators.validate(undefinedMaxLengthProperty)
    ]);
    const notMaxLengthValid = new UntypedFormControl('123', [FeaturePropertyValidators.validate(notMaxLengthProperty)]);
    const notMaxLengthValid2 = new UntypedFormControl('', [FeaturePropertyValidators.validate(notMaxLengthProperty)]);

    expect(true).toEqual(maxLengthValid.valid);
    expect(true).toEqual(maxLengthValid2.valid);
    expect(false).toEqual(maxLengthValid3.valid);
    expect(false).toEqual(maxLengthNotValid.valid);
    expect(true).toEqual(nullMaxLengthValid.valid);
    expect(false).toEqual(nullMaxLengthValid2.valid);
    expect(true).toEqual(undefinedMaxLengthValid.valid);
    expect(false).toEqual(undefinedMaxLengthValid2.valid);
    expect(true).toEqual(notMaxLengthValid.valid);
    expect(false).toEqual(notMaxLengthValid2.valid);
    expect('Превышена допустимая длинна сроки. Допустимо: ' + maxLengthProperty.maxLength + ' символов').toEqual(
      maxLengthNotValid.errors['maxLength']
    );
  });

  it('should validate pattern', () => {
    const patternProperty: OldPropertySchema = {
      name: 'patternProperty',
      title: 'pattern property',
      valueType: ValueType.STRING,
      required: true,
      pattern: '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8,}$'
    };

    const nullPatternProperty: OldPropertySchema = {
      name: 'patternProperty',
      title: 'pattern property',
      valueType: ValueType.STRING,
      required: true,
      pattern: null
    };

    const undefinedPatternProperty: OldPropertySchema = {
      name: 'patternProperty',
      title: 'pattern property',
      valueType: ValueType.STRING,
      required: true,
      pattern: undefined
    };

    const patternPropertyValid = new UntypedFormControl('Ab12345678', [
      FeaturePropertyValidators.validate(patternProperty)
    ]);
    const patternPropertyNotValid = new UntypedFormControl('b12345678', [
      FeaturePropertyValidators.validate(patternProperty)
    ]);
    const patternPropertyNotValid2 = new UntypedFormControl('', [FeaturePropertyValidators.validate(patternProperty)]);
    const nullPatternPropertyValid = new UntypedFormControl('A', [
      FeaturePropertyValidators.validate(nullPatternProperty)
    ]);
    const nullPatternPropertyValid2 = new UntypedFormControl('', [
      FeaturePropertyValidators.validate(nullPatternProperty)
    ]);
    const undefinedPatternPropertyValid = new UntypedFormControl('A', [
      FeaturePropertyValidators.validate(undefinedPatternProperty)
    ]);

    expect(true).toEqual(patternPropertyValid.valid);
    expect(false).toEqual(patternPropertyNotValid.valid);
    expect(false).toEqual(patternPropertyNotValid2.valid);
    expect(true).toEqual(nullPatternPropertyValid.valid);
    expect(false).toEqual(nullPatternPropertyValid2.valid);
    expect(true).toEqual(undefinedPatternPropertyValid.valid);
    expect('Строка не соответствует паттерну').toEqual(patternPropertyNotValid.errors['pattern']);
  });

  it('should validate minInclusive', () => {
    const mi5: OldPropertySchema = {
      name: 'minInclusiveProperty',
      title: 'minInclusive property',
      valueType: ValueType.INT,
      required: true,
      minInclusive: 5
    };

    const mi0: OldPropertySchema = {
      name: 'minInclusiveProperty',
      title: 'minInclusive property',
      valueType: ValueType.INT,
      required: true,
      minInclusive: 0
    };

    const miUndefined: OldPropertySchema = {
      name: 'minInclusiveProperty',
      title: 'minInclusive property',
      valueType: ValueType.INT,
      required: true,
      minInclusive: undefined
    };

    const miNotSet: OldPropertySchema = {
      name: 'minInclusiveProperty',
      title: 'minInclusive property',
      valueType: ValueType.INT,
      required: true,
      minInclusive: -1
    };

    expect(false).toEqual(new UntypedFormControl(3, [FeaturePropertyValidators.validate(mi5)]).valid);
    expect(true).toEqual(new UntypedFormControl(5, [FeaturePropertyValidators.validate(mi5)]).valid);
    expect(true).toEqual(new UntypedFormControl(7, [FeaturePropertyValidators.validate(mi5)]).valid);
    expect(true).toEqual(new UntypedFormControl(0, [FeaturePropertyValidators.validate(mi0)]).valid);
    expect(true).toEqual(new UntypedFormControl(10, [FeaturePropertyValidators.validate(miUndefined)]).valid);
    expect(true).toEqual(new UntypedFormControl(1, [FeaturePropertyValidators.validate(miNotSet)]).valid);
    expect(true).toEqual(new UntypedFormControl(-12, [FeaturePropertyValidators.validate(miNotSet)]).valid);

    const formControl = new UntypedFormControl(3, [FeaturePropertyValidators.validate(mi5)]);

    expect('Значение: ' + formControl.value + ' менее допустимого: ' + mi5.minInclusive).toEqual(
      formControl.errors['minInclusive']
    );
  });

  it('should validate maxInclusive', () => {
    const max5: OldPropertySchema = {
      name: 'maxInclusiveProperty',
      title: 'maxInclusive property',
      valueType: ValueType.INT,
      required: true,
      maxInclusive: 5
    };

    const notSetMax: OldPropertySchema = {
      name: 'maxInclusiveProperty',
      title: 'maxInclusive property',
      valueType: ValueType.INT,
      required: true,
      maxInclusive: -1
    };

    const notRequiredMax: OldPropertySchema = {
      name: 'maxInclusiveProperty',
      title: 'maxInclusive property',
      valueType: ValueType.INT,
      required: false,
      maxInclusive: 10
    };

    expect(true).toEqual(new UntypedFormControl(7, [FeaturePropertyValidators.validate(notRequiredMax)]).valid);
    expect(false).toEqual(new UntypedFormControl(7, [FeaturePropertyValidators.validate(max5)]).valid);
    expect(true).toEqual(new UntypedFormControl(5, [FeaturePropertyValidators.validate(max5)]).valid);
    expect(true).toEqual(new UntypedFormControl('5', [FeaturePropertyValidators.validate(max5)]).valid);
    expect(true).toEqual(new UntypedFormControl(0, [FeaturePropertyValidators.validate(notSetMax)]).valid);
    expect(true).toEqual(new UntypedFormControl(10, [FeaturePropertyValidators.validate(notSetMax)]).valid);
    expect(true).toEqual(new UntypedFormControl(-10, [FeaturePropertyValidators.validate(notSetMax)]).valid);
  });

  it('should validate enumeration', () => {
    const enumerations = [
      {
        value: '1',
        title: 'first'
      },
      {
        value: '2',
        title: 'second'
      }
    ];

    const simpleProperty: OldPropertySchema = {
      name: 'enumerationProperty',
      title: 'enumerationProperty',
      valueType: ValueType.CHOICE,
      required: true,
      description: 'description',
      enumerations: enumerations
    };

    const enumerationPropertyValid = new UntypedFormControl(1, [FeaturePropertyValidators.validate(simpleProperty)]);
    const enumerationPropertyNotValid = new UntypedFormControl(0, [FeaturePropertyValidators.validate(simpleProperty)]);
    const enumerationPropertyNotValid2 = new UntypedFormControl(3, [
      FeaturePropertyValidators.validate(simpleProperty)
    ]);
    const nullEnumerationPropertyNotValid = new UntypedFormControl(null, [
      FeaturePropertyValidators.validate(simpleProperty)
    ]);
    const stringEnumerationPropertyNotValid = new UntypedFormControl('asdfas', [
      FeaturePropertyValidators.validate(simpleProperty)
    ]);

    expect(true).toEqual(enumerationPropertyValid.valid);
    expect(false).toEqual(enumerationPropertyNotValid.valid);
    expect(false).toEqual(enumerationPropertyNotValid2.valid);
    expect(false).toEqual(nullEnumerationPropertyNotValid.valid);
    expect(false).toEqual(stringEnumerationPropertyNotValid.valid);
    expect('Значение: ' + enumerationPropertyNotValid.value + ' не соответствует справочному').toEqual(
      enumerationPropertyNotValid.errors['wrongChoice']
    );
  });

  it('should validate totalDigits', () => {
    const notRequiredDoubleProperty: OldPropertySchema = {
      name: 'DoubleProperty',
      title: 'DoubleProperty',
      valueType: ValueType.DOUBLE,
      required: false,
      description: 'description',
      totalDigits: -1
    };

    const requiredDoubleProperty: OldPropertySchema = {
      name: 'stringProperty',
      title: 'stringProperty',
      valueType: ValueType.DOUBLE,
      required: true,
      description: 'description',
      totalDigits: 4
    };

    const totalDigitsPropertyValid = new UntypedFormControl(1, [
      FeaturePropertyValidators.validate(notRequiredDoubleProperty)
    ]);
    const totalDigitsPropertyNotValid = new UntypedFormControl(987987, [
      FeaturePropertyValidators.validate(requiredDoubleProperty)
    ]);
    const requiredAndUndefined = new UntypedFormControl(undefined, [
      FeaturePropertyValidators.validate(requiredDoubleProperty)
    ]);

    expect(true).toEqual(totalDigitsPropertyValid.valid);
    expect(false).toEqual(totalDigitsPropertyNotValid.valid);
    expect(false).toEqual(requiredAndUndefined.valid);
  });
});
