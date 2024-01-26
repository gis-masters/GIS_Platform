import React, { FC, useCallback } from 'react';
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
}) => {
  const mainSwiperReadyHandler = useCallback(
    (e: SwiperClass) => {
      onMainSwiperReady(e);
      onZoomed(e.zoom.scale === 1);
    },
    [onMainSwiperReady, onZoomed]
  );

  const zoomedHandler = useCallback(() => {
    onZoomed(!zoomed);
  }, [onZoomed, zoomed]);

  const swiperChangeHadler = useCallback(
    (swiper: SwiperClass) => {
      const activeIndex: number = swiper.activeIndex;
      if (imagesWithUrls) {
        onImageChange(imagesWithUrls[activeIndex]);
      }
    },
    [imagesWithUrls, onImageChange]
  );

  const mainSwiperClickHandler = useCallback(() => {
    if (mainSwiper) {
      mainSwiper.zoom.in(ratio);
    }
  }, [mainSwiper, ratio]);

  return (
    <Swiper
      className={cnCarousel('MainSwiper', { type: isPdfFile(currentImage.file) && 'document' })}
      onSwiper={mainSwiperReadyHandler}
      data-swiper-zoom={{ maxRatio: ratio, minRatio: 1 }}
      onZoomChange={zoomedHandler}
      onSlideChange={swiperChangeHadler}
      pagination={{
        type: 'fraction'
      }}
      navigation
      zoom
      thumbs={{ swiper: thumbsSwiper }}
      onClick={mainSwiperClickHandler}
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
};
