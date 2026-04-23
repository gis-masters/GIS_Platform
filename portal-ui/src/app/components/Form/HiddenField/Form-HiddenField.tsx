import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

const cnFormHiddenField = cn('Form', 'HiddenField');

function toHiddenFieldValue(value: unknown): string {
  if (value === undefined || value === null) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return '';
}

interface FormHiddenFieldProps {
  name: string;
  value: unknown;
}

export const FormHiddenField: FC<FormHiddenFieldProps> = ({ name, value }) => (
  <input type='hidden' name={name} className={cnFormHiddenField()} value={toHiddenFieldValue(value)} />
);
