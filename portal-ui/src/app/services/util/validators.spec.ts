import {SimpleProperty} from '../gis/fgistp-rules.service';
import {FeaturePropertyValidators} from './FeaturePropertyValidators';
import {FormControl} from '@angular/forms';

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
    expect('Строка слишком короткая минимальныя длинна сроки: ' + minLengthProperty.minLength + ' символов').toEqual(minLengthNotValid.errors['minLength']);
    expect(false).toEqual(minLengthNotValid2.valid);
    expect('Строка слишком короткая минимальныя длинна сроки: ' + minLengthProperty.minLength + ' символов').toEqual(minLengthNotValid2.errors['minLength']);
    expect(true).toEqual(nullMinLengthValid.valid);
    expect(true).toEqual(nullMinLengthValid2.valid);
    expect(true).toEqual(undefinedMinLengthValid.valid);
    expect(true).toEqual(undefinedMinLengthValid2.valid);
    expect(true).toEqual(notMinLengthValid.valid);
    expect(true).toEqual(notMinLengthValid2.valid);
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
    expect('Превышена допустимая длинна сроки. Допустимо: ' + maxLengthProperty.maxLength + ' символов').toEqual(maxLengthNotValid.errors['maxLength']);
    expect(true).toEqual(nullMaxLengthValid.valid);
    expect(true).toEqual(nullMaxLengthValid2.valid);
    expect(true).toEqual(undefinedMaxLengthValid.valid);
    expect(true).toEqual(undefinedMaxLengthValid2.valid);
    expect(true).toEqual(notMaxLengthValid.valid);
    expect(true).toEqual(notMaxLengthValid2.valid);
  });

  // it('should validate enumeration', () => {
  //   const enumerations: ValueTitleProjection[] = [
  //     {
  //       value: '1',
  //       title: 'first'
  //     },
  //     {
  //       value: '2',
  //       title: 'second'
  //     },
  //   ];
  //
  //   const simpleProperty: SimpleProperty = {
  //     name: 'Name1',
  //     title: 'Title1',
  //     valueType: 'CHOICE',
  //     required: false,
  //     description: 'description',
  //     enumerations: enumerations,
  //     allowedValues: [],
  //     hidden: false,
  //     isMultiple: false,
  //     updateability: '',
  //     choice: '',
  //     minLength: 1,
  //     maxLength: 10,
  //     pattern: '',
  //     patternDescription: '',
  //     minInclusive: -1,
  //     maxInclusive: -1,
  //     totalDigits: -1,
  //   };
  // });

});
