import React, { type FC, type ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import './Fias-Code.scss';

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
