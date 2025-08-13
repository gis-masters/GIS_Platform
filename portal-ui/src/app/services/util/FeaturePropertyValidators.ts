import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isEmpty } from 'validate.js';

import { Toast } from '../../components/Toast/Toast';
import { FiasValue } from '../data/fias/fias.models';
import { PropertyOption } from '../data/schema/schema.models';
import { convertOldToNewProperties } from '../data/schema/schema.utils';
import {
  OldPropertySchema,
  OldPropertySchemaChoice,
  OldPropertySchemaDouble,
  OldPropertySchemaInt,
  OldPropertySchemaLong,
  OldPropertySchemaString,
  PropertyEnumeration,
  ValueType
} from '../data/schema/schemaOld.models';
import { services } from '../services';
import { validateFieldValue } from './form/formValidation.utils';

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

/**
 * @deprecated legacy
 */
export class FeaturePropertyValidators {
  static validateCustomRules(
    featureProperties: { [key: string]: unknown },
    customRuleFunction?: string,
    tableName?: string
  ): ValidationError[] {
    let errors: ValidationError[] = [];

    if (!customRuleFunction) {
      return errors;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const evaluateObjectRules = new Function('obj', customRuleFunction);
      errors = evaluateObjectRules(featureProperties) as ValidationError[];
    } catch (error) {
      Toast.error({ message: 'Ошибка при анализе доп. правил', details: `Таблица: ${tableName}\n${String(error)}` });
      services.logger.error('Ошибка при анализе доп. правил', tableName, error);
    }

    return errors;
  }

  static validate(propertySchema: OldPropertySchema): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const errors: ErrorMessages = {};

      // Если нет объекта по которому должна идти проверка, то и проверять нечего.
      if (!propertySchema) {
        return errors;
      }

      const currentValue = control.value as string;

      if (
        propertySchema.valueType === ValueType.FIAS &&
        isEmpty((control.value as FiasValue)?.address) &&
        propertySchema.required
      ) {
        errors.required = 'Поле обязательно к заполнению';

        return errors;
      }

      if (isEmpty(currentValue)) {
        // Если ввод пуст, посмотрим обязателен ли атрибут
        if (propertySchema.required) {
          errors.required = 'Поле обязательно к заполнению';

          return errors;
        }

        return errors;
      }
      // Если что-то введено, проверим его согласно типу атрибута.
      switch (propertySchema.valueType) {
        case ValueType.CHOICE: {
          this.enumeration(currentValue, propertySchema, errors);
          break;
        }
        case ValueType.STRING: {
          this.minLength(currentValue, propertySchema, errors);
          this.maxLength(currentValue, propertySchema, errors);
          this.facetLength(currentValue, propertySchema, errors);
          this.pattern(currentValue, propertySchema, errors);

          break;
        }
        case ValueType.INT: {
          this.minInclusive(currentValue, propertySchema, errors);
          this.maxInclusive(currentValue, propertySchema, errors);
          this.totalDigits(currentValue, propertySchema, errors);

          break;
        }
        case ValueType.LONG: {
          this.minInclusive(currentValue, propertySchema, errors);
          this.maxInclusive(currentValue, propertySchema, errors);

          break;
        }
        case ValueType.DOUBLE: {
          this.totalDigits(currentValue, propertySchema, errors);
          this.fractionDigits(currentValue, propertySchema, errors);
          this.isPositive(currentValue, errors);

          break;
        }
        case ValueType.LOOKUP: {
          break;
        }
        case ValueType.FILE: {
          //иначе сыпятся ошибки в консоли
          break;
        }
        case ValueType.DOCUMENT: {
          //иначе сыпятся ошибки в консоли
          break;
        }
        case ValueType.DATETIME: {
          //иначе сыпятся ошибки в консоли
          break;
        }
        case ValueType.URL: {
          //иначе сыпятся ошибки в консоли
          break;
        }
        default: {
          console.error('validate - не поддерживаемый ValueType:', propertySchema.valueType);

          return errors;
        }
      }

      return errors;
    };
  }

  // Определяет список приемлемых значений
  private static enumeration(value: string, propertySchema: OldPropertySchemaChoice, errors: ErrorMessages): void {
    if (!propertySchema.enumerations || propertySchema.valueType !== ValueType.CHOICE) {
      return;
    }

    const newPropertySchema = convertOldToNewProperties([propertySchema])[0];
    const validateResult = validateFieldValue(value, newPropertySchema, value);

    if (validateResult.messages?.length) {
      errors.wrongChoice = validateResult.messages.join('\n');
    }
  }

  // Определяет точное число символов или объектов списка. Должно быть равно или больше нуля
  private static facetLength(value: string, propertySchema: OldPropertySchema, errors: ErrorMessages): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- хз, что тут происходит и откуда у схемы .length
    // @ts-ignore
    if (!propertySchema.length || propertySchema.length === -1) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- хз, что тут происходит и откуда у схемы .length
    // @ts-ignore
    if (value.toString().length !== propertySchema.length) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- хз, что тут происходит и откуда у схемы .length
      // @ts-ignore
      errors.facetLength = `Длина строка должна быть: ${String(propertySchema.length)} символов`;
    }
  }

  // Определяет минимальное число символов или объектов списка. Должно быть равно или больше нуля
  private static minLength(value: string, propertySchema: OldPropertySchemaString, errors: ErrorMessages): void {
    if (!propertySchema.minLength || propertySchema.minLength === -1) {
      return;
    }

    if (value.toString().length < propertySchema.minLength) {
      errors.minLength = `Строка слишком короткая. Минимальная длина сроки: ${propertySchema.minLength} символов`;
    }
  }

  // Определяет максимальное число символов или объектов списка. Должно быть равно или больше нуля
  private static maxLength(value: string, propertySchema: OldPropertySchemaString, errors: ErrorMessages): void {
    if (!propertySchema.maxLength || propertySchema.maxLength === -1) {
      return;
    }

    if (value.toString().length > propertySchema.maxLength) {
      errors.maxLength = `Превышена допустимая длина сроки. Допустимо: ${propertySchema.maxLength} символов`;
    }
  }

  // Определяет точную последовательность приемлемых символов
  private static pattern(value: string, propertySchema: OldPropertySchemaString, errors: ErrorMessages): void {
    if (!propertySchema.pattern) {
      return;
    }

    if (!value || !new RegExp(propertySchema.pattern).test(String(value))) {
      errors.pattern = 'Строка не соответствует паттерну';
    }
  }

  // Определяет точное количество допустимых цифр. Должно быть больше нуля
  private static totalDigits(
    value: string,
    propertySchema: OldPropertySchemaInt | OldPropertySchemaDouble | OldPropertySchemaLong,
    errors: ErrorMessages
  ): void {
    if (!propertySchema.totalDigits || propertySchema.totalDigits === -1) {
      return;
    }

    if (String(value).length > propertySchema.totalDigits) {
      errors.totalDigits = `Превышена допустимый размер числа. Допустимо: ${propertySchema.totalDigits} цифр`;
    }
  }

  // Определяет максимальное число знаков после десятичной запятой. Должно быть равно или больше нуля
  private static fractionDigits(value: string, propertySchema: OldPropertySchemaDouble, errors: ErrorMessages): void {
    if (!propertySchema.fractionDigits || propertySchema.fractionDigits === -1) {
      return;
    }

    const decimal = value.toString().replace(',', '.').split('.')[1];
    if (decimal && decimal.length > propertySchema.fractionDigits) {
      errors.totalDigits = `Превышена допустимая длина дробной части числа. Допустимо: ${propertySchema.fractionDigits} символов`;
    }
  }

  // Определяет нижнюю границу для числовых значений (значение должно быть больше указанного здесь)
  private static minInclusive(
    value: string,
    propertySchema: OldPropertySchemaInt | OldPropertySchemaDouble | OldPropertySchemaLong,
    errors: ErrorMessages
  ): void {
    if (!propertySchema.minInclusive || propertySchema.minInclusive === -1) {
      return;
    }

    if (Number(value) < Number(propertySchema.minInclusive)) {
      errors.minInclusive = `Значение: ${value} менее допустимого: ${propertySchema.minInclusive}`;
    }
  }

  // Определяет верхнюю границу для числовых значений (значение должно быть меньше или равно указанному здесь)
  private static maxInclusive(
    value: string,
    propertySchema: OldPropertySchemaInt | OldPropertySchemaDouble | OldPropertySchemaLong,
    errors: ErrorMessages
  ): void {
    if (!propertySchema.maxInclusive || propertySchema.maxInclusive === -1) {
      return;
    }

    if (Number(value) > Number(propertySchema.maxInclusive)) {
      errors.maxInclusive = `Значение: ${value} более допустимого: ${propertySchema.maxInclusive}`;
    }
  }

  private static isPositive(value: string, errors: ErrorMessages): void {
    if (Number(value) < 0) {
      errors.isNegative = 'Число должно быть положительным';
    }
  }

  private static isEnumIncludeValue(enumerations: PropertyEnumeration[], currentValue: unknown): boolean {
    if (!currentValue) {
      return false;
    }

    const result = enumerations.find(item => {
      return String(item.value) === String(currentValue);
    });

    return result !== undefined;
  }

  private static isEnumIncludeMultipleValues(enumeration: PropertyOption[], currentValues: string[]): boolean {
    return currentValues.every(el => {
      return enumeration.some(option => option.value === el);
    });
  }
}
