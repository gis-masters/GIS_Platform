import React, { FC, ReactNode } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

const cnForm = cn('Form-Error');

import '!style-loader!css-loader!sass-loader!./Form-Error.scss';

interface FormErrorProps extends IClassNameProps {
  children: ReactNode;
}

export const FormError: FC<FormErrorProps> = ({ children }) => <div className={cnForm()}>{children}</div>;
