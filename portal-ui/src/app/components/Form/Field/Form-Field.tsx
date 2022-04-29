import React, { FC, ReactNode } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

const cnForm = cn('Form');

import '!style-loader!css-loader!sass-loader!./Form-Field.scss';

interface FormFieldProps extends IClassNameProps {
  children: ReactNode;
}

export const FormField: FC<FormFieldProps> = ({ className, children }) => (
  <div className={cnForm('Field', [className])}>{children}</div>
);
