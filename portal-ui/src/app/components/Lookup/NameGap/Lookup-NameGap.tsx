import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Lookup-NameGap.scss';

const cnLookupNameGap = cn('Lookup', 'NameGap');

interface LookupNameGapProps {
  children?: ReactNode;
}

export const LookupNameGap: FC<LookupNameGapProps> = ({ children }) => (
  <div className={cnLookupNameGap()}>{children}</div>
);
