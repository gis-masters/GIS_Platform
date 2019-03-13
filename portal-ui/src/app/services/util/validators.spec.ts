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

    const fcValid = new FormControl('12345', [FeaturePropertyValidators.minLength(minLengthProperty)]);
    const fcValid2 = new FormControl('123456', [FeaturePropertyValidators.minLength(minLengthProperty)]);
    const fcNotValid = new FormControl('', [FeaturePropertyValidators.minLength(minLengthProperty)]);
    const fcNotValid2 = new FormControl('123', [FeaturePropertyValidators.minLength(minLengthProperty)]);
    const fcValid3 = new FormControl('123', [FeaturePropertyValidators.minLength(nullMinLengthProperty)]);
    const fcValid4 = new FormControl('', [FeaturePropertyValidators.minLength(nullMinLengthProperty)]);
    const fcValid5 = new FormControl(undefined, [FeaturePropertyValidators.minLength(nullMinLengthProperty)]);
    const fcValid6 = new FormControl(null, [FeaturePropertyValidators.minLength(nullMinLengthProperty)]);
    const fcValid7 = new FormControl('123', [FeaturePropertyValidators.minLength(undefinedMinLengthProperty)]);
    const fcValid8 = new FormControl('', [FeaturePropertyValidators.minLength(undefinedMinLengthProperty)]);
    const fcValid9 = new FormControl(undefined, [FeaturePropertyValidators.minLength(undefinedMinLengthProperty)]);
    const fcValid10 = new FormControl(null, [FeaturePropertyValidators.minLength(undefinedMinLengthProperty)]);
    const fcValid11 = new FormControl('123', [FeaturePropertyValidators.minLength(notMinLengthProperty)]);
    const fcValid12 = new FormControl('', [FeaturePropertyValidators.minLength(notMinLengthProperty)]);
    const fcValid13 = new FormControl(undefined, [FeaturePropertyValidators.minLength(notMinLengthProperty)]);
    const fcValid14 = new FormControl(null, [FeaturePropertyValidators.minLength(notMinLengthProperty)]);

    expect(true).toEqual(fcValid.valid);
    expect(true).toEqual(fcValid2.valid);
    expect(false).toEqual(fcNotValid.valid);
    expect(false).toEqual(fcNotValid2.valid);
    expect(true).toEqual(fcValid3.valid);
    expect(true).toEqual(fcValid4.valid);
    expect(true).toEqual(fcValid5.valid);
    expect(true).toEqual(fcValid6.valid);
    expect(true).toEqual(fcValid7.valid);
    expect(true).toEqual(fcValid8.valid);
    expect(true).toEqual(fcValid9.valid);
    expect(true).toEqual(fcValid10.valid);
    expect(true).toEqual(fcValid11.valid);
    expect(true).toEqual(fcValid12.valid);
    expect(true).toEqual(fcValid13.valid);
    expect(true).toEqual(fcValid14.valid);
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

    const fcValid = new FormControl('12345', [FeaturePropertyValidators.maxLength(maxLengthProperty)]);
    const fcValid2 = new FormControl('123', [FeaturePropertyValidators.maxLength(maxLengthProperty)]);
    const fcValid3 = new FormControl('', [FeaturePropertyValidators.maxLength(maxLengthProperty)]);
    const fcNotValid = new FormControl('123456', [FeaturePropertyValidators.maxLength(maxLengthProperty)]);
    const fcValid4 = new FormControl('123', [FeaturePropertyValidators.maxLength(nullMaxLengthProperty)]);
    const fcValid5 = new FormControl('', [FeaturePropertyValidators.maxLength(nullMaxLengthProperty)]);
    const fcValid6 = new FormControl(undefined, [FeaturePropertyValidators.maxLength(nullMaxLengthProperty)]);
    const fcValid7 = new FormControl(null, [FeaturePropertyValidators.maxLength(nullMaxLengthProperty)]);
    const fcValid8 = new FormControl('123', [FeaturePropertyValidators.maxLength(undefinedMaxLengthProperty)]);
    const fcValid9 = new FormControl('', [FeaturePropertyValidators.maxLength(undefinedMaxLengthProperty)]);
    const fcValid10 = new FormControl(undefined, [FeaturePropertyValidators.maxLength(undefinedMaxLengthProperty)]);
    const fcValid11 = new FormControl(null, [FeaturePropertyValidators.maxLength(undefinedMaxLengthProperty)]);
    const fcValid12 = new FormControl('123', [FeaturePropertyValidators.maxLength(notMaxLengthProperty)]);
    const fcValid13 = new FormControl('', [FeaturePropertyValidators.maxLength(notMaxLengthProperty)]);
    const fcValid14 = new FormControl(undefined, [FeaturePropertyValidators.maxLength(notMaxLengthProperty)]);
    const fcValid15 = new FormControl(null, [FeaturePropertyValidators.maxLength(notMaxLengthProperty)]);

    expect(true).toEqual(fcValid.valid);
    expect(true).toEqual(fcValid2.valid);
    expect(true).toEqual(fcValid3.valid);
    expect(false).toEqual(fcNotValid.valid);
    expect(true).toEqual(fcValid4.valid);
    expect(true).toEqual(fcValid5.valid);
    expect(true).toEqual(fcValid6.valid);
    expect(true).toEqual(fcValid7.valid);
    expect(true).toEqual(fcValid8.valid);
    expect(true).toEqual(fcValid9.valid);
    expect(true).toEqual(fcValid10.valid);
    expect(true).toEqual(fcValid11.valid);
    expect(true).toEqual(fcValid12.valid);
    expect(true).toEqual(fcValid13.valid);
    expect(true).toEqual(fcValid14.valid);
    expect(true).toEqual(fcValid15.valid);
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
