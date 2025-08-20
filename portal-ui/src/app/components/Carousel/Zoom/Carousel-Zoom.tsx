import React, { FC } from 'react';
import { Tooltip } from '@mui/material';
import { ZoomIn, ZoomOut } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { IconButton } from '../../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./Carousel-Zoom.scss';

const cnCarouselZoom = cn('Carousel', 'Zoom');

type CarouselZoomProps = {
  zoomed: boolean;
  onZoomChange(): void;
};

export const CarouselZoom: FC<CarouselZoomProps> = ({ zoomed, onZoomChange }) => {
  const IconType = zoomed ? ZoomIn : ZoomOut;

  return (
    <Tooltip title={zoomed ? 'Увеличить' : 'Уменьшить'}>
      <span>
        <IconButton className={cnCarouselZoom()} onClick={onZoomChange}>
          <IconType fontSize='large' />
        </IconButton>
      </span>
    </Tooltip>
  );
};
