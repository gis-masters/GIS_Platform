import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ImagesForCarouselWrapper } from '../Wrapper/Carousel-Wrapper';

import './Carousel-ThumbsImage.scss';

interface CarouselThumbsImageProps {
  image: ImagesForCarouselWrapper;
}

const cnCarousel = cn('Carousel');

export const CarouselThumbsImage: FC<CarouselThumbsImageProps> = ({ image }) => (
  <img className={cnCarousel('ThumbsImage')} src={image.url} alt={image.file.title} loading='lazy' />
);
