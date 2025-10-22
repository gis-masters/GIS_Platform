import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './Carousel-SubTitle.scss';

const cnCarouselSubTitle = cn('Carousel', 'SubTitle');

export const CarouselSubTitle: FC<ChildrenProps> = ({ children }) => (
  <div className={cnCarouselSubTitle()}>{children}</div>
);
