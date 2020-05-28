import { FormControl } from '@angular/forms';

import { PropertySchema } from '../crg/schema.service';
import { FeaturePropertyValidators, ValueType } from './FeaturePropertyValidators';
import { ValueTitleProjection } from '../geoserver/projections';

describe('Property validation test', () => {
  it('should validate required', () => {
    const requiredProperty: PropertySchema = {
      name: 'requiredProperty',
      title: 'Required property',
      valueType: 'CHOICE',
      required: true,
    };

    const notRequiredProperty: PropertySchema = {
      name: 'requiredProperty',
      title: 'Required property',
      valueType: 'CHOICE',
      required: false,
    };

    const fcValid = new FormControl('someValue', [FeaturePropertyValidators.validate(requiredProperty)]);
    const fcNotValid = new FormControl('', [FeaturePropertyValidators.validate(requiredProperty)]);
    const fcNotValid2 = new FormControl(undefined, [FeaturePropertyValidators.validate(requiredProperty)]);
    const fcNotValid3 = new FormControl(null, [FeaturePropertyValidators.validate(requiredProperty)]);
    const fc1 = new FormControl('', [FeaturePropertyValidators.validate(notRequiredProperty)]);

    expect(true).toEqual(fcValid.valid);
    expect(false).toEqual(fcNotValid.valid);
    expect(false).toEqual(fcNotValid2.valid);
    expect(false).toEqual(fcNotValid3.valid);
    expect(true).toEqual(fc1.valid);
    expect('Поле обязательно к заполнению').toEqual(fcNotValid3.errors['required']);
  });

  it('should validate minLength', () => {
    const minLengthProperty: PropertySchema = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: ValueType.STRING,
      required: true,
      minLength: 5,
    };

    const requiredStringProperty: PropertySchema = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: ValueType.STRING,
      required: true,
      minLength: 0,
    };

    const requiredUndefinedProperty: PropertySchema = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: ValueType.STRING,
      required: true,
      minLength: undefined,
    };

    const notMinLengthProperty: PropertySchema = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: ValueType.STRING,
      required: true,
      minLength: -1,
    };

    const minLengthValid = new FormControl('12345', [FeaturePropertyValidators.validate(minLengthProperty)]);
    const minLengthValid1 = new FormControl('123456', [FeaturePropertyValidators.validate(minLengthProperty)]);
    const minLengthNotValid = new FormControl('', [FeaturePropertyValidators.validate(minLengthProperty)]);
    const minLengthNotValid2 = new FormControl('123', [FeaturePropertyValidators.validate(minLengthProperty)]);
    const notEmptyValue = new FormControl('123', [FeaturePropertyValidators.validate(requiredStringProperty)]);
    const emptyValue = new FormControl('', [FeaturePropertyValidators.validate(requiredStringProperty)]);
    const undefinedMinLengthValid = new FormControl('123', [FeaturePropertyValidators.validate(requiredUndefinedProperty)]);
    const emptyValue2 = new FormControl('', [FeaturePropertyValidators.validate(requiredUndefinedProperty)]);
    const notMinLengthValid = new FormControl('123', [FeaturePropertyValidators.validate(notMinLengthProperty)]);
    const notMinLengthValid2 = new FormControl('', [FeaturePropertyValidators.validate(notMinLengthProperty)]);

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
    const maxLengthProperty: PropertySchema = {
      name: 'maxLengthProperty',
      title: 'maxLength property',
      valueType: ValueType.STRING,
      required: true,
      maxLength: 5,
    };

    const nullMaxLengthProperty: PropertySchema = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: ValueType.STRING,
      required: true,
      minLength: 0,
    };

    const undefinedMaxLengthProperty: PropertySchema = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: ValueType.STRING,
      required: true,
      minLength: undefined,
    };

    const notMaxLengthProperty: PropertySchema = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: ValueType.STRING,
      required: true,
      minLength: -1,
    };

    const maxLengthValid = new FormControl('12345', [FeaturePropertyValidators.validate(maxLengthProperty)]);
    const maxLengthValid2 = new FormControl('123', [FeaturePropertyValidators.validate(maxLengthProperty)]);
    const maxLengthValid3 = new FormControl('', [FeaturePropertyValidators.validate(maxLengthProperty)]);
    const maxLengthNotValid = new FormControl('123456', [FeaturePropertyValidators.validate(maxLengthProperty)]);
    const nullMaxLengthValid = new FormControl('123', [FeaturePropertyValidators.validate(nullMaxLengthProperty)]);
    const nullMaxLengthValid2 = new FormControl('', [FeaturePropertyValidators.validate(nullMaxLengthProperty)]);
    const undefinedMaxLengthValid = new FormControl('123', [FeaturePropertyValidators.validate(undefinedMaxLengthProperty)]);
    const undefinedMaxLengthValid2 = new FormControl('', [FeaturePropertyValidators.validate(undefinedMaxLengthProperty)]);
    const notMaxLengthValid = new FormControl('123', [FeaturePropertyValidators.validate(notMaxLengthProperty)]);
    const notMaxLengthValid2 = new FormControl('', [FeaturePropertyValidators.validate(notMaxLengthProperty)]);

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
    expect('Превышена допустимая длинна сроки. Допустимо: ' + maxLengthProperty.maxLength + ' символов')
      .toEqual(maxLengthNotValid.errors['maxLength']);
  });

  it('should validate pattern', () => {
    const patternProperty: PropertySchema = {
      name: 'patternProperty',
      title: 'pattern property',
      valueType: ValueType.STRING,
      required: true,
      pattern: '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8,}$',
    };

    const nullPatternProperty: PropertySchema = {
      name: 'patternProperty',
      title: 'pattern property',
      valueType: ValueType.STRING,
      required: true,
      pattern: null,
    };

    const undefinedPatternProperty: PropertySchema = {
      name: 'patternProperty',
      title: 'pattern property',
      valueType: ValueType.STRING,
      required: true,
      pattern: undefined,
    };

    const patternPropertyValid = new FormControl('Ab12345678', [FeaturePropertyValidators.validate(patternProperty)]);
    const patternPropertyNotValid = new FormControl('b12345678', [FeaturePropertyValidators.validate(patternProperty)]);
    const patternPropertyNotValid2 = new FormControl('', [FeaturePropertyValidators.validate(patternProperty)]);
    const nullPatternPropertyValid = new FormControl('A', [FeaturePropertyValidators.validate(nullPatternProperty)]);
    const nullPatternPropertyValid2 = new FormControl('', [FeaturePropertyValidators.validate(nullPatternProperty)]);
    const undefinedPatternPropertyValid = new FormControl('A', [FeaturePropertyValidators.validate(undefinedPatternProperty)]);

    expect(true).toEqual(patternPropertyValid.valid);
    expect(false).toEqual(patternPropertyNotValid.valid);
    expect(false).toEqual(patternPropertyNotValid2.valid);
    expect(true).toEqual(nullPatternPropertyValid.valid);
    expect(false).toEqual(nullPatternPropertyValid2.valid);
    expect(true).toEqual(undefinedPatternPropertyValid.valid);
    expect('Строка не соответствует паттерну').toEqual(patternPropertyNotValid.errors['pattern']);
  });

  it('should validate minInclusive', () => {
    const mi5: PropertySchema = {
      name: 'minInclusiveProperty',
      title: 'minInclusive property',
      valueType: ValueType.INT,
      required: true,
      minInclusive: 5,
    };

    const mi0: PropertySchema = {
      name: 'minInclusiveProperty',
      title: 'minInclusive property',
      valueType: ValueType.INT,
      required: true,
      minInclusive: 0,
    };

    const miUndefined: PropertySchema = {
      name: 'minInclusiveProperty',
      title: 'minInclusive property',
      valueType: ValueType.INT,
      required: true,
      minInclusive: undefined,
    };

    const miNotSet: PropertySchema = {
      name: 'minInclusiveProperty',
      title: 'minInclusive property',
      valueType: ValueType.INT,
      required: true,
      minInclusive: -1,
    };

    expect(false).toEqual(new FormControl(3, [FeaturePropertyValidators.validate(mi5)]).valid);
    expect(true).toEqual(new FormControl(5, [FeaturePropertyValidators.validate(mi5)]).valid);
    expect(true).toEqual(new FormControl(7, [FeaturePropertyValidators.validate(mi5)]).valid);
    expect(true).toEqual(new FormControl(0, [FeaturePropertyValidators.validate(mi0)]).valid);
    expect(true).toEqual(new FormControl(10, [FeaturePropertyValidators.validate(miUndefined)]).valid);
    expect(true).toEqual(new FormControl(1, [FeaturePropertyValidators.validate(miNotSet)]).valid);
    expect(true).toEqual(new FormControl(-12, [FeaturePropertyValidators.validate(miNotSet)]).valid);

    const formControl = new FormControl(3, [FeaturePropertyValidators.validate(mi5)]);

    expect('Значение: ' + formControl.value + ' менее допустимого: ' + mi5.minInclusive)
      .toEqual(formControl.errors['minInclusive']);
  });

  it('should validate maxInclusive', () => {
    const max5: PropertySchema = {
      name: 'maxInclusiveProperty',
      title: 'maxInclusive property',
      valueType: ValueType.INT,
      required: true,
      maxInclusive: 5,
    };

    const notSetMax: PropertySchema = {
      name: 'maxInclusiveProperty',
      title: 'maxInclusive property',
      valueType: ValueType.INT,
      required: true,
      maxInclusive: -1,
    };

    const notRequiredMax: PropertySchema = {
      name: 'maxInclusiveProperty',
      title: 'maxInclusive property',
      valueType: ValueType.INT,
      required: false,
      maxInclusive: 10,
    };

    expect(true).toEqual(new FormControl(7, [FeaturePropertyValidators.validate(notRequiredMax)]).valid);
    expect(false).toEqual(new FormControl(7, [FeaturePropertyValidators.validate(max5)]).valid);
    expect(true).toEqual(new FormControl(5, [FeaturePropertyValidators.validate(max5)]).valid);
    expect(true).toEqual(new FormControl('5', [FeaturePropertyValidators.validate(max5)]).valid);
    expect(true).toEqual(new FormControl(0, [FeaturePropertyValidators.validate(notSetMax)]).valid);
    expect(true).toEqual(new FormControl(10, [FeaturePropertyValidators.validate(notSetMax)]).valid);
    expect(true).toEqual(new FormControl(-10, [FeaturePropertyValidators.validate(notSetMax)]).valid);
  });

  it('should validate enumeration', () => {
    const enumerations: ValueTitleProjection[] = [
      {
        value: '1',
        title: 'first'
      },
      {
        value: '2',
        title: 'second'
      },
    ];

    const simpleProperty: PropertySchema = {
      name: 'enumerationProperty',
      title: 'enumerationProperty',
      valueType: 'CHOICE',
      required: true,
      description: 'description',
      enumerations: enumerations,
    };

    const enumerationPropertyValid = new FormControl(1, [FeaturePropertyValidators.validate(simpleProperty)]);
    const enumerationPropertyNotValid = new FormControl(0, [FeaturePropertyValidators.validate(simpleProperty)]);
    const enumerationPropertyNotValid2 = new FormControl(3, [FeaturePropertyValidators.validate(simpleProperty)]);
    const nullEnumerationPropertyNotValid = new FormControl(null, [FeaturePropertyValidators.validate(simpleProperty)]);
    const stringEnumerationPropertyNotValid = new FormControl('asdfas', [FeaturePropertyValidators.validate(simpleProperty)]);

    expect(true).toEqual(enumerationPropertyValid.valid);
    expect(false).toEqual(enumerationPropertyNotValid.valid);
    expect(false).toEqual(enumerationPropertyNotValid2.valid);
    expect(false).toEqual(nullEnumerationPropertyNotValid.valid);
    expect(false).toEqual(stringEnumerationPropertyNotValid.valid);
    expect('Значение: ' + enumerationPropertyNotValid.value + ' не соответствует справочному')
      .toEqual(enumerationPropertyNotValid.errors['wrongChoice']);
  });

  it('should validate totalDigits', () => {
    const notRequiredDoubleProperty: PropertySchema = {
      name: 'DoubleProperty',
      title: 'DoubleProperty',
      valueType: ValueType.DOUBLE,
      required: false,
      description: 'description',
      totalDigits: -1,
    };

    const requiredDoubleProperty: PropertySchema = {
      name: 'stringProperty',
      title: 'stringProperty',
      valueType: ValueType.DOUBLE,
      required: true,
      description: 'description',
      totalDigits: 4,
    };

    const totalDigitsPropertyValid = new FormControl(1, [FeaturePropertyValidators.validate(notRequiredDoubleProperty)]);
    const totalDigitsPropertyNotValid = new FormControl(987987, [FeaturePropertyValidators.validate(requiredDoubleProperty)]);
    const requiredAndUndefined = new FormControl(undefined, [FeaturePropertyValidators.validate(requiredDoubleProperty)]);

    expect(true).toEqual(totalDigitsPropertyValid.valid);
    expect(false).toEqual(totalDigitsPropertyNotValid.valid);
    expect(false).toEqual(requiredAndUndefined.valid);
  });
});
