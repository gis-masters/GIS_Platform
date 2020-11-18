import React, { FC, FormEvent } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Form.scss';

export { FormField } from './Field/Form-Field';
export { FormLabel } from './Label/Form-Label';
export { FormControl } from './Control/Form-Control';

export const cnForm = cn('Form');

export const Form: FC<React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>> = props => (
  <form action='#' {...props} className={cnForm(null, [props.className])} />
);
