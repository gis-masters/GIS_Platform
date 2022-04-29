import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import '!style-loader!css-loader!sass-loader!./Lookup-Icon.scss';

const cnLookupIcon = cn('Lookup', 'Icon');

interface LookupIconProps extends IClassNameProps {
  children: ReactNode;
}

export const LookupIcon: FC<LookupIconProps> = ({ children, className }) => (
  <span className={cnLookupIcon(null, [className])}>{children}</span>
);
