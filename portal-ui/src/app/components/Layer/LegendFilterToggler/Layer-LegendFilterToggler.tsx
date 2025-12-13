import React, { type FC } from 'react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import { IconButton } from '../../IconButton/IconButton';
import { Filter } from '../../Icons/Filter';
import { FilterOutlined } from '../../Icons/FilterOutlined';

import './Layer-LegendFilterToggler.scss';

const cnLayerLegendFilterToggler = cn('Layer', 'LegendFilterToggler');

interface LayerLegendFilterTogglerProps {
  onClick(): void;
  enabled: boolean;
}

export const LayerLegendFilterToggler: FC<LayerLegendFilterTogglerProps> = ({ enabled, onClick }) => {
  const Icon = enabled ? Filter : FilterOutlined;

  return (
    <Tooltip title='Показывать знаки только для отображаемых на карте объектов' enterDelay={700}>
      <span>
        <IconButton className={cnLayerLegendFilterToggler()} onClick={onClick} size='small'>
          <Icon fontSize='inherit' />
        </IconButton>
      </span>
    </Tooltip>
  );
};
