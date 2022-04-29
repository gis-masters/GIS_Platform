import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import '!style-loader!css-loader!sass-loader!./Lookup-Item.scss';

const cnLookupItem = cn('Lookup', 'Item');

interface LookupItemProps extends IClassNameProps {
  children: ReactNode;
}

export const LookupItem: FC<LookupItemProps> = ({ children, className }) => (
  <div className={cnLookupItem(null, [className])}>{children}</div>
);
