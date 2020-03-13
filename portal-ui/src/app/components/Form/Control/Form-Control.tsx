import React, { FC } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

const cnForm = cn('Form');

import '!style-loader!css-loader!sass-loader!./Form-Control.scss';

export const FormControl: FC<IClassNameProps> = ({ children, className }) => (
  <div className={cnForm('Control', [className])}>
    {children}
  </div>
);
