import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Tooltip } from '@material-ui/core';

import '!style-loader!css-loader!sass-loader!./BasemapsSelect-TooltipAnchor.scss';

const cnBasemapsSelectTooltipAnchor = cn('BasemapsSelect', 'TooltipAnchor');

interface BasemapsSelectTooltipAnchorProps {
  hidden: boolean;
}

export const BasemapsSelectTooltipAnchor: FC<BasemapsSelectTooltipAnchorProps> = ({ hidden }) => (
  <Tooltip title='Переключить карту' placement='top' hidden={hidden}>
    <div className={cnBasemapsSelectTooltipAnchor()} />
  </Tooltip>
);
