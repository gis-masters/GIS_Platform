import React, { FC, ReactNode } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { PropertyType, PropertySchema } from '../../../services/crg/schema.models';

import '!style-loader!css-loader!sass-loader!./Form-Control.scss';

export const cnFormControl = cn('Form', 'Control');

export interface FormControlProps<T extends Record<string, unknown> = Record<string, unknown>> extends IClassNameProps {
  htmlId?: string;
  type?: PropertyType;
  property?: PropertySchema<T>;
  fieldValue?: T[keyof T];
  formValue?: T;
  inSet?: boolean;
  errors?: string[];
  variant?: 'standard' | 'outlined';
  fullWidthForOldForm?: boolean;
  labelInTextField?: boolean;
  children?: ReactNode;
  onChange?: ({ value: T, propertyName: string }) => void;
  onNeedValidate?: ({ value: T, propertyName: string }) => void;
}

export const FormControl: FC<FormControlProps> = ({ children, className }) => (
  <div className={cnFormControl(null, [className])}>{children}</div>
);
