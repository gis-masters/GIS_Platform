import { cloneDeep } from 'lodash';
import moment from 'moment';

import { getEditUrlFormSchema, parseUrlValue } from '../../components/Form/Form.utils';
import { FileInfo } from '../files.service';
import { knownRegex } from '../regexp.service';
import {
  PropertyType,
  PropertySchema,
  PropertySchemaChoice,
  PropertySchemaDatetime,
  PropertySchemaFloat,
  PropertySchemaInt,
  PropertySchemaString,
  PropertySchemaUrl,
  ValueFormula
} from './schema.models';
import { valueWellKnownFormulas } from './schema.utils';

const messages = {
  required: 'Обязательное поле ',
  serRequired: 'Обязательные поля ',
  regexp: 'Некорректное значение ',
  notInOptions: 'Недопустимое значение '
};

export interface FieldErrors {
  field: string;
  messages: string[];
}

export interface ServerFieldError {
  field: string;
  message?: string;
  messages?: string[];
  defaultMessage?: string;
}

export type FieldValidator = (
  value: unknown,
  property: PropertySchema,
  formValue: unknown,
  allProperties: PropertySchema[]
) => string[] | undefined;

const fieldValidators: Partial<Record<PropertyType, FieldValidator[]>> = {
  [PropertyType.STRING]: [simpleRequired, stringLength, stringRegex, stringWellKnownRegex, stringPassword],
  [PropertyType.INT]: [numberRequired, numberMinMax, numberInteger],
  [PropertyType.FLOAT]: [numberRequired, numberMinMax],
  [PropertyType.BOOL]: [simpleRequired],
  [PropertyType.BINARY]: [simpleRequired],
  [PropertyType.DATETIME]: [simpleRequired, datetimeValid, datetimeMinMax],
  [PropertyType.CHOICE]: [choiceRequired, choiceValueInOptions],
  [PropertyType.URL]: [urlRequired, urlRegex],
  [PropertyType.FILE]: [filesRequired, filesLoaded],
  [PropertyType.DOCUMENT]: [jsonArrayRequired],
  [PropertyType.SET]: [],
  [PropertyType.CUSTOM]: []
};

export function validateFieldValue(
  value: unknown,
  property: PropertySchema,
  formValue: unknown,
  allProperties: PropertySchema[]
): FieldErrors {
  const validatorsList = [...(fieldValidators[property.propertyType] || [])];
  if (property.customValidationFunction) {
    validatorsList.push(property.customValidationFunction);
  }

  return {
    field: property.name,
    messages: validatorsList
      ?.flatMap(validator => validator(value, property, formValue, allProperties))
      .filter(err => err)
  };
}

export function validateFormValue(formValue: unknown, fields: PropertySchema[]): FieldErrors[] {
  return fields
    .map(field => validateFieldValue(formValue[field.name], field, formValue, fields))
    .filter(({ messages }) => messages?.length);
}

// common

function simpleRequired(value: unknown, { required }: PropertySchema): string[] | undefined {
  if (required && !value) {
    return [messages.required];
  }
}

function jsonArrayRequired(value: string, { required }: PropertySchema): string[] | undefined {
  if (required) {
    try {
      const parsed = JSON.parse(value) as unknown[];
      if (!Array.isArray(parsed) || !parsed.length) {
        return [messages.required];
      }
    } catch {
      return [messages.required];
    }
  }
}

// choice

function choiceRequired(value: unknown, { required }: PropertySchema): string[] | undefined {
  if (required && !(typeof value === 'number' || typeof value === 'string')) {
    return [messages.required];
  }
}

function choiceValueInOptions(value: unknown, { options }: PropertySchemaChoice): string[] | undefined {
  if (value && !options.some(option => String(option.value) === String(value))) {
    return [messages.required];
  }
}

// datetime

function datetimeValid(value: unknown): string[] | undefined {
  if (value && !moment(value).isValid()) {
    return ['Некорректная дата'];
  }
}

function datetimeMinMax(value: unknown, { maxValue, minValue }: PropertySchemaDatetime): string[] | undefined {
  if (maxValue && moment(value).isAfter(maxValue)) {
    return [`Максимальная дата ${maxValue} `];
  }
  if (minValue && moment(value).isBefore(minValue)) {
    return [`Минимальная дата ${minValue} `];
  }
}

// string

function stringLength(value: unknown, { maxLength, minLength }: PropertySchemaString): string[] {
  const errors: string[] = [];
  if (maxLength && String(value).length > maxLength && maxLength > 0) {
    errors.push(`Максимальное количество символов ${maxLength} `);
  }
  if (minLength && String(value).length < minLength && String(value).length !== 0 && minLength > 0) {
    errors.push(`Минимальное количество символов ${minLength} `);
  }

  return errors;
}

function stringRegex(value: unknown, { regex, regexErrorMessage }: PropertySchemaString): string[] {
  if (regex && !new RegExp(regex).test(String(value))) {
    return [regexErrorMessage || messages.regexp];
  }
}

function stringWellKnownRegex(value: unknown, { wellKnownRegex, regexErrorMessage }: PropertySchemaString): string[] {
  if (knownRegex[wellKnownRegex]) {
    knownRegex[wellKnownRegex].lastIndex = 0;
  }

  if (wellKnownRegex && !knownRegex[wellKnownRegex]?.test(String(value))) {
    return [regexErrorMessage || messages.regexp];
  }
}

function stringPassword(value: unknown, { display }: PropertySchemaString): string[] {
  if (display === 'password' && !new RegExp(knownRegex.password).test(String(value))) {
    return ['Пароль должен состоять только из цифр, заглавных и строчных букв латинского алфавита '];
  }
}

// url

function urlRequired(value: string, { required, multiple }: PropertySchemaUrl): string[] | undefined {
  const info = parseUrlValue(value, multiple);

  if (required && !info[0]?.url) {
    return [messages.required];
  }
}

function urlRegex(value: string, property: PropertySchemaUrl): string[] {
  const urlValue = parseUrlValue(value, property.multiple);

  const fields = getEditUrlFormSchema(property);

  const errors = urlValue.flatMap(item => {
    const fieldsErrors = validateFormValue(item, fields as PropertySchemaString<Record<string, unknown>>[]);

    return fieldsErrors.flatMap(({ messages }) => messages);
  });

  if (!property.multiple && !property.required) {
    return [];
  }

  return errors.length ? [errors[0]] : [];
}

// number

function numberRequired(value: unknown, { required }: PropertySchema): string[] | undefined {
  if (
    required &&
    !(typeof value === 'number' || (typeof value === 'string' && value && !Number.isNaN(Number(value))))
  ) {
    return [messages.required];
  }
}

function numberInteger(value: number): string[] | undefined {
  if (!Number.isNaN(value) && String(value).includes('.')) {
    return ['Только целые числа'];
  }
}

function numberMinMax(
  value: number,
  { maxValue, minValue }: PropertySchemaInt | PropertySchemaFloat
): string[] | undefined {
  if (!(typeof value === 'number' || (typeof value === 'string' && value && !Number.isNaN(Number(value))))) {
    return;
  }

  const errors: string[] = [];

  if (typeof maxValue === 'number' && Number(value) > maxValue) {
    errors.push(`Максимальное значение ${maxValue} `);
  }

  if (typeof minValue === 'number' && Number(value) < minValue) {
    errors.push(`Минимальное значение ${minValue} `);
  }

  return errors;
}

// file

function filesRequired(value: unknown, { required }: PropertySchema): string[] | undefined {
  try {
    if (value && typeof value === 'string') {
      value = JSON.parse(value) as FileInfo[];
    }
  } catch {
    value = [];
  }

  if (required && (!Array.isArray(value) || !value.length)) {
    return [messages.required];
  }
}

function filesLoaded(value: FileInfo[] = []): string[] | undefined {
  try {
    if (value && typeof value === 'string') {
      value = JSON.parse(value) as FileInfo[];
    }
  } catch {
    value = [];
  }

  if (value?.some(({ notLoaded }) => notLoaded)) {
    return ['Загрузка файлов ещё не завершена'];
  }
}

export function normalizeServerErrors(errors: ServerFieldError[]): FieldErrors[] {
  return errors.map(({ field, message, defaultMessage, messages }) => ({
    field,
    messages: messages || [message || defaultMessage]
  }));
}

export function getDefaultValues<T extends Record<string, unknown>>(
  properties: PropertySchema<T>[],
  parent: Record<string, unknown> = {}
): Partial<T> {
  const values: Partial<T> = {};

  for (const property of properties) {
    if (property.defaultValue) {
      values[property.name] = property.defaultValue as T[keyof T];
    }

    if (property.defaultValueFormula) {
      try {
        const formula: ValueFormula =
          typeof property.defaultValueFormula === 'string'
            ? // eslint-disable-next-line @typescript-eslint/no-implied-eval
              (new Function('obj', 'property', 'parent', property.defaultValueFormula) as ValueFormula)
            : property.defaultValueFormula;

        values[property.name] = formula(values, property as PropertySchema, parent) as T[keyof T];
      } catch (error) {
        throw new Error(`Ошибка при попытке вычислить значение по-умолчанию: ${String(error)}`);
      }
    }

    if (property.defaultValueWellKnownFormula && valueWellKnownFormulas[property.defaultValueWellKnownFormula]) {
      try {
        const formula = valueWellKnownFormulas[property.defaultValueWellKnownFormula];

        values[property.name] = formula(values, property as PropertySchema, parent) as T[keyof T];
      } catch (error) {
        throw new Error(
          `Ошибка при попытке вычислить значение по-умолчанию [${property.defaultValueWellKnownFormula}]: ${String(
            error
          )}`
        );
      }
    }
  }

  return values;
}

export function calculateValues<T extends Record<string, unknown>>(obj: T, properties: PropertySchema<T>[]): T {
  const value = cloneDeep(obj);

  for (const property of properties) {
    value[property.name] = getCalculatedValue(value, property as PropertySchema) as T[keyof T];
  }

  return value;
}

export function getCalculatedValue<T extends Record<string, unknown>>(
  obj: Record<string, unknown>,
  property: PropertySchema
): unknown {
  if (property.calculatedValueFormula) {
    try {
      const formula =
        typeof property.calculatedValueFormula === 'string'
          ? // eslint-disable-next-line @typescript-eslint/no-implied-eval
            (new Function('obj', 'property', property.calculatedValueFormula) as ValueFormula)
          : property.calculatedValueFormula;

      return formula(obj, property) as T[keyof T];
    } catch (error) {
      throw new Error(`Ошибка при попытке вычислить значение: ${String(error)}`);
    }
  }

  if (property.calculatedValueWellKnownFormula && valueWellKnownFormulas[property.calculatedValueWellKnownFormula]) {
    try {
      const formula = valueWellKnownFormulas[property.calculatedValueWellKnownFormula];

      return formula(obj, property) as T[keyof T];
    } catch (error) {
      throw new Error(
        `Ошибка при попытке вычислить значение по-умолчанию [${property.defaultValueWellKnownFormula}]: ${String(
          error
        )}`
      );
    }
  }

  return obj[property.name];
}
