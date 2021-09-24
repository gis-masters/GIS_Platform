import { knownRegex } from '../regexp.service';
import {
  FieldType,
  PropertySchema,
  PropertySchemaChoice,
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
  formValue: Record<string, unknown>
) => string[] | undefined;

const fieldValidators: Partial<Record<FieldType, FieldValidator[]>> = {
  string: [simpleRequired, stringLength, stringRegex, stringWellKnownRegex],
  integer: [numberRequired, numberMinMax],
  float: [numberRequired, numberMinMax],
  bool: [simpleRequired],
  binary: [simpleRequired],
  choice: [choiceRequired, choiceValueInOptions]
};

function validateField(value: unknown, property: PropertySchema, formValue: Record<string, unknown>): string[] {
  return fieldValidators[property.fieldType]
    ?.flatMap(validator => validator(value, property, formValue))
    .filter(err => err);
}

export function validateFormValue(formValue: Record<string, unknown>, fields: PropertySchema[]): FieldErrors[] {
  return fields.map(field => ({
    field: field.name,
    messages: validateField(formValue[field.name], field, formValue)
  }));
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
  if (value && !options.some(option => option.value === value)) {
    return [messages.required];
  }
}

// string

function stringLength(value: unknown, { maxLength, minLength }: PropertySchemaString): string[] {
  const errors: string[] = [];
  if (maxLength && String(value).length > maxLength) {
    errors.push(`Максимальное количество символов ${maxLength} `);
  }
  if (minLength && String(value).length < minLength) {
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
