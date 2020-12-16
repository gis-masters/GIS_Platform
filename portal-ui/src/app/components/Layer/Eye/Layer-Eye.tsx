import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IconButton, Tooltip } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

import '!style-loader!css-loader!sass-loader!./Layer-Eye.scss';

const cnLayer = cn('Layer');

interface LayerEyeProps {
  enabled: boolean;
  disabled: boolean;
  onClick: () => void;
  tooltipText: string;
}

export const LayerEye: FC<LayerEyeProps> = ({ enabled, disabled, onClick, tooltipText }) => {
  const Icon = enabled ? Visibility : VisibilityOff;

  return (
    <IconButton className={cnLayer('Eye')} color='primary' size='small' onClick={onClick} disabled={disabled}>
      <Tooltip title={tooltipText}>
        <Icon fontSize='inherit' />
      </Tooltip>
    </IconButton>
  );
};
