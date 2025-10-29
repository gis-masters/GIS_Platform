import React, { type FC, useCallback } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Document, Page } from 'react-pdf';

import { type ImagesForCarouselWrapper } from '../Wrapper/Carousel-Wrapper';

import './Carousel-Document.scss';

interface CarouselDocumentProps {
  imageWithUrl: ImagesForCarouselWrapper;
  onLoad(): void;
}

interface CarouselDocumentStore {
  pages: unknown[];
  setPages(pages: unknown[]): void;
}

const cnCarousel = cn('Carousel');

export const CarouselDocument: FC<CarouselDocumentProps> = observer(({ imageWithUrl, onLoad }) => {
  const store = useLocalObservable(
    (): CarouselDocumentStore => ({
      pages: [],
      setPages(this: CarouselDocumentStore, pages: unknown[]) {
        this.pages = pages;
      }
    })
  );

  const { pages, setPages } = store;

  const onDocumentLoad = useCallback(
    ({ numPages }: { numPages: number }) => {
      setPages([...(Array(numPages) as unknown[])]);
      onLoad();
    },
    [onLoad, setPages]
  );

  const renderPage = useCallback((_: unknown, index: number) => {
    return <Page key={index} pageNumber={index + 1} width={1000} />;
  }, []);

  return (
    <Document
      file={imageWithUrl.url}
      className={cnCarousel('Document', ['scroll'])}
      loading='Загрузка pdf'
      onLoadSuccess={onDocumentLoad}
      onLoadError={onLoad}
    >
      {pages?.map(renderPage)}
    </Document>
  );
});
