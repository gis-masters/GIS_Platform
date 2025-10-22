import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../../services/models';

import './Form-Field.scss';

const cnFormField = cn('Form', 'Field');

interface FormFieldProps extends IClassNameProps, ChildrenProps {
  withRelations?: boolean;
}

export const FormField: FC<FormFieldProps> = ({ className, withRelations, children }) => (
  <div className={cnFormField({ withRelations }, [className])}>{children}</div>
);
