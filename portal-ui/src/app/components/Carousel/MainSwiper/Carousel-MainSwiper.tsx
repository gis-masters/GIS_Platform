/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/jsx-no-bind */
import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import { FreeMode, Navigation, Pagination, Thumbs, Zoom } from 'swiper/modules';

import { isPdfFile } from '../../../services/data/files/files.util';

import { ImagesForCarouselWrapper } from '../Wrapper/Carousel-Wrapper';
import { CarouselImageInfo } from '../Carousel';
import { CarouselDocument } from '../Document/Carousel-Document';
import { CarouselMainImage } from '../MainImage/Carousel-MainImage';

import '!style-loader!css-loader!sass-loader!./Carousel-MainSwiper.scss';

const cnCarousel = cn('Carousel');

interface CarouselMainSwiperProps {
  imagesWithUrls: ImagesForCarouselWrapper[];
  currentImage: CarouselImageInfo | undefined;
  startingImage: CarouselImageInfo;
  error?: string;
  busy: boolean;
  expanded: boolean;
  thumbsSwiper?: SwiperClass;
  mainSwiper?: SwiperClass;
  zoomed: boolean;
  ratio?: number;
  onImageChange(image: CarouselImageInfo): void;
  onExpand(expanded: boolean): void;
  onThumbsSwiperReady(swiper: SwiperClass): void;
  onMainSwiperReady(swiper: SwiperClass): void;
  onZoomed(zoomed: boolean): void;
  onImageLoad(): void;
}

export const CarouselMainSwiper: FC<CarouselMainSwiperProps> = ({
  imagesWithUrls,
  currentImage,
  thumbsSwiper,
  mainSwiper,
  zoomed,
  ratio,
  onImageChange,
  onImageLoad,
  onMainSwiperReady,
  onZoomed
}) => (
  <Swiper
    className={cnCarousel('MainSwiper', { type: isPdfFile(currentImage.file) && 'document' })}
    onSwiper={e => {
      onMainSwiperReady(e);
      onZoomed(e.zoom.scale === 1);
    }}
    data-swiper-zoom={{ maxRatio: ratio, minRatio: 1 }}
    onZoomChange={() => {
      onZoomed(!zoomed);
    }}
    onSlideChange={(swiper: SwiperClass) => {
      const activeIndex: number = swiper.activeIndex;
      if (imagesWithUrls) {
        onImageChange(imagesWithUrls[activeIndex]);
      }
    }}
    pagination={{
      type: 'fraction'
    }}
    navigation
    zoom
    thumbs={{ swiper: thumbsSwiper }}
    onClick={() => {
      if (mainSwiper) {
        mainSwiper.zoom.in(ratio);
      }
    }}
    modules={[Pagination, FreeMode, Navigation, Thumbs, Zoom]}
  >
    {imagesWithUrls.map(imageWithUrl => (
      <SwiperSlide key={imageWithUrl.file.id}>
        {isPdfFile(currentImage.file) ? (
          <CarouselDocument imageWithUrl={imageWithUrl} onLoad={onImageLoad} />
        ) : (
          <div className='swiper-zoom-container'>
            <CarouselMainImage imageWithUrl={imageWithUrl} onLoad={onImageLoad} />
          </div>
        )}
      </SwiperSlide>
    ))}
  </Swiper>
);
