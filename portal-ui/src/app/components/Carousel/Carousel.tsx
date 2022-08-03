import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, makeObservable } from 'mobx';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { Breakpoint, Dialog, DialogActions, DialogContent, Tooltip } from '@mui/material';
import { ChevronLeft, ChevronRight, OpenInFull, CloseFullscreen } from '@mui/icons-material';
import { Document, Page, pdfjs } from 'react-pdf';

import { getFileDownloadUrl } from '../../services/server-urls.service';
import { FileInfo } from '../../services/data/files.service';
import { isPdfFile } from '../../services/data/files.util';
import { IconButton } from '../IconButton/IconButton';
import { Loading } from '../Loading/Loading';
import { Button } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./Carousel.scss';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
pdfjs.GlobalWorkerOptions.workerSrc = '../../../assets/pdf-worker/pdf.worker.min.js';

const cnCarousel = cn('Carousel');

interface CarouselProps {
  open: boolean;
  onClose: () => void;
  allImages?: FileInfo[];
  startingImageForPreview?: FileInfo;
}

@observer
export class Carousel extends Component<CarouselProps> {
  @observable private url: string;
  @observable private currentImage: FileInfo;
  @observable private busy = true;
  @observable private pages: undefined[];
  @observable private expandHandler = false;

  constructor(props: CarouselProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    this.setCurrentImage(this.props.startingImageForPreview);
    await this.fileUrl(this.props.startingImageForPreview?.id);
  }

  render() {
    const { onClose, allImages } = this.props;

    return (
      <>
        <Dialog open={this.props.open} onClose={onClose} maxWidth={this.maxWidth} fullWidth className={cnCarousel()}>
          <DialogContent className={cnCarousel('Slide', { height: this.expandHandler && 'fullHeight' }, ['scroll'])}>
            {this.currentImage && isPdfFile(this.currentImage) ? (
              <Document
                className={cnCarousel('Document')}
                error={console.error}
                file={this.url}
                loading='Загрузка pdf'
                onLoadSuccess={this.onDocumentLoad}
              >
                {this.pages?.map((_, index) => (
                  <Page key={index} pageNumber={index + 1} />
                ))}
              </Document>
            ) : (
              <>
                <img
                  className={cnCarousel('Image')}
                  src={this.url}
                  alt={this.currentImage?.title}
                  onLoad={this.onLoad}
                />
                <Loading visible={this.busy} />
              </>
            )}
            {this.currentImage && isPdfFile(this.currentImage) && (
              <Tooltip title={this.expandHandler ? 'Свернуть' : 'Развернуть'}>
                <IconButton className={cnCarousel('OpenInFull')} onClick={this.setExpandHandler}>
                  {this.expandHandler ? <CloseFullscreen /> : <OpenInFull />}
                </IconButton>
              </Tooltip>
            )}
          </DialogContent>
          <DialogActions>
            {allImages.length !== 1 && (
              <>
                <IconButton className={cnCarousel('Right')} edge='end' onClick={this.nextHandler}>
                  <ChevronRight fontSize='large' />
                </IconButton>
                <IconButton className={cnCarousel('Left')} edge='end' onClick={this.prevHandler}>
                  <ChevronLeft fontSize='large' />
                </IconButton>
              </>
            )}

            <Button onClick={onClose}>Закрыть</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  private async fileUrl(id: string) {
    this.setUrl(await getFileDownloadUrl(id));
  }

  @boundMethod
  private onDocumentLoad({ numPages }) {
    this.setPages([...(Array(numPages) as undefined[])]);
    this.setBusy(false);
  }

  @boundMethod
  private onLoad() {
    this.setBusy(false);
  }

  @boundMethod
  private async prevHandler() {
    this.setBusy(true);
    const { allImages: images } = this.props;
    let prevImageIndex: number;

    images.forEach((img, i) => {
      if (img.id === this.currentImage.id) {
        prevImageIndex = i === 0 ? images.length - 1 : i - 1;
      }
    });
    const currentImage = images[prevImageIndex];

    this.setCurrentImage(currentImage);
    await this.fileUrl(currentImage.id);
  }

  @boundMethod
  private async nextHandler() {
    this.setBusy(true);
    const { allImages: images } = this.props;
    let nextImageIndex: number;

    images.forEach((img, i) => {
      if (img.id === this.currentImage.id) {
        nextImageIndex = i === images.length - 1 ? 0 : i + 1;
      }
    });

    const currentImage = images[nextImageIndex];

    this.setCurrentImage(currentImage);
    await this.fileUrl(currentImage.id);
  }

  @action
  private setUrl(url: string) {
    this.url = url;
  }

  @action
  private setCurrentImage(currentImage: FileInfo) {
    this.currentImage = currentImage;
  }

  @action
  private setBusy(busy: boolean) {
    this.busy = busy;
  }

  @action
  private setPages(pages: undefined[]) {
    this.pages = pages;
  }

  @action.bound
  private setExpandHandler() {
    this.expandHandler = !this.expandHandler;
  }

  private get maxWidth(): false | Breakpoint {
    if (!this.expandHandler) {
      return this.currentImage && isPdfFile(this.currentImage) ? 'xl' : 'md';
    }

    return false;
  }
}
