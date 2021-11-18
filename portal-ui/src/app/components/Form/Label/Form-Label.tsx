import React, { FC } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';
import { FormRequired } from '../Required/Form-Required';

const cnFormLabel = cn('Form', 'Label');

import '!style-loader!css-loader!sass-loader!./Form-Label.scss';

interface FormLabelProps extends IClassNameProps {
  htmlFor?: string;
  required?: boolean;
  readonly?: boolean;
}

export const FormLabel: FC<FormLabelProps> = ({ className, children, htmlFor, required, readonly }) => (
  <label className={cnFormLabel({ readonly }, [className])} htmlFor={htmlFor}>
    {children}
    {!readonly && required && <FormRequired />}
  </label>
);
