import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isEmpty } from 'validate.js';

import { PropertySchema, PropertyEnumerations } from '../crg/schema.service';

// Править в соответствии с ru/mycrg/common/enums/ValueType.java
export enum ValueType {
  INT = 'INT',
  STRING = 'STRING',
  DOUBLE = 'DOUBLE',
  CHOICE = 'CHOICE',
  GEOMETRY = 'GEOMETRY',
  URL = 'URL',
  DATETIME = 'DATETIME'
}

export interface ValidationError {
  attribute: string;
  error: string;
}

export interface ErrorMessages {
  required?: string;
  mustBeEmpty?: string;
  wrongChoice?: string;
  facetLength?: string;
  minLength?: string;
  maxLength?: string;
  pattern?: string;
  totalDigits?: string;
  isNegative?: string;
  maxInclusive?: string;
  minInclusive?: string;
}

export class FeaturePropertyValidators {
  static validateCustomRules(featureObject: {}, customRuleFunction: string): ValidationError[] {
    let errors: ValidationError[] = [];

    if (!customRuleFunction) {
      return errors;
    }

    try {
      const evaluateObjectRules = new Function('obj', customRuleFunction);

      errors = evaluateObjectRules(featureObject);
    } catch (e) {
      throw Error('Ошибка при анализе доп. правил. ' + e);
    }

    return errors;
  }

  static validate(propertySchema: PropertySchema): ValidatorFn {
    const result = (control: AbstractControl): ValidationErrors | null => {
      const errors: ErrorMessages = {};

      // Если нет объекта по которому должна идти проверка, то и проверять нечего.
      if (!propertySchema) {
        return errors;
      }

      const currentValue = control.value;
      if (isEmpty(currentValue)) {
        // Если ввод пуст, посмотрим обязателен ли атрибут
        if (propertySchema.required) {
          errors.required = 'Поле обязательно к заполнению';
          return errors;
        } else {
          return errors;
        }
      } else {
        // Если что-то введено, проверим его согласно типу атрибута.
        switch (propertySchema.valueType) {
          case ValueType.CHOICE:
            this.enumeration(currentValue, propertySchema, errors);
            break;
          case ValueType.STRING:
            this.minLength(currentValue, propertySchema, errors);
            this.maxLength(currentValue, propertySchema, errors);
            this.facetLength(currentValue, propertySchema, errors);
            this.pattern(currentValue, propertySchema, errors);

            break;
          case ValueType.INT:
            this.minInclusive(currentValue, propertySchema, errors);
            this.maxInclusive(currentValue, propertySchema, errors);
            this.totalDigits(currentValue, propertySchema, errors);
            this.fractionDigits(currentValue, propertySchema, errors);
            this.pattern(currentValue, propertySchema, errors);

            break;
          case ValueType.DOUBLE:
            this.totalDigits(currentValue, propertySchema, errors);
            this.fractionDigits(currentValue, propertySchema, errors);
            this.pattern(currentValue, propertySchema, errors);
            this.isPositive(currentValue, errors);

            break;
          default:
            console.log('Unsupported ValueType: ', propertySchema.valueType);
            return errors;
        }

        return errors;
      }
    };

    return result;
  }

  // Определяет список приемлемых значений
  private static enumeration(value: string, propertySchema: PropertySchema, errors: ErrorMessages): void {
    if (!propertySchema.enumerations || propertySchema.valueType !== ValueType.CHOICE) {
      return;
    }

    if (!this.isEnumIncludeValue(propertySchema.enumerations, value)) {
      errors.wrongChoice = 'Значение: ' + value + ' не соответствует справочному';
    }
  }

  // Определяет точное число символов или объектов списка. Должно быть равно или больше нуля
  private static facetLength(value: string, propertySchema: PropertySchema, errors: ErrorMessages): void {
    if (!propertySchema.length || propertySchema.length === -1) {
      return;
    }

    if (value.toString().length !== propertySchema.length) {
      errors.facetLength = 'Длинна строка должна быть: ' + propertySchema.length + ' символов';
    }
  }

  // Определяет минимальное число символов или объектов списка. Должно быть равно или больше нуля
  private static minLength(value: string, propertySchema: PropertySchema, errors: ErrorMessages): void {
    if (!propertySchema.minLength || propertySchema.minLength === -1) {
      return;
    }

    if (value.toString().length < propertySchema.minLength) {
      errors.minLength = 'Строка слишком короткая минимальныя длинна сроки: ' + propertySchema.minLength + ' символов';
    }
  }

  // Определяет максимальное число символов или объектов списка. Должно быть равно или больше нуля
  private static maxLength(value: string, propertySchema: PropertySchema, errors: ErrorMessages): void {
    if (!propertySchema.maxLength || propertySchema.maxLength === -1) {
      return;
    }

    if (value.toString().length > propertySchema.maxLength) {
      errors.maxLength = 'Превышена допустимая длинна сроки. Допустимо: ' + propertySchema.maxLength + ' символов';
    }
  }

  // Определяет точную последовательность приемлемых символов
  private static pattern(value: string, propertySchema: PropertySchema, errors: ErrorMessages): void {
    if (!propertySchema.pattern) {
      return;
    }

    if (!value || !value.toString().match(propertySchema.pattern)) {
      errors.pattern = 'Строка не соответствует паттерну';
    }
  }

  // Определяет точное количество допустимых цифр. Должно быть больше нуля
  private static totalDigits(value: string, propertySchema: PropertySchema, errors: ErrorMessages): void {
    if (!propertySchema.totalDigits || propertySchema.totalDigits === -1) {
      return;
    }

    if (value.toString().length > propertySchema.totalDigits) {
      errors.totalDigits = 'Превышена допустимая длинна числа. Допустимо: ' + propertySchema.totalDigits + ' символов';
    }
  }

  // Определяет максимальное число знаков после десятичной запятой. Должно быть равно или больше нуля
  private static fractionDigits(value: string, propertySchema: PropertySchema, errors: ErrorMessages): void {
    if (!propertySchema.fractionDigits || propertySchema.fractionDigits === -1) {
      return;
    }

    const decimal = value.toString().replace(',', '.').split('.')[1];
    if (decimal && decimal.length > propertySchema.fractionDigits) {
      errors['totalDigits'] = 'Превышена допустимая длинна дробной части числа. Допустимо: ' + propertySchema.fractionDigits + ' символов';
    }
  }

  // Определяет нижнюю границу для числовых значений (значение должно быть больше указанного здесь)
  private static minInclusive(value: string, propertySchema: PropertySchema, errors: ErrorMessages): void {
    if (!propertySchema.minInclusive || propertySchema.minInclusive === -1) {
      return;
    }

    if (Number(value) < Number(propertySchema.minInclusive)) {
      errors.minInclusive = 'Значение: ' + value + ' менее допустимого: ' + propertySchema.minInclusive;
    }
  }

  // Определяет верхнюю границу для числовых значений (значение должно быть меньше или равно указанному здесь)
  private static maxInclusive(value: string, propertySchema: PropertySchema, errors: ErrorMessages): void {
    if (!propertySchema.maxInclusive || propertySchema.maxInclusive === -1) {
      return;
    }

    if (Number(value) > Number(propertySchema.maxInclusive)) {
      errors.maxInclusive = 'Значение: ' + value + ' более допустимого: ' + propertySchema.maxInclusive;
    }
  }

  private static isPositive(value: string, errors: ErrorMessages): void {
    if (Number(value) < 0) {
      errors.isNegative = 'Число должно быть положительным';
    }
  }

  private static isEnumIncludeValue(enumerations: PropertyEnumerations, currentValue: any): boolean {
    if (!currentValue) {
      return false;
    }

    const result = enumerations.find(item => {
      return item.value.toString() === currentValue.toString();
    });

    return result !== undefined;
  }
}
