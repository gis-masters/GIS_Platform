import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

import { isPdfFile } from '../../../services/data/files/files.util';
import { CarouselPdfIcon } from '../PdfIcon/Carousel-PdfIcon';
import { CarouselThumbsImage } from '../ThumbsImage/Carousel-ThumbsImage';
import { ImagesForCarouselWrapper } from '../Wrapper/Carousel-Wrapper';

import '!style-loader!css-loader!sass-loader!./Carousel-ThumbsSwiper.scss';

const cnCarousel = cn('Carousel');

interface CarouselThumbsSwiperProps {
  imagesWithUrls: ImagesForCarouselWrapper[];
  onThumbsSwiperReady(swiper: SwiperClass): void;
}

export const CarouselThumbsSwiper: FC<CarouselThumbsSwiperProps> = ({ imagesWithUrls, onThumbsSwiperReady }) => (
  <Swiper
    className={cnCarousel('ThumbsSwiper')}
    onSwiper={onThumbsSwiperReady}
    spaceBetween={10}
    slidesPerView={4}
    freeMode
    watchSlidesProgress
    modules={[FreeMode, Navigation, Thumbs]}
  >
    {imagesWithUrls &&
      imagesWithUrls.map(image => (
        <SwiperSlide key={image.file.id}>
          {image && isPdfFile(image.file) ? <CarouselPdfIcon /> : <CarouselThumbsImage image={image} />}
        </SwiperSlide>
      ))}
  </Swiper>
);
