import React, { ComponentType, FC } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { PropertyType, PropertySchema } from '../../../services/crg/schema.models';
import { FormDialogProps } from '../../FormDialog/FormDialog';

import { FormProps } from '../Form';

import '!style-loader!css-loader!sass-loader!./Form-Control.scss';

export const cnFormControl = cn('Form', 'Control');

export interface FormControlProps<T extends Record<string, unknown> = Record<string, unknown>> extends IClassNameProps {
  htmlId?: string;
  type?: PropertyType;
  property?: PropertySchema<T>;
  fieldValue?: T[keyof T];
  formValue?: T;
  onChange?: ({ value: T, propertyName: string }) => void;
  onNeedValidate?: ({ value: T, propertyName: string }) => void;
  inSet?: boolean;
  errors?: string[];
  FormControl?: ComponentType<FormControlProps>;
  FormView?: ComponentType<FormControlProps>;
  Form?: ComponentType<FormProps<Record<string, unknown>>>;
  FormDialog?: ComponentType<FormDialogProps<Record<string, unknown>>>;
  variant?: 'standard' | 'outlined';
  fullWidthForOldForm?: boolean;
}

export const FormControl: FC<FormControlProps> = ({ children, className }) => (
  <div className={cnFormControl(null, [className])}>{children}</div>
);
