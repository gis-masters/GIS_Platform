import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import '!style-loader!css-loader!sass-loader!./Lookup-Actions.scss';

const cnLookupActions = cn('Lookup', 'Actions');

interface LookupActionsProps extends IClassNameProps {
  children: ReactNode;
}

export const LookupActions: FC<LookupActionsProps> = ({ className, children }) => (
  <div className={cnLookupActions(null, [className])}>{children}</div>
);
