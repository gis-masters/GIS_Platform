import React, { FC, ReactNode } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

const cnFormField = cn('Form', 'Field');

import '!style-loader!css-loader!sass-loader!./Form-Field.scss';

interface FormFieldProps extends IClassNameProps {
  withRelations?: boolean;
  children: ReactNode;
}

export const FormField: FC<FormFieldProps> = ({ className, withRelations, children }) => (
  <div className={cnFormField({ withRelations }, [className])}>{children}</div>
);
