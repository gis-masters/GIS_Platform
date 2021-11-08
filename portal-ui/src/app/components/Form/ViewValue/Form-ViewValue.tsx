import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

const cnFormViewValue = cn('Form', 'ViewValue');

export const FormViewValue: FC = ({ children }) => <div className={cnFormViewValue()}>{children}</div>;
