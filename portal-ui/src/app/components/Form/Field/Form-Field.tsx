import React, { FC } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

const cnForm = cn('Form');

import '!style-loader!css-loader!sass-loader!./Form-Field.scss';

export const FormField: FC<IClassNameProps> = ({ className, children }) => (
  <div className={cnForm('Field', [className])}>
    {children}
  </div>
);
