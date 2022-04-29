import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { Tooltip } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
import { IClassNameProps } from '@bem-react/core';

import '!style-loader!css-loader!sass-loader!./DescriptionMark.scss';

const cnDescriptionMark = cn('DescriptionMark');

interface DescriptionMarkProps extends IClassNameProps {
  children: ReactNode;
}

export const DescriptionMark: FC<DescriptionMarkProps> = ({ children, className }) => (
  <Tooltip title={children} open={!!children && undefined}>
    <HelpOutline className={cnDescriptionMark(null, [className])} color='primary' fontSize='inherit' />
  </Tooltip>
);
