/* eslint-disable react/jsx-no-bind -- эксперимент для сложных функциональных компонентов */
import React, { FC, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { cn } from '@bem-react/classname';
import { action, observable } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import { Breakpoint, Dialog, DialogActions, DialogContent, IconButton, Tooltip } from '@mui/material';
import { CloseFullscreen, OpenInFull, PictureAsPdfOutlined } from '@mui/icons-material';
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import { FreeMode, Navigation, Pagination, Thumbs } from 'swiper/modules';
import '!style-loader!css-loader!swiper/css';
import '!style-loader!css-loader!swiper/css/pagination';
import '!style-loader!css-loader!swiper/css/navigation';
import '!style-loader!css-loader!swiper/css/thumbs';

import { filesClient } from '../../services/data/files/files.client';
import { FileInfo } from '../../services/data/files/files.models';
import { getFileBaseName, isPdfFile } from '../../services/data/files/files.util';

import { Loading } from '../Loading/Loading';
import { Button } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./Carousel.scss';

type CarouselProps = {
  open: boolean;
  images?: FileInfo[];
  startingImageForPreview?: FileInfo;
  onClose(): void;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
pdfjs.GlobalWorkerOptions.workerSrc = '../../../assets/pdf-worker/pdf.worker.min.js';

const cnCarousel = cn('Carousel');

type CarouselStore = {
  currentImage: FileInfo | undefined;
  busy: boolean;
  pages: unknown[];
  expanded: boolean;
  setCurrentImage(image: FileInfo): void;
  setBusy(arg: boolean): void;
  setPages(pages: unknown[]): void;
  setExpanded(expanded: boolean): void;
};

export const Carousel: FC<CarouselProps> = observer(({ open, images, onClose, startingImageForPreview }) => {
  // @TODO: Update Typescript/Dependencies #1284
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass>();

  const store = useLocalObservable(
    (): CarouselStore => ({
      currentImage: startingImageForPreview || undefined,
      busy: true,
      pages: [],
      expanded: false,
      setCurrentImage(this: CarouselStore, image: FileInfo | undefined): void {
        this.currentImage = image;
      },
      setBusy(this: CarouselStore, busy: boolean): void {
        this.busy = busy;
      },
      setPages(this: CarouselStore, pages: unknown[]): void {
        this.pages = pages;
      },
      setExpanded(this: CarouselStore, expanded: boolean): void {
        this.expanded = expanded;
      }
    }),
    {
      currentImage: observable,
      busy: observable,
      pages: observable,
      expanded: observable,
      setCurrentImage: action.bound,
      setBusy: action.bound,
      setPages: action.bound,
      setExpanded: action.bound
    }
  );

  const { currentImage, setCurrentImage, busy, setBusy, pages, setPages, expanded, setExpanded } = store;

  const imagesWithUrls = images?.map(image => {
    return { ...image, url: filesClient.getFileDownloadUrl(image.id) };
  });

  const maxWidth = (): false | Breakpoint => {
    if (!expanded) {
      return currentImage && isPdfFile(currentImage) ? 'xl' : 'md';
    }

    return false;
  };

  const onDocumentLoad = ({ numPages }) => {
    setPages([...(Array(numPages) as unknown[])]);
    setBusy(false);
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
      {currentImage && <div className={cnCarousel('Title')}>{getFileBaseName(currentImage.title)}</div>}
      <DialogContent className={cnCarousel('Wrapper')}>
        {!currentImage && !busy && 'Файлы отсутствуют'}
        {currentImage && (
          <Swiper
            className={cnCarousel('MainSwiper', { type: isPdfFile(currentImage) && 'document' })}
            onSlideChange={(swiper: SwiperClass) => {
              /* eslint-disable @typescript-eslint/no-unsafe-member-access */
              /* eslint-disable @typescript-eslint/no-unsafe-assignment */
              // @TODO: Update Typescript/Dependencies #1284
              const activeIndex: number = swiper.activeIndex;
              if (images) {
                setCurrentImage(images[activeIndex]);
              }
            }}
            pagination={{
              type: 'fraction'
            }}
            navigation
            thumbs={{ swiper: thumbsSwiper }}
            modules={[Pagination, FreeMode, Navigation, Thumbs]}
          >
            {imagesWithUrls?.map(imageWithUrl => (
              <SwiperSlide key={imageWithUrl.id}>
                {isPdfFile(currentImage) ? (
                  <Document
                    className={cnCarousel('Document')}
                    file={imageWithUrl.url}
                    loading='Загрузка pdf'
                    onLoadSuccess={onDocumentLoad}
                  >
                    {pages?.map((_, index) => <Page key={index} pageNumber={index + 1} />)}
                  </Document>
                ) : (
                  <img
                    onLoad={() => {
                      setBusy(false);
                    }}
                    onError={() => {
                      setBusy(false);
                    }}
                    className={cnCarousel('MainImage')}
                    src={imageWithUrl.url}
                    alt={imageWithUrl.title}
                    loading='lazy'
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        {images && images.length > 1 && (
          <Swiper
            className={cnCarousel('AdditionSwiper')}
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            freeMode
            watchSlidesProgress
            modules={[FreeMode, Navigation, Thumbs]}
          >
            {imagesWithUrls &&
              imagesWithUrls.map(el => (
                <SwiperSlide key={el.id}>
                  {currentImage && isPdfFile(currentImage) ? (
                    <PictureAsPdfOutlined />
                  ) : (
                    <img className={cnCarousel('AdditionImage')} src={el.url} alt={el.title} loading='lazy' />
                  )}
                </SwiperSlide>
              ))}
          </Swiper>
        )}
        {currentImage && isPdfFile(currentImage) && (
          <Tooltip title={expanded ? 'Свернуть' : 'Развернуть'}>
            <IconButton
              className={cnCarousel('OpenInFull')}
              onClick={() => {
                setExpanded(!expanded);
              }}
            >
              {expanded ? <CloseFullscreen /> : <OpenInFull />}
            </IconButton>
          </Tooltip>
        )}
        <Loading visible={busy} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
});
