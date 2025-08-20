import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Carousel-SubTitle.scss';

const cnCarouselSubTitle = cn('Carousel', 'SubTitle');

export const CarouselSubTitle: FC<ChildrenProps> = ({ children }) => (
  <div className={cnCarouselSubTitle()}>{children}</div>
);
