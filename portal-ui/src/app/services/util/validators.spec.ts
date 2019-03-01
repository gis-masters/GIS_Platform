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
