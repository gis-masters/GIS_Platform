import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

const cnFormHiddenField = cn('Form', 'HiddenField');

interface FormHiddenFieldProps {
  name: string;
  value: unknown;
}

export const FormHiddenField: FC<FormHiddenFieldProps> = ({ name, value }) => (
  <input
    type='hidden'
    name={name}
    className={cnFormHiddenField()}
    value={typeof value === 'object' ? JSON.stringify(value) : String(value)}
  />
);
