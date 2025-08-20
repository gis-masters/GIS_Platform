import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ImagesForCarouselWrapper } from '../Wrapper/Carousel-Wrapper';

import '!style-loader!css-loader!sass-loader!./Carousel-ThumbsImage.scss';

interface CarouselThumbsImageProps {
  image: ImagesForCarouselWrapper;
}

const cnCarousel = cn('Carousel');

export const CarouselThumbsImage: FC<CarouselThumbsImageProps> = ({ image }) => (
  <img className={cnCarousel('ThumbsImage')} src={image.url} alt={image.file.title} loading='lazy' />
);
