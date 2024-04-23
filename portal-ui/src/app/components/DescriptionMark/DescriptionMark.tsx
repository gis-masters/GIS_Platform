import React, { FC } from 'react';
import { Tooltip } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../services/models';

import '!style-loader!css-loader!sass-loader!./DescriptionMark.scss';

const cnDescriptionMark = cn('DescriptionMark');

export const DescriptionMark: FC<ChildrenProps & IClassNameProps> = ({ children, className }) => (
  <Tooltip title={children} open={!!children && undefined}>
    <HelpOutline className={cnDescriptionMark(null, [className])} color='primary' fontSize='inherit' />
  </Tooltip>
);
