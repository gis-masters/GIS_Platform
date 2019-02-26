import {SimpleProperty} from '../gis/fgistp-rules.service';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {ValueTitleProjection} from '../geoserver/projections';

export class CustomValidator {

  static validate(simpleProperty: SimpleProperty): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const errors = {};

      if (!simpleProperty) {
        return errors;
      }

      const currentValue = control.value;

      // console.log('--- ', currentValue);

      if (!currentValue && simpleProperty.required) {
        errors['required'] = 'some value here';
      }

      if (simpleProperty.valueType.includes('CHOICE')) {
        if (!this.isCorrectValue(simpleProperty.enumerations, currentValue)) {
          errors['wrongChoice'] = 'some value here';
        }
      }

      return errors;
    };
  }

  private static isCorrectValue(enumerations: ValueTitleProjection[], currentValue: any): boolean {
    if (!currentValue) {
      return false;
    }

    const result = enumerations.find((item: ValueTitleProjection) => {
      return item.value.toString() === currentValue.toString();
    });

    return result !== undefined;
  }
}
