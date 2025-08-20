import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import { CarouselSubTitle } from '../SubTitle/Carousel-SubTitle';
import { CarouselTitle } from '../Title/Carousel-Title';

import '!style-loader!css-loader!sass-loader!./Carousel-Header.scss';

const cnCarousel = cn('Carousel');

export type CarouselHeaderProps = {
  title: ReactNode;
  subTitle?: ReactNode;
};

export const CarouselHeader: FC<CarouselHeaderProps> = ({ title, subTitle }) => (
  <div className={cnCarousel('Header')}>
    {title && <CarouselTitle>{title}</CarouselTitle>}
    {subTitle && <CarouselSubTitle>{subTitle}</CarouselSubTitle>}
  </div>
);
