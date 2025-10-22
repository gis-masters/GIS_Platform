import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ImagesForCarouselWrapper } from '../Wrapper/Carousel-Wrapper';

import './Carousel-MainImage.scss';

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
