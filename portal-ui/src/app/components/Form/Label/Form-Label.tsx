import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../../services/models';
import { FormDescription } from '../Description/Form-Description';
import { FormRequired } from '../Required/Form-Required';

import '!style-loader!css-loader!sass-loader!./Form-Label.scss';

const cnFormLabel = cn('Form', 'Label');

interface FormLabelProps extends IClassNameProps, ChildrenProps {
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
