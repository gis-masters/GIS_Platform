import React, { type FC } from 'react';
import { Paper } from '@mui/material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../services/models';

import './TextBadge.scss';

const cnTextBadge = cn('TextBadge');

interface TextBadgeProps extends IClassNameProps, ChildrenProps {
  id?: string | number;
}

export const TextBadge: FC<TextBadgeProps> = ({ id, className, children }) => (
  <Paper className={cnTextBadge(null, [className])}>
    {(id || typeof id === 'number') && (
      <>
        <span className={cnTextBadge('Id')}>id: </span>
        {id}
      </>
    )}
    {children}
  </Paper>
);
