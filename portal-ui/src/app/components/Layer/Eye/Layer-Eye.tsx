import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IconButton } from '@material-ui/core';

import { Visibility, VisibilityOff } from '@material-ui/icons';

import '!style-loader!css-loader!sass-loader!./Layer-Eye.scss';

const cnLayer = cn('Layer');

interface LayerEyeProps {
  enabled: boolean;
  disabled: boolean;
  onClick: () => void;
}

export const LayerEye: FC<LayerEyeProps> = ({ enabled, disabled, onClick }) => {
  const Icon = enabled ? Visibility : VisibilityOff;

  return (
    <IconButton className={cnLayer('Eye')} color='primary' size='small' onClick={onClick} disabled={disabled}>
      <Icon fontSize='inherit' />
    </IconButton>
  );
}
