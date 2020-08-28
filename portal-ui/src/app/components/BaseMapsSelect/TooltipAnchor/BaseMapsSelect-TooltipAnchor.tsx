import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Tooltip } from '@material-ui/core';

import '!style-loader!css-loader!sass-loader!./BaseMapsSelect-TooltipAnchor.scss';

const cnBaseMapsSelectTooltipAnchor = cn('BaseMapsSelect', 'TooltipAnchor');

interface BaseMapsSelectTooltipAnchorProps {
  hidden: boolean;
}

export const BaseMapsSelectTooltipAnchor: FC<BaseMapsSelectTooltipAnchorProps> = ({ hidden }) => (
  <Tooltip title='Переключить карту' placement='top' hidden={hidden}>
    <div className={cnBaseMapsSelectTooltipAnchor()}></div>
  </Tooltip>
);
