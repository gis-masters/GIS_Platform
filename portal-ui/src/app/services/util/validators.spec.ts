import {SimpleProperty} from '../crg/fgistp-rules.service';
import {FeaturePropertyValidators} from './FeaturePropertyValidators';
import {FormControl} from '@angular/forms';
import {ValueTitleProjection} from '../geoserver/projections';

describe('Property validation test', () => {

  it('should validate required', () => {
    const requiredProperty: SimpleProperty = {
      name: 'requiredProperty',
      title: 'Required property',
      valueType: 'CHOICE',
      required: true,
    };

    const notRequiredProperty: SimpleProperty = {
      name: 'requiredProperty',
      title: 'Required property',
      valueType: 'CHOICE',
      required: false,
    };

    const fcValid = new FormControl('someValue', [FeaturePropertyValidators.required(requiredProperty)]);
    const fcNotValid = new FormControl('', [FeaturePropertyValidators.required(requiredProperty)]);
    const fcNotValid2 = new FormControl(undefined, [FeaturePropertyValidators.required(requiredProperty)]);
    const fcNotValid3 = new FormControl(null, [FeaturePropertyValidators.required(requiredProperty)]);
    const fc1 = new FormControl('', [FeaturePropertyValidators.required(notRequiredProperty)]);

    expect(true).toEqual(fcValid.valid);
    expect(false).toEqual(fcNotValid.valid);
    expect(false).toEqual(fcNotValid2.valid);
    expect(false).toEqual(fcNotValid3.valid);
    expect(true).toEqual(fc1.valid);
    expect('Поле обязательно к заполнению').toEqual(fcNotValid3.errors['required']);
  });

  it('should validate minLength', () => {
    const minLengthProperty: SimpleProperty = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: 'string',
      required: true,
      minLength: 5,
    };

    const nullMinLengthProperty: SimpleProperty = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: 'string',
      required: true,
      minLength: 0,
    };

    const undefinedMinLengthProperty: SimpleProperty = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: 'string',
      required: true,
      minLength: undefined,
    };

    const notMinLengthProperty: SimpleProperty = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: 'string',
      required: true,
      minLength: -1,
    };

    const minLengthValid = new FormControl('12345', [FeaturePropertyValidators.minLength(minLengthProperty)]);
    const minLengthValid1 = new FormControl('123456', [FeaturePropertyValidators.minLength(minLengthProperty)]);
    const minLengthNotValid = new FormControl('', [FeaturePropertyValidators.minLength(minLengthProperty)]);
    const minLengthNotValid2 = new FormControl('123', [FeaturePropertyValidators.minLength(minLengthProperty)]);
    const nullMinLengthValid = new FormControl('123', [FeaturePropertyValidators.minLength(nullMinLengthProperty)]);
    const nullMinLengthValid2 = new FormControl('', [FeaturePropertyValidators.minLength(nullMinLengthProperty)]);
    const undefinedMinLengthValid = new FormControl('123', [FeaturePropertyValidators.minLength(undefinedMinLengthProperty)]);
    const undefinedMinLengthValid2 = new FormControl('', [FeaturePropertyValidators.minLength(undefinedMinLengthProperty)]);
    const notMinLengthValid = new FormControl('123', [FeaturePropertyValidators.minLength(notMinLengthProperty)]);
    const notMinLengthValid2 = new FormControl('', [FeaturePropertyValidators.minLength(notMinLengthProperty)]);

    expect(true).toEqual(minLengthValid.valid);
    expect(true).toEqual(minLengthValid1.valid);
    expect(false).toEqual(minLengthNotValid.valid);
    expect(false).toEqual(minLengthNotValid2.valid);
    expect(true).toEqual(nullMinLengthValid.valid);
    expect(true).toEqual(nullMinLengthValid2.valid);
    expect(true).toEqual(undefinedMinLengthValid.valid);
    expect(true).toEqual(undefinedMinLengthValid2.valid);
    expect(true).toEqual(notMinLengthValid.valid);
    expect(true).toEqual(notMinLengthValid2.valid);
    expect('Строка слишком короткая минимальныя длинна сроки: ' + minLengthProperty.minLength + ' символов').toEqual(minLengthNotValid.errors['minLength']);
  });

  it('should validate maxLength', () => {
    const maxLengthProperty: SimpleProperty = {
      name: 'maxLengthProperty',
      title: 'maxLength property',
      valueType: 'string',
      required: true,
      maxLength: 5,
    };

    const nullMaxLengthProperty: SimpleProperty = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: 'string',
      required: true,
      minLength: 0,
    };

    const undefinedMaxLengthProperty: SimpleProperty = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: 'string',
      required: true,
      minLength: undefined,
    };

    const notMaxLengthProperty: SimpleProperty = {
      name: 'minLengthProperty',
      title: 'minLength property',
      valueType: 'string',
      required: true,
      minLength: -1,
    };

    const maxLengthValid = new FormControl('12345', [FeaturePropertyValidators.maxLength(maxLengthProperty)]);
    const maxLengthValid2 = new FormControl('123', [FeaturePropertyValidators.maxLength(maxLengthProperty)]);
    const maxLengthValid3 = new FormControl('', [FeaturePropertyValidators.maxLength(maxLengthProperty)]);
    const maxLengthNotValid = new FormControl('123456', [FeaturePropertyValidators.maxLength(maxLengthProperty)]);
    const nullMaxLengthValid = new FormControl('123', [FeaturePropertyValidators.maxLength(nullMaxLengthProperty)]);
    const nullMaxLengthValid2 = new FormControl('', [FeaturePropertyValidators.maxLength(nullMaxLengthProperty)]);
    const undefinedMaxLengthValid = new FormControl('123', [FeaturePropertyValidators.maxLength(undefinedMaxLengthProperty)]);
    const undefinedMaxLengthValid2 = new FormControl('', [FeaturePropertyValidators.maxLength(undefinedMaxLengthProperty)]);
    const notMaxLengthValid = new FormControl('123', [FeaturePropertyValidators.maxLength(notMaxLengthProperty)]);
    const notMaxLengthValid2 = new FormControl('', [FeaturePropertyValidators.maxLength(notMaxLengthProperty)]);

    expect(true).toEqual(maxLengthValid.valid);
    expect(true).toEqual(maxLengthValid2.valid);
    expect(true).toEqual(maxLengthValid3.valid);
    expect(false).toEqual(maxLengthNotValid.valid);
    expect(true).toEqual(nullMaxLengthValid.valid);
    expect(true).toEqual(nullMaxLengthValid2.valid);
    expect(true).toEqual(undefinedMaxLengthValid.valid);
    expect(true).toEqual(undefinedMaxLengthValid2.valid);
    expect(true).toEqual(notMaxLengthValid.valid);
    expect(true).toEqual(notMaxLengthValid2.valid);
    expect('Превышена допустимая длинна сроки. Допустимо: ' + maxLengthProperty.maxLength + ' символов').toEqual(maxLengthNotValid.errors['maxLength']);
  });

  it('should validate pattern', () => {
    const patternProperty: SimpleProperty = {
      name: 'patternProperty',
      title: 'pattern property',
      valueType: 'string',
      required: true,
      pattern: '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8,}$',
    };

    const nullPatternProperty: SimpleProperty = {
      name: 'patternProperty',
      title: 'pattern property',
      valueType: 'string',
      required: true,
      pattern: null,
    };

    const undefinedPatternProperty: SimpleProperty = {
      name: 'patternProperty',
      title: 'pattern property',
      valueType: 'string',
      required: true,
      pattern: undefined,
    };

    const patternPropertyValid = new FormControl('Ab12345678', [FeaturePropertyValidators.pattern(patternProperty)]);
    const patternPropertyNotValid = new FormControl('b12345678', [FeaturePropertyValidators.pattern(patternProperty)]);
    const patternPropertyNotValid2 = new FormControl('', [FeaturePropertyValidators.pattern(patternProperty)]);
    const nullPatternPropertyValid = new FormControl('A', [FeaturePropertyValidators.pattern(nullPatternProperty)]);
    const nullPatternPropertyValid2 = new FormControl('', [FeaturePropertyValidators.pattern(nullPatternProperty)]);
    const undefinedPatternPropertyValid = new FormControl('A', [FeaturePropertyValidators.pattern(undefinedPatternProperty)]);

    expect(true).toEqual(patternPropertyValid.valid);
    expect(false).toEqual(patternPropertyNotValid.valid);
    expect(false).toEqual(patternPropertyNotValid2.valid);
    expect(true).toEqual(nullPatternPropertyValid.valid);
    expect(true).toEqual(nullPatternPropertyValid2.valid);
    expect(true).toEqual(undefinedPatternPropertyValid.valid);
    expect('Строка не соответствует паттерну').toEqual(patternPropertyNotValid.errors['pattern']);
  });

  it('should validate minInclusive', () => {
    const mi5: SimpleProperty = {
      name: 'minInclusiveProperty',
      title: 'minInclusive property',
      valueType: 'number',
      required: true,
      minInclusive: 5,
    };

    const mi0: SimpleProperty = {
      name: 'minInclusiveProperty',
      title: 'minInclusive property',
      valueType: 'number',
      required: true,
      minInclusive: 0,
    };

    const miUndefined: SimpleProperty = {
      name: 'minInclusiveProperty',
      title: 'minInclusive property',
      valueType: 'number',
      required: true,
      minInclusive: undefined,
    };

    const miNotSet: SimpleProperty = {
      name: 'minInclusiveProperty',
      title: 'minInclusive property',
      valueType: 'number',
      required: true,
      minInclusive: -1,
    };

    expect(false).toEqual(new FormControl(3, [FeaturePropertyValidators.minInclusive(mi5)]).valid);
    expect(true).toEqual(new FormControl(5, [FeaturePropertyValidators.minInclusive(mi5)]).valid);
    expect(true).toEqual(new FormControl(7, [FeaturePropertyValidators.minInclusive(mi5)]).valid);
    expect(true).toEqual(new FormControl(0, [FeaturePropertyValidators.minInclusive(mi0)]).valid);
    expect(true).toEqual(new FormControl(10, [FeaturePropertyValidators.minInclusive(miUndefined)]).valid);
    expect(true).toEqual(new FormControl(1, [FeaturePropertyValidators.minInclusive(miNotSet)]).valid);
    expect(true).toEqual(new FormControl(-12, [FeaturePropertyValidators.minInclusive(miNotSet)]).valid);

    const formControl = new FormControl(3, [FeaturePropertyValidators.minInclusive(mi5)]);

    expect('Значение: ' + formControl.value + ' менее допустимого: ' + mi5.minInclusive)
      .toEqual(formControl.errors['minInclusive']);
  });

  it('should validate maxInclusive', () => {
    const max5: SimpleProperty = {
      name: 'maxInclusiveProperty',
      title: 'maxInclusive property',
      valueType: 'number',
      required: true,
      maxInclusive: 5,
    };

    const notSetMax: SimpleProperty = {
      name: 'maxInclusiveProperty',
      title: 'maxInclusive property',
      valueType: 'number',
      required: true,
      maxInclusive: -1,
    };

    const notRequiredMax: SimpleProperty = {
      name: 'maxInclusiveProperty',
      title: 'maxInclusive property',
      valueType: 'number',
      required: false,
      maxInclusive: 10,
    };

    expect(true).toEqual(new FormControl(7, [FeaturePropertyValidators.maxInclusive(notRequiredMax)]).valid);
    expect(false).toEqual(new FormControl(7, [FeaturePropertyValidators.maxInclusive(max5)]).valid);
    expect(true).toEqual(new FormControl(5, [FeaturePropertyValidators.maxInclusive(max5)]).valid);
    expect(true).toEqual(new FormControl('5', [FeaturePropertyValidators.maxInclusive(max5)]).valid);
    expect(false).toEqual(new FormControl('test', [FeaturePropertyValidators.maxInclusive(max5)]).valid);
    // expect(false).toEqual(new FormControl(1.5, [FeaturePropertyValidators.maxInclusive(max5)]).valid);
    // expect(false).toEqual(new FormControl('03', [FeaturePropertyValidators.maxInclusive(max5)]).valid);
    expect(true).toEqual(new FormControl(0, [FeaturePropertyValidators.maxInclusive(notSetMax)]).valid);
    expect(true).toEqual(new FormControl(10, [FeaturePropertyValidators.maxInclusive(notSetMax)]).valid);
    expect(true).toEqual(new FormControl(-10, [FeaturePropertyValidators.maxInclusive(notSetMax)]).valid);
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

    const simpleProperty: SimpleProperty = {
      name: 'enumerationProperty',
      title: 'enumerationProperty',
      valueType: 'CHOICE',
      required: false,
      description: 'description',
      enumerations: enumerations,
    };

    const enumerationPropertyValid = new FormControl(1, [FeaturePropertyValidators.enumeration(simpleProperty)]);
    const enumerationPropertyNotValid = new FormControl(0, [FeaturePropertyValidators.enumeration(simpleProperty)]);
    const enumerationPropertyNotValid2 = new FormControl(3, [FeaturePropertyValidators.enumeration(simpleProperty)]);
    const nullEnumerationPropertyNotValid = new FormControl(null, [FeaturePropertyValidators.enumeration(simpleProperty)]);
    const stringEnumerationPropertyNotValid = new FormControl('asdfas', [FeaturePropertyValidators.enumeration(simpleProperty)]);

    expect(true).toEqual(enumerationPropertyValid.valid);
    expect(false).toEqual(enumerationPropertyNotValid.valid);
    expect(false).toEqual(enumerationPropertyNotValid2.valid);
    expect(false).toEqual(nullEnumerationPropertyNotValid.valid);
    expect(false).toEqual(stringEnumerationPropertyNotValid.valid);
    expect('Значение: ' + enumerationPropertyNotValid.value + ' не соответствует справочному').toEqual(enumerationPropertyNotValid.errors['wrongChoice']);
  });

  it('should validate byType', () => {
    const doubleByTypeProperty: SimpleProperty = {
      name: 'byTypeProperty',
      title: 'byType Property',
      valueType: 'DOUBLE',
      required: false,
    };

    const intByTypeProperty: SimpleProperty = {
      name: 'byTypeProperty',
      title: 'byType Property',
      valueType: 'INT',
      required: false,
    };

    const nullByTypeProperty: SimpleProperty = {
      name: 'byTypeProperty',
      title: 'byType Property',
      valueType: null,
      required: false,
    };

    const undefinedByTypeProperty: SimpleProperty = {
      name: 'byTypeProperty',
      title: 'byType Property',
      valueType: undefined,
      required: false,
    };

    const doubleByTypePropertyValid = new FormControl(1.5, [FeaturePropertyValidators.byType(doubleByTypeProperty)]);
    const nullDoubleByTypePropertyValid = new FormControl(null, [FeaturePropertyValidators.byType(doubleByTypeProperty)]);
    const undefinedDoubleByTypePropertyValid = new FormControl(undefined, [FeaturePropertyValidators.byType(doubleByTypeProperty)]);
    const doubleByTypePropertyNotValid = new FormControl('string', [FeaturePropertyValidators.byType(doubleByTypeProperty)]);
    const intByTypePropertyValid = new FormControl(1.5, [FeaturePropertyValidators.byType(intByTypeProperty)]);
    const intByTypePropertyNotValid = new FormControl('string', [FeaturePropertyValidators.byType(intByTypeProperty)]);
    const nullByTypePropertyValid = new FormControl('string', [FeaturePropertyValidators.byType(nullByTypeProperty)]);
    const undefinedByTypePropertyValid = new FormControl('string', [FeaturePropertyValidators.byType(undefinedByTypeProperty)]);

    expect(true).toEqual(doubleByTypePropertyValid.valid);
    expect(true).toEqual(nullDoubleByTypePropertyValid.valid);
    expect(true).toEqual(undefinedDoubleByTypePropertyValid.valid);
    expect(false).toEqual(doubleByTypePropertyNotValid.valid);
    expect(true).toEqual(intByTypePropertyValid.valid);
    expect(false).toEqual(intByTypePropertyNotValid.valid);
    expect(true).toEqual(nullByTypePropertyValid.valid);
    expect(true).toEqual(undefinedByTypePropertyValid.valid);
    expect('Значение должно быть числом').toEqual(doubleByTypePropertyNotValid.errors['byType']);
  });
});
