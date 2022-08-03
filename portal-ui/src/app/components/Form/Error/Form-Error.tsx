import React, { FC } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Form-Error.scss';

const cnForm = cn('Form-Error');

export const FormError: FC<IClassNameProps & ChildrenProps> = ({ children }) => (
  <div className={cnForm()}>{children}</div>
);
