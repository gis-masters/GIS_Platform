import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Tooltip } from '@material-ui/core';

import { ZoomOutWarning } from '../../Icons/ZoomOutWarning';
import { ZoomInWarning } from '../../Icons/ZoomInWarning';

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
      <div className={cnLayerZoomWarning()}>
        <CurrentIcon fontSize='inherit' />
      </div>
    </Tooltip>
  );
});
