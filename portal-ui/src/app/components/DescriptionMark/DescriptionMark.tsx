import React, { type FC } from 'react';
import { Tooltip } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../services/models';

import './DescriptionMark.scss';

const cnDescriptionMark = cn('DescriptionMark');

const handleMouseEvent = (e: React.MouseEvent) => {
  e.stopPropagation();
};

export const DescriptionMark: FC<ChildrenProps & IClassNameProps> = ({ children, className }) => {
  return (
    <Tooltip title={children} open={!!children && undefined}>
      <HelpOutline
        className={cnDescriptionMark(null, [className])}
        color='primary'
        fontSize='inherit'
        onMouseOver={handleMouseEvent}
        onMouseOut={handleMouseEvent}
      />
    </Tooltip>
  );
};
