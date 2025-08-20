import React, { FC, useCallback } from 'react';
import { useLocalObservable } from 'mobx-react';
import { DialogContent, Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { SwiperClass } from 'swiper/react';

import { isPdfFile } from '../../../services/data/files/files.util';
import { Loading } from '../../Loading/Loading';
import { CarouselImageInfo } from '../Carousel';
import { CarouselMainSwiper } from '../MainSwiper/Carousel-MainSwiper';
import { CarouselOpenInFull } from '../OpenInFull/Carousel-OpenInFull';
import { CarouselThumbsSwiper } from '../ThumbsSwiper/Carousel-ThumbsSwiper';

import '!style-loader!css-loader!sass-loader!./Carousel-Wrapper.scss';
import '!style-loader!css-loader!sass-loader!../Empty/Carousel-Empty.scss';

export interface ImagesForCarouselWrapper extends CarouselImageInfo {
  url: string;
}

interface CarouselWrapperProps {
  imagesWithUrls: ImagesForCarouselWrapper[];
  currentImage?: CarouselImageInfo;
  startingImage?: CarouselImageInfo;
  error?: string;
  expanded: boolean;
  thumbsSwiper?: SwiperClass;
  mainSwiper?: SwiperClass;
  zoomed: boolean;
  ratio?: number;
  onImageChange(image: CarouselImageInfo): void;
  onExpand(): void;
  onMainSwiperReady(swiper: SwiperClass): void;
  onThumbsSwiperReady(swiper: SwiperClass): void;
  onZoomed(zoomed: boolean): void;
}

interface CarouselWrapperStore {
  busy: boolean;
  setBusy(busy: boolean): void;
}

const cnCarousel = cn('Carousel', 'Wrapper');

export const CarouselWrapper: FC<CarouselWrapperProps> = ({
  imagesWithUrls,
  currentImage,
  startingImage,
  expanded,
  thumbsSwiper,
  mainSwiper,
  zoomed,
  ratio,
  onImageChange,
  onExpand,
  onMainSwiperReady,
  onThumbsSwiperReady,
  onZoomed
}) => {
  const state = useLocalObservable(
    (): CarouselWrapperStore => ({
      busy: false,
      setBusy(this: CarouselWrapperStore, busy: boolean): void {
        this.busy = busy;
      }
    })
  );

  const { busy, setBusy } = state;

  const onImageLoad = useCallback(() => setBusy(false), [setBusy]);

  return (
    <DialogContent className={cnCarousel('Wrapper')}>
      {!imagesWithUrls.length && <div className={cnCarousel('Empty')}>Файлы отсутствуют</div>}
      {currentImage && !!imagesWithUrls.length && (
        <CarouselMainSwiper
          imagesWithUrls={imagesWithUrls}
          startingImage={startingImage}
          currentImage={currentImage}
          busy={busy}
          expanded={expanded}
          zoomed={zoomed}
          ratio={ratio}
          mainSwiper={mainSwiper}
          thumbsSwiper={thumbsSwiper}
          onImageChange={onImageChange}
          onImageLoad={onImageLoad}
          onExpand={onExpand}
          onThumbsSwiperReady={onThumbsSwiperReady}
          onMainSwiperReady={onMainSwiperReady}
          onZoomed={onZoomed}
        />
      )}
      {imagesWithUrls.length > 1 && (
        <CarouselThumbsSwiper imagesWithUrls={imagesWithUrls} onThumbsSwiperReady={onThumbsSwiperReady} />
      )}
      {currentImage && isPdfFile(currentImage.file) && (
        <Tooltip title={expanded ? 'Свернуть' : 'Развернуть'}>
          <span>
            <CarouselOpenInFull expanded={expanded} onExpand={onExpand} />
          </span>
        </Tooltip>
      )}
      <Loading visible={busy} />
    </DialogContent>
  );
};
