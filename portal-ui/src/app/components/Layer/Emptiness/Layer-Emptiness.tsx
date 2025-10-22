import React, { type FC } from 'react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import { TextBadge } from '../../TextBadge/TextBadge';

import './Layer-Emptiness.scss';

const cnLayerEmptiness = cn('Layer', 'Emptiness');

export const LayerEmptiness: FC = () => (
  <TextBadge className={cnLayerEmptiness()}>
    <Tooltip title='Группы, не содержащие слоёв, видны только в режиме настройки'>
      <span>пусто</span>
    </Tooltip>
  </TextBadge>
);
