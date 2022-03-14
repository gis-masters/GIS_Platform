import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import '!style-loader!css-loader!sass-loader!./Lookup-Item.scss';

const cnLookupItem = cn('Lookup', 'Item');

export const LookupItem: FC<IClassNameProps> = ({ children, className }) => (
  <div className={cnLookupItem(null, [className])}>{children}</div>
);
