import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ImagesForCarouselWrapper } from '../Wrapper/Carousel-Wrapper';

import '!style-loader!css-loader!sass-loader!./Carousel-MainImage.scss';

interface CarouselMainImage {
  imageWithUrl: ImagesForCarouselWrapper;
  onLoad(): void;
}

const cnCarousel = cn('Carousel');

export const CarouselMainImage: FC<CarouselMainImage> = ({ imageWithUrl, onLoad }) => (
  <img
    onLoad={onLoad}
    className={cnCarousel('MainImage')}
    src={imageWithUrl.url}
    alt={imageWithUrl.file.title}
    loading='lazy'
  />
);
