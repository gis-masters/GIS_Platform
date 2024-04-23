import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Form-Field.scss';

const cnFormField = cn('Form', 'Field');

interface FormFieldProps extends IClassNameProps, ChildrenProps {
  withRelations?: boolean;
}

export const FormField: FC<FormFieldProps> = ({ className, withRelations, children }) => (
  <div className={cnFormField({ withRelations }, [className])}>{children}</div>
);
