import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Form-Actions.scss';

const cnFormActions = cn('Form', 'Actions');

interface FormActionsProps {
  children: ReactNode;
}

export const FormActions: FC<FormActionsProps> = ({ children }) => <div className={cnFormActions()}>{children}</div>;
