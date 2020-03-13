import React, { FC } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

const cnForm = cn('Form');

import '!style-loader!css-loader!sass-loader!./Form-Label.scss';

interface FormLabelProps extends IClassNameProps {
  htmlFor?: string;
}

export const FormLabel: FC<FormLabelProps> = ({ className, children, htmlFor }) => (
  <label className={cnForm('Label', [className])} htmlFor={htmlFor}>
    {children}
  </label>
);
