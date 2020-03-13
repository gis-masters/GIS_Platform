import React, { FC, FormEvent } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Form.scss';

export { FormField } from './Field/Form-Field';
export { FormLabel } from './Label/Form-Label';
export { FormControl } from './Control/Form-Control';

export const cnForm = cn('Form');

interface FormProps extends IClassNameProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export const Form: FC<FormProps> = ({ onSubmit, className, children }) => (
  <form className={cnForm(null, [className])} onSubmit={onSubmit}>
    {children}
  </form>
);
