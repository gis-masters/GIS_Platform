import React, { FC, useCallback } from 'react';
import { cn } from '@bem-react/classname';
import { FreeMode, Navigation, Pagination, Thumbs, Zoom } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

import { isPdfFile } from '../../../services/data/files/files.util';
import { CarouselImageInfo } from '../Carousel';
import { CarouselDocument } from '../Document/Carousel-Document';
import { CarouselMainImage } from '../MainImage/Carousel-MainImage';
import { ImagesForCarouselWrapper } from '../Wrapper/Carousel-Wrapper';

import '!style-loader!css-loader!sass-loader!./Carousel-MainSwiper.scss';

const cnCarousel = cn('Carousel');

interface CarouselMainSwiperProps {
  imagesWithUrls: ImagesForCarouselWrapper[];
  currentImage?: CarouselImageInfo;
  startingImage?: CarouselImageInfo;
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
}) => {
  const handleMainSwiperReady = useCallback(
    (e: SwiperClass) => {
      onMainSwiperReady(e);
      onZoomed(e.zoom.scale === 1);
    },
    [onMainSwiperReady, onZoomed]
  );

  const handleZoomChange = useCallback(() => {
    onZoomed(!zoomed);
  }, [onZoomed, zoomed]);

  const handleSlideChange = useCallback(
    (swiper: SwiperClass) => {
      const activeIndex: number = swiper.activeIndex;
      if (imagesWithUrls) {
        onImageChange(imagesWithUrls[activeIndex]);
      }
    },
    [imagesWithUrls, onImageChange]
  );

  const handleMainSwiperClick = useCallback(() => {
    if (mainSwiper) {
      mainSwiper.zoom.in(ratio);
    }
  }, [mainSwiper, ratio]);

  return (
    <Swiper
      className={cnCarousel('MainSwiper', { type: currentImage?.file && isPdfFile(currentImage.file) && 'document' })}
      onSwiper={handleMainSwiperReady}
      data-swiper-zoom={{ maxRatio: ratio, minRatio: 1 }}
      onZoomChange={handleZoomChange}
      onSlideChange={handleSlideChange}
      pagination={{
        type: 'fraction'
      }}
      navigation
      zoom
      thumbs={{ swiper: thumbsSwiper }}
      onClick={handleMainSwiperClick}
      modules={[Pagination, FreeMode, Navigation, Thumbs, Zoom]}
    >
      {imagesWithUrls.map(imageWithUrl => (
        <SwiperSlide key={imageWithUrl.file.id}>
          {currentImage?.file && isPdfFile(currentImage.file) ? (
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
};
