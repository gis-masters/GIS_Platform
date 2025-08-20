import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import { ZoomInWarning } from '../../Icons/ZoomInWarning';
import { ZoomOutWarning } from '../../Icons/ZoomOutWarning';

import '!style-loader!css-loader!sass-loader!./Layer-ZoomWarning.scss';

const cnLayerZoomWarning = cn('Layer', 'ZoomWarning');

interface LayerZoomWarningProps {
  tooltipText: string;
  out: boolean;
}

export const LayerZoomWarning: FC<LayerZoomWarningProps> = observer(({ tooltipText, out }) => {
  const CurrentIcon = out ? ZoomOutWarning : ZoomInWarning;

  return (
    <Tooltip title={tooltipText}>
      <span>
        <div className={cnLayerZoomWarning()}>
          <CurrentIcon fontSize='inherit' />
        </div>
      </span>
    </Tooltip>
  );
});
