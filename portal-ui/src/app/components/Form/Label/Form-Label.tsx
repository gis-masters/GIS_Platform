import React, { FC } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';
import { FormRequired } from '../Required/Form-Required';

const cnForm = cn('Form');

import '!style-loader!css-loader!sass-loader!./Form-Label.scss';

interface FormLabelProps extends IClassNameProps {
  htmlFor?: string;
  required?: boolean;
}

export const FormLabel: FC<FormLabelProps> = ({ className, children, htmlFor, required }) => (
  <label className={cnForm('Label', [className])} htmlFor={htmlFor}>
    {children}
    {required && <FormRequired />}
  </label>
);
