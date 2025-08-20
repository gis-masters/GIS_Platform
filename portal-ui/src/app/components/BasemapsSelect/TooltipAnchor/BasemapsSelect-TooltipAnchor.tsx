import React, { FC } from 'react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./BasemapsSelect-TooltipAnchor.scss';

const cnBasemapsSelectTooltipAnchor = cn('BasemapsSelect', 'TooltipAnchor');

interface BasemapsSelectTooltipAnchorProps {
  hidden: boolean;
  ready: boolean;
}

export const BasemapsSelectTooltipAnchor: FC<BasemapsSelectTooltipAnchorProps> = ({ hidden, ready }) =>
  ready ? (
    <Tooltip title='Переключить карту' placement='top' hidden={hidden} disableInteractive>
      <div className={cnBasemapsSelectTooltipAnchor()} />
    </Tooltip>
  ) : (
    <div className={cnBasemapsSelectTooltipAnchor()} />
  );
