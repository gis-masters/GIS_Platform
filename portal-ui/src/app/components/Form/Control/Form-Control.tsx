import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type PropertySchema, type PropertyType } from '../../../services/data/schema/schema.models';
import { type ChildrenProps } from '../../../services/models';
import { type FormRole } from '../Form.models';

import './Form-Control.scss';

export const cnFormControl = cn('Form', 'Control');

export interface FormControlProps extends IClassNameProps, ChildrenProps {
  htmlId?: string;
  type?: PropertyType;
  property: PropertySchema;
  fieldValue?: unknown;
  formValue?: unknown;
  formRole?: FormRole;
  inSet?: boolean;
  errors?: string[];
  warnings?: string[];
  variant?: 'standard' | 'outlined';
  fullWidthForOldForm?: boolean;
  labelInField?: boolean;
  onChange?(params: { value: unknown; propertyName: string }): void;
  onNeedValidate?(params: { value: unknown; propertyName: string }): void;
}

export const FormControl: FC<FormControlProps> = ({ children, className }) => (
  <div className={cnFormControl(null, [className])}>{children}</div>
);
