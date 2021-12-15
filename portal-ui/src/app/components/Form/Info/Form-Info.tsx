import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Form-Info.scss';

const cnFormErrors = cn('Form', 'Info');

interface FormInfoProps {
  text: string;
  title?: string;
}

export const FormInfo: FC<FormInfoProps> = ({ title, text }) => (
  <div className={cnFormErrors()}>
    {title}: {text}
  </div>
);
