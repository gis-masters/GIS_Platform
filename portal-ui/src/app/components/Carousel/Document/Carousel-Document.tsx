import React, { FC } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Document, Page } from 'react-pdf';

import { ImagesForCarouselWrapper } from '../Wrapper/Carousel-Wrapper';

import '!style-loader!css-loader!sass-loader!./Carousel-Document.scss';

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

  const onDocumentLoad = ({ numPages }: { numPages: number }) => {
    setPages([...(Array(numPages) as unknown[])]);
    onLoad();
  };

  return (
    <Document
      file={imageWithUrl.url}
      className={cnCarousel('Document', ['scroll'])}
      loading='Загрузка pdf'
      onLoadSuccess={onDocumentLoad}
      onLoadError={onLoad}
    >
      {pages?.map((_, index) => <Page key={index} pageNumber={index + 1} width={1000} />)}
    </Document>
  );
});
