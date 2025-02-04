import React, { FC } from 'react';
import { CloseFullscreen, OpenInFull } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { IconButton } from '../../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./Carousel-OpenInFull.scss';

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
