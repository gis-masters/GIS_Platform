import {SimpleProperty, FeatureDescription} from '../crg/fgistp-rules.service';
import {ValueTitleProjection} from '../geoserver/projections';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class FeaturePropertyValidators {

  static required(property: SimpleProperty): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const errors = {};

      if (!property || !property.required) {
        return errors;
      }

      const currentValue = control.value.toString();

      // console.log('required: ', currentValue);
      if (!currentValue) {
        errors['required'] = 'Поле обязательно к заполнению';
      }

      return errors;
    };
  }

  static enumeration(property: SimpleProperty): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const errors = {};

      if (!property || !property.required || !property.enumerations) {
        return errors;
      }

      const currentValue = control.value;
      if (property.valueType.includes('CHOICE')) {
        if (!this.isEnumIncludeValue(property.enumerations, currentValue)) {
          errors['wrongChoice'] = 'Значение: ' + currentValue + ' не соответствует справочному';
        }
      }

      return errors;
    };
  }

  static minLength(property: SimpleProperty): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const errors = {};

      if (!property || !property.required || !property.minLength || property.minLength === -1) {
        return errors;
      }

      const currentValue = control.value;
      if (currentValue.toString().length < property.minLength) {
        errors['minLength'] = 'Строка слишком короткая минимальныя длинна сроки: ' + property.minLength + ' символов';
      }

      return errors;
    };
  }

  static maxLength(property: SimpleProperty): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const errors = {};

      if (!property || !property.required || !property.maxLength || property.maxLength === -1) {
        return errors;
      }

      const currentValue = control.value;
      if (currentValue.toString().length > property.maxLength) {
        errors['maxLength'] = 'Превышена допустимая длинна сроки. Допустимо: ' + property.maxLength + ' символов';
      }

      return errors;
    };
  }

  static totalDigits(property: SimpleProperty) {
    return (control: AbstractControl): ValidationErrors | null => {
      const errors = {};

      const currentValue = control.value;
      if (currentValue) {
        if (!property || !property.totalDigits || property.totalDigits === -1) {
          return errors;
        }

        if (currentValue.toString().length > property.totalDigits) {
          errors['totalDigits'] = 'Превышена допустимая длинна числа. Допустимо: ' + property.totalDigits + ' символов';
        }
      } else {
        if (!property || !property.required) {
          return errors;
        }
      }

      return errors;
    };
  }

  static pattern(property: SimpleProperty) {
    return (control: AbstractControl): ValidationErrors | null => {
      const errors = {};

      if (!property || !property.required || !property.pattern) {
        return errors;
      }

      const currentValue = control.value;
      if (!currentValue.match(property.pattern)) {
        errors['pattern'] = 'Строка не соответствует паттерну';
      }

      return errors;
    };
  }

  static minInclusive(property: SimpleProperty) {
    return (control: AbstractControl): ValidationErrors | null => {
      const errors = {};

      if (!property || !property.required || !property.minInclusive || property.minInclusive === -1) {
        return errors;
      }

      const currentValue = control.value;
      if (Number(currentValue) < Number(property.minInclusive)) {
        errors['minInclusive'] = 'Значение: ' + currentValue + ' менее допустимого: ' + property.minInclusive;
      }

      return errors;
    };
  }

  static maxInclusive(property: SimpleProperty) {
    return (control: AbstractControl): ValidationErrors | null => {
      const errors = {};

      if (!property || !property.required || !property.maxInclusive || property.maxInclusive === -1) {
        return errors;
      }

      const currentValue = control.value;
      if (!this.isValidInteger(currentValue)) {
        errors['incorrectNumber'] = 'Введите корректное число';
      } else {
        if (Number(currentValue) > Number(property.maxInclusive)) {
          errors['maxInclusive'] = 'Значение: ' + currentValue + ' более допустимого: ' + property.maxInclusive;
        }
      }

      return errors;
    };
  }

  static isDoubleType(property: SimpleProperty) {
    return (control: AbstractControl): ValidationErrors | null => {
      const errors = {};

      if (!property || !property.valueType) {
        return errors;
      }

      const currentValue = control.value;
      if (property.valueType.includes('DOUBLE')) {
        if (isNaN(currentValue)) {
          errors['isDoubleType'] = 'Значение должно быть дробным числом';
        }
      }

      return errors;
    };
  }

  static isIntType(property: SimpleProperty) {
    return (control: AbstractControl): ValidationErrors | null => {
      const errors = {};

      if (!property || !property.valueType) {
        return errors;
      }

      const currentValue = control.value;
      if (property.valueType.includes('INT')) {
        if (currentValue.toString() !== parseInt(currentValue, 10).toString()) {
          errors['isIntType'] = 'Значение должно быть целым числом';
        }
      }

      return errors;
    };
  }

  static customRules(featureProperties: any, xsdFeature: FeatureDescription): string[] {
    let errors = [];

    if (!xsdFeature || !xsdFeature.customRuleFunction) {
      return errors;
    }

    try {
      const evaluateObjectRules = new Function('obj', xsdFeature.customRuleFunction);

      errors = evaluateObjectRules(featureProperties);
    } catch (e) {
      throw Error('Ошибка при анализе доп. правил. ' + e);
    }

    return errors;
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

  private static isValidInteger(currentValue: any): boolean {
    const number = Number(currentValue);

    if (!number) {
      return false;
    }

    return Number.isInteger(number);
  }
}
