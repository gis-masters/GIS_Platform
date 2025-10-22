import React, { type FC } from 'react';
import { CloseFullscreen, OpenInFull } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { IconButton } from '../../IconButton/IconButton';

import './Carousel-OpenInFull.scss';

const cnCarouselOpenInFull = cn('Carousel', 'OpenInFull');

interface CarouselOpenInFullProps {
  expanded: boolean;
  onExpand(): void;
}

export const CarouselOpenInFull: FC<CarouselOpenInFullProps> = ({ expanded, onExpand }) => (
  <IconButton className={cnCarouselOpenInFull()} onClick={onExpand}>
    {expanded ? <CloseFullscreen /> : <OpenInFull />}
  </IconButton>
);
