import React, { FC } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Layer-Eye.scss';

const cnLayer = cn('Layer');

interface LayerEyeProps {
  enabled: boolean;
  disabled: boolean;
  tooltipText: string;
  onClick(): void;
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
