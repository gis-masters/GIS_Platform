import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { PropertySchema, PropertyType } from '../../../services/data/schema/schema.models';
import { ChildrenProps } from '../../../services/models';
import { FormRole } from '../Form.async';

import '!style-loader!css-loader!sass-loader!./Form-Control.scss';

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
  variant?: 'standard' | 'outlined';
  fullWidthForOldForm?: boolean;
  labelInField?: boolean;
  onChange?(params: { value: unknown; propertyName: string }): void;
  onNeedValidate?(params: { value: unknown; propertyName: string }): void;
}

export const FormControl: FC<FormControlProps> = ({ children, className }) => (
  <div className={cnFormControl(null, [className])}>{children}</div>
);
