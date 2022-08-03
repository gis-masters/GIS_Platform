import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Form-ViewValue.scss';

const cnFormViewValue = cn('Form', 'ViewValue');

interface FormViewValueProps extends ChildrenProps {
  code?: boolean;
}

export const FormViewValue: FC<FormViewValueProps> = ({ children, code }) => (
  <div className={cnFormViewValue({ code }, ['scroll'])}>{children}</div>
);
