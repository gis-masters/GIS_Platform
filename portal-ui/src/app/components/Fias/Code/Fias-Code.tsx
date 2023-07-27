import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Fias-Code.scss';

const cnFiasCode = cn('Fias', 'Code');

interface FiasCodeProps {
  text: ReactNode;
  title?: ReactNode;
}

export const FiasCode: FC<FiasCodeProps> = ({ title, text }) => (
  <div className={cnFiasCode()}>
    {title}: {text}
  </div>
);
