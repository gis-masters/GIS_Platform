import {SimpleProperty} from '../gis/fgistp-rules.service';
import {ValueTitleProjection} from '../geoserver/projections';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class FeaturePropertyValidators {

  static required(property: SimpleProperty): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const errors = {};

      if (!property || !property.required) {
        return errors;
      }

      const currentValue = control.value;

      console.log('required: ', currentValue);
      if (!currentValue) {
        errors['required'] = 'some value here';
      }

      return errors;
    };
  }

  static enumeration(property: SimpleProperty): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const errors = {};

      if (!property || !property.enumerations) {
        return errors;
      }

      const currentValue = control.value;

      // console.log('enumeration: ', currentValue);
      if (property.valueType.includes('CHOICE')) {
        if (!this.isEnumIncludeValue(property.enumerations, currentValue)) {
          errors['wrongChoice'] = 'some value here';
        }
      }

      return errors;
    };
  }

  static minLength(property: SimpleProperty): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const errors = {};

      if (!property || !property.minLength || property.minLength === -1) {
        return errors;
      }

      const currentValue = control.value;

      console.log('minLength: ', currentValue);
      if (currentValue.toString().length < property.minLength) {
        errors['minLength'] = 'some value here';
      }

      return errors;
    };
  }

  private static isEnumIncludeValue(enumerations: ValueTitleProjection[], currentValue: any): boolean {
    if (!currentValue) {
      return false;
    }

    const result = enumerations.find((item: ValueTitleProjection) => {
      return item.value.toString() === currentValue.toString();
    });

    return result !== undefined;
  }
}
