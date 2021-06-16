import React, { ComponentType, FC } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { ValueType, PropertySchema } from '../../../services/crg/schema.models';

import '!style-loader!css-loader!sass-loader!./Form-Control.scss';

export const cnFormControl = cn('Form', 'Control');

export interface FormControlProps<T = unknown> extends IClassNameProps {
  htmlId?: string;
  type?: ValueType;
  property?: PropertySchema;
  fieldValue?: T;
  onChange?: ({ value: T, propertyName: string }) => void;
  FormControl?: ComponentType<FormControlProps>;
  inSet?: boolean;
}

export const FormControl: FC<FormControlProps> = ({ children, className }) => (
  <div className={cnFormControl(null, [className])}>{children}</div>
);
