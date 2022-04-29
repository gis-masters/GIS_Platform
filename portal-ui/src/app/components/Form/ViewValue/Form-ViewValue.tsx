import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Form-ViewValue.scss';

const cnFormViewValue = cn('Form', 'ViewValue');

interface FormViewValueProps {
  code?: boolean;
  children: ReactNode;
}

export const FormViewValue: FC<FormViewValueProps> = ({ children, code }) => (
  <div className={cnFormViewValue({ code }, ['scroll'])}>{children}</div>
);
