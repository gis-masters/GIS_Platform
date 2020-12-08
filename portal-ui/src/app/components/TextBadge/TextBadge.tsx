import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { Paper } from '@material-ui/core';
import { IClassNameProps } from '@bem-react/core';

import '!style-loader!css-loader!sass-loader!./TextBadge.scss';

const cnTextBadge = cn('TextBadge');

interface TextBadgePropsWithId extends IClassNameProps {
  id: string | number;
}

interface TextBadgePropsWithChildren extends IClassNameProps {
  id?: string | number;
  children: ReactNode;
}

type TextBadgeProps = TextBadgePropsWithId | TextBadgePropsWithChildren;

export const TextBadge: FC<TextBadgeProps> = ({ id, className, children }) => (
  <Paper className={cnTextBadge(null, [className])}>
    {(id || typeof id === 'number') && `id: ${id}`} {children}
  </Paper>
);
