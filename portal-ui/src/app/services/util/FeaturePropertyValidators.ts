import {isEmpty} from 'validate.js';
import {FeatureDescription, SimpleProperty} from '../crg/fgistp-rules.service';
import {ValueTitleProjection} from '../geoserver/projections';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class FeaturePropertyValidators {

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

  static propertyValidator(property: SimpleProperty): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const errors = {};

      // Если нет обьекта по которому должна идти проверка, то и проверять нечего.
      if (!property) {
        return errors;
      }

      const currentValue = control.value;
      if (isEmpty(currentValue)) {
        // Если ввод пуст, посмотрим обязателен ли атрибут
        if (property.required) {
          errors['required'] = 'Поле обязательно к заполнению';
          return errors;
        } else {
          return errors;
        }
      } else {
        // Если что-то введено, проверим его согласно типу атрибута.
        switch (property.valueType) {
          case ValueType.CHOICE:
            if (control.dirty) {
              // Если мы меняли значение селектора, то проверим его стандартным образом
              this.enumeration(currentValue, property, errors);
            } else {
              // Как правило в базе лежит мусор типа '0', поэтому тут значение ввода не пустое(поэтому мы в этом
              // куске кода) и требуется еще раз проверить на required
              if (property.required) {
                // Если поле обязательно - проверим его
                this.enumeration(currentValue, property, errors);
              } else {
                // Если не обязательно, то тут нет ошибки
                return errors;
              }
            }
            break;
          case ValueType.STRING:
            this.minLength(currentValue, property, errors);
            this.maxLength(currentValue, property, errors);
            this.facetLength(currentValue, property, errors);
            this.pattern(currentValue, property, errors);

            break;
          case ValueType.INT:
            this.minInclusive(currentValue, property, errors);
            this.maxInclusive(currentValue, property, errors);
            this.totalDigits(currentValue, property, errors);
            this.fractionDigits(currentValue, property, errors);
            this.pattern(currentValue, property, errors);

            break;
          case ValueType.DOUBLE:
            this.totalDigits(currentValue, property, errors);
            this.fractionDigits(currentValue, property, errors);
            this.pattern(currentValue, property, errors);
            this.isPositive(currentValue, errors);

            break;
          default:
            console.log('Unsupported ValueType: ', property.valueType);
            return errors;
        }

        return errors;
      }
    };
  }

  // Определяет список приемлемых значений
  private static enumeration(value: string, property: SimpleProperty, errors: {}): void {
    if (!property.enumerations || property.valueType !== ValueType.CHOICE) {
      return;
    }

    if (!this.isEnumIncludeValue(property.enumerations, value)) {
      errors['wrongChoice'] = 'Значение: ' + value + ' не соответствует справочному';
    }
  }

  // Определяет точное число символов или объектов списка. Должно быть равно или больше нуля
  private static facetLength(value: string, property: SimpleProperty, errors: {}): void {
    if (!property.length || property.length === -1) {
      return;
    }

    if (value.toString().length !== property.length) {
      errors['facetLength'] = 'Длинна строка должна быть: ' + property.length + ' символов';
    }
  }

  // Определяет минимальное число символов или объектов списка. Должно быть равно или больше нуля
  private static minLength(value: string, property: SimpleProperty, errors: {}): void {
    console.log('minLength 0', value, property);
    if (!property.minLength || property.minLength === -1) {
      return;
    }

    console.log('minLength 1');
    if (value.toString().length < property.minLength) {
      console.log('minLength 2');
      errors['minLength'] = 'Строка слишком короткая минимальныя длинна сроки: ' + property.minLength + ' символов';
    }
  }

  // Определяет максимальное число символов или объектов списка. Должно быть равно или больше нуля
  private static maxLength(value: string, property: SimpleProperty, errors: {}): void {
    if (!property.maxLength || property.maxLength === -1) {
      return;
    }

    if (value.toString().length > property.maxLength) {
      errors['maxLength'] = 'Превышена допустимая длинна сроки. Допустимо: ' + property.maxLength + ' символов';
    }
  }

  // Определяет точную последовательность приемлемых символов
  private static pattern(value: string, property: SimpleProperty, errors: {}): void {
    if (!property.pattern) {
      return;
    }

    if (!value || !value.toString().match(property.pattern)) {
      errors['pattern'] = 'Строка не соответствует паттерну';
    }
  }

  // Определяет точное количество допустимых цифр. Должно быть больше нуля
  private static totalDigits(value: string, property: SimpleProperty, errors: {}): void {
    if (!property.totalDigits || property.totalDigits === -1) {
      return;
    }

    if (value.toString().length > property.totalDigits) {
      errors['totalDigits'] = 'Превышена допустимая длинна числа. Допустимо: ' + property.totalDigits + ' символов';
    }
  }

  // Определяет максимальное число знаков после десятичной запятой. Должно быть равно или больше нуля
  private static fractionDigits(value: string, property: SimpleProperty, errors: {}): void {
    if (!property.fractionDigits || property.fractionDigits === -1) {
      return;
    }

    // TODO: implement this
    if (value.toString().length > property.fractionDigits) {
      errors['totalDigits'] = 'Превышена допустимая длинна числа. Допустимо: ' + property.fractionDigits + ' символов';
    }
  }

  // Определяет нижнюю границу для числовых значений (значение должно быть больше указанного здесь)
  private static minInclusive(value: string, property: SimpleProperty, errors: {}): void {
    if (!property.minInclusive || property.minInclusive === -1) {
      return;
    }

    if (Number(value) < Number(property.minInclusive)) {
      errors['minInclusive'] = 'Значение: ' + value + ' менее допустимого: ' + property.minInclusive;
    }
  }

  // Определяет верхнюю границу для числовых значений (значение должно быть меньше или равно указанному здесь)
  private static maxInclusive(value: string, property: SimpleProperty, errors: {}): void {
    if (!property.maxInclusive || property.maxInclusive === -1) {
      return;
    }

    if (Number(value) > Number(property.maxInclusive)) {
      errors['maxInclusive'] = 'Значение: ' + value + ' более допустимого: ' + property.maxInclusive;
    }
  }

  private static isPositive(value: string, errors: {}): void {
    if (Number(value) < 0) {
      errors['isNegative'] = 'Число должно быть положительным';
    }
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

// Править в соответствии с ru/mycrg/common/enums/ValueType.java
export enum ValueType {
  INT = 'INT',
  STRING = 'STRING',
  DOUBLE = 'DOUBLE',
  CHOICE = 'CHOICE',
  GEOMETRY = 'GEOMETRY'
}
