import React, { FC, ReactNode, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { Breakpoint, Dialog, DialogActions } from '@mui/material';
import { cn } from '@bem-react/classname';
import { pdfjs } from 'react-pdf';
import { SwiperClass } from 'swiper/react';

import { filesClient } from '../../services/data/files/files.client';
import { FileInfo } from '../../services/data/files/files.models';
import { isPdfFile } from '../../services/data/files/files.util';
import { Button } from '../Button/Button';
import { CarouselHeader } from './Header/Carousel-Header';
import { CarouselWrapper } from './Wrapper/Carousel-Wrapper';
import { CarouselZoom } from './Zoom/Carousel-Zoom';

import '!style-loader!css-loader!swiper/css';
import '!style-loader!css-loader!swiper/css/pagination';
import '!style-loader!css-loader!swiper/css/navigation';
import '!style-loader!css-loader!swiper/css/thumbs';
import '!style-loader!css-loader!swiper/css/zoom';
import '!style-loader!css-loader!sass-loader!./Carousel.scss';

interface CarouselProps {
  open: boolean;
  images: CarouselImageInfo[];
  startingImage?: CarouselImageInfo;
  error?: string;
  onClose(): void;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
pdfjs.GlobalWorkerOptions.workerSrc = '../../../assets/pdf-worker/pdf.worker.min.js';

const ratio = 5;

const cnCarousel = cn('Carousel');

export interface CarouselImageInfo {
  file: FileInfo;
  title?: ReactNode;
  subTitle?: ReactNode;
}

type CarouselStore = {
  currentImage: CarouselImageInfo | undefined;
  expanded: boolean;
  zoomed: boolean;
  mainSwiper?: SwiperClass;
  thumbsSwiper?: SwiperClass;
  setCurrentImage(image: CarouselImageInfo): void;
  toggleExpanded(): void;
  setMainSwiper(swiper: SwiperClass): void;
  setThumbsSwiper(swiper: SwiperClass): void;
  setZoomed(zoomed: boolean): void;
};

export const Carousel: FC<CarouselProps> = observer(({ open, images, onClose, startingImage }) => {
  const {
    currentImage,
    setCurrentImage,
    expanded,
    toggleExpanded,
    thumbsSwiper,
    setThumbsSwiper,
    mainSwiper,
    setMainSwiper,
    zoomed,
    setZoomed
  } = useLocalObservable(
    (): CarouselStore => ({
      currentImage: startingImage || images[0],
      expanded: false,
      zoomed: false,
      mainSwiper: undefined,
      thumbsSwiper: undefined,
      setMainSwiper(this: CarouselStore, swiper: SwiperClass): void {
        this.mainSwiper = swiper;
      },
      setThumbsSwiper(this: CarouselStore, swiper: SwiperClass): void {
        this.thumbsSwiper = swiper;
      },
      setCurrentImage(this: CarouselStore, image: CarouselImageInfo | undefined): void {
        this.currentImage = image;
      },
      toggleExpanded(this: CarouselStore): void {
        this.expanded = !this.expanded;
      },
      setZoomed(this: CarouselStore, zoomed: boolean): void {
        this.zoomed = zoomed;
      }
    })
  );

  const handleZoomChange = useCallback(() => {
    setZoomed(!zoomed);
    if (zoomed) {
      mainSwiper?.zoom.in(ratio || 5);
    } else {
      mainSwiper?.zoom.out();
    }
  }, [setZoomed, zoomed, mainSwiper?.zoom]);

  const imagesWithUrls = images.map(image => ({ ...image, url: filesClient.getFileDownloadUrl(image.file.id) }));

  const maxWidth = (): false | Breakpoint => {
    if (!expanded) {
      return currentImage && isPdfFile(currentImage.file) ? 'xl' : 'md';
    }

    return false;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth()}
      className={cnCarousel()}
      fullWidth
      PaperProps={{ className: cnCarousel('Paper', { height: expanded && 'fullHeight' }) }}
    >
      {currentImage && <CarouselHeader title={currentImage.title} subTitle={currentImage.subTitle} />}
      {mainSwiper && !!currentImage && !isPdfFile(currentImage.file) && (
        <CarouselZoom zoomed={zoomed} onZoomChange={handleZoomChange} />
      )}
      <CarouselWrapper
        imagesWithUrls={imagesWithUrls}
        currentImage={currentImage}
        startingImage={startingImage}
        expanded={expanded}
        zoomed={zoomed}
        ratio={ratio}
        mainSwiper={mainSwiper}
        thumbsSwiper={thumbsSwiper}
        onImageChange={setCurrentImage}
        onExpand={toggleExpanded}
        onThumbsSwiperReady={setThumbsSwiper}
        onMainSwiperReady={setMainSwiper}
        onZoomed={setZoomed}
      />
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
});
