import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../../services/models';

import './Form-Error.scss';

const cnForm = cn('Form-Error');

export const FormError: FC<IClassNameProps & ChildrenProps> = ({ children }) => (
  <div className={cnForm()}>{children}</div>
);
