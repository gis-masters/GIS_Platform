import React, { ComponentType, FC } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { FieldType, PropertySchema } from '../../../services/crg/schema.models';

import '!style-loader!css-loader!sass-loader!./Form-Control.scss';

export const cnFormControl = cn('Form', 'Control');

export interface FormControlProps<T extends Record<string, unknown> = Record<string, unknown>> extends IClassNameProps {
  htmlId?: string;
  type?: FieldType;
  property?: PropertySchema<T>;
  fieldValue?: T[keyof T];
  onChange?: ({ value: T, propertyName: string }) => void;
  onNeedValidate?: ({ value: T, propertyName: string }) => void;
  FormControl?: ComponentType<FormControlProps>;
  inSet?: boolean;
  errors?: string[];
}

export const FormControl: FC<FormControlProps> = ({ children, className }) => (
  <div className={cnFormControl(null, [className])}>{children}</div>
);
