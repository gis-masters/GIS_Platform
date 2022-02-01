import React, { FC, ReactNode } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { FormRequired } from '../Required/Form-Required';
import { FormDescription } from '../Description/Form-Description';

import '!style-loader!css-loader!sass-loader!./Form-Label.scss';

const cnFormLabel = cn('Form', 'Label');

interface FormLabelProps extends IClassNameProps {
  htmlFor?: string;
  required?: boolean;
  readonly?: boolean;
  description?: ReactNode;
}

export const FormLabel: FC<FormLabelProps> = ({ className, children, htmlFor, required, readonly, description }) => (
  <label className={cnFormLabel({ readonly }, [className])} htmlFor={htmlFor}>
    {children}
    {required && !readonly && <FormRequired />}
    {description && <FormDescription>{description}</FormDescription>}
  </label>
);
