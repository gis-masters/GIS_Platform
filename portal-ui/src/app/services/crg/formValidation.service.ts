import moment from 'moment';
import { knownRegex } from '../regexp.service';
import {
  PropertyType,
  PropertySchema,
  PropertySchemaChoice,
  PropertySchemaDatetime,
  PropertySchemaFloat,
  PropertySchemaInt,
  PropertySchemaString
} from './schema.models';

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
  defaultMessage?: string;
}

type FieldValidator = (
  value: unknown,
  property: PropertySchema,
  formValue: unknown,
  allProperties: PropertySchema[]
) => string[] | undefined;

const fieldValidators: Partial<Record<PropertyType, FieldValidator[]>> = {
  [PropertyType.STRING]: [simpleRequired, stringLength, stringRegex, stringWellKnownRegex],
  [PropertyType.INT]: [numberRequired, numberMinMax, numberInteger],
  [PropertyType.FLOAT]: [numberRequired, numberMinMax],
  [PropertyType.BOOL]: [simpleRequired],
  [PropertyType.BINARY]: [simpleRequired],
  [PropertyType.DATETIME]: [simpleRequired, datetimeValid, datetimeMinMax],
  [PropertyType.CHOICE]: [choiceRequired, choiceValueInOptions],
  [PropertyType.SET]: [],
  [PropertyType.CUSTOM]: []
};

export function validateFieldValue(
  value: unknown,
  property: PropertySchema,
  formValue: unknown,
  allProperties: PropertySchema[]
): FieldErrors {
  return {
    field: property.name,
    messages: fieldValidators[property.propertyType]
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
  if (!moment(value).isValid() && value !== null) {
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
  if (maxLength && String(value).length > maxLength) {
    errors.push(`Максимальное количество символов ${maxLength} `);
  }
  if (minLength && String(value).length < minLength && String(value).length !== 0) {
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
  if (wellKnownRegex && !knownRegex[wellKnownRegex]?.test(String(value))) {
    return [regexErrorMessage || messages.regexp];
  }
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

export function normalizeServerErrors(errors: ServerFieldError[]): FieldErrors[] {
  return errors.map(({ field, message, defaultMessage }) => ({
    field,
    messages: [message || defaultMessage]
  }));
}

export function getDefaultValues<T extends Record<string, unknown>>(fields: PropertySchema<T>[]): Partial<T> {
  const values: Partial<T> = {};

  for (const field of fields) {
    if (field.defaultValue) {
      values[field.name] = field.defaultValue as T[keyof T];
    }
  }

  return values;
}
