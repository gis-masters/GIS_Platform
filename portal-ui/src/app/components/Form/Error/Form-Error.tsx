import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../../services/models';

import './Form-Error.scss';

const cnFormError = cn('Form', 'Error');

interface FormErrorProps extends IClassNameProps, ChildrenProps {
  warning?: boolean;
  contents?: boolean;
}

export const FormError: FC<FormErrorProps> = ({ children, warning, contents }) => (
  <div className={cnFormError({ warning, contents })}>{children}</div>
);
