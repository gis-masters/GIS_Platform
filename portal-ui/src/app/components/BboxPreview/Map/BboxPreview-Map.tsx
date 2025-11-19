import React, { Component, type RefObject } from 'react';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Map, View } from 'ol';
import { type Extent } from 'ol/extent';
import { Tile as TileLayer } from 'ol/layer';
import { get as getProjection } from 'ol/proj';
import { OSM } from 'ol/source';
import 'ol/ol.css';

import { defaultOlProjectionCode } from '../../../services/data/projections/projections.models';
import { getOlProjection } from '../../../services/data/projections/projections.service';
import { services } from '../../../services/services';
import { RingSpinner } from '../../RingSpinner/RingSpinner';
import { waitForTilesLoad } from '../BboxPreview.util';
import { BboxPreviewError } from '../Error/BboxPreview-Error';

import './BboxPreview-Map.scss';

const cnBboxPreview = cn('BboxPreview');

export interface BboxPreviewMapProps {
  bboxString: string;
}

@observer
export class BboxPreviewMap extends Component<BboxPreviewMapProps> {
  private mapContainerRef: RefObject<HTMLDivElement> = React.createRef();
  private mapInstanceRef: Map | null = null;
  private loadingTimeoutRef: number | null = null;
  private imageCaptured = false;
  @observable private previewImage: string | null = null;
  @observable private loading = false;
  @observable private previewFailed = false;

  constructor(props: BboxPreviewMapProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    void this.generatePreview();
  }

  componentDidUpdate(prevProps: BboxPreviewMapProps) {
    if (prevProps.bboxString !== this.props.bboxString) {
      this.cleanup();
      void this.generatePreview();
    }
  }

  componentWillUnmount() {
    this.cleanup();
  }

  render() {
    const bbox = this.getBbox();
    if (!bbox) {
      return null;
    }

    return (
      <div className={cnBboxPreview('Map')}>
        {this.isLoading && (
          <div className={cnBboxPreview('Loading')}>
            <RingSpinner text='Загрузка превью' />
          </div>
        )}

        {this.previewFailed && <BboxPreviewError />}

        {this.shouldShowImage && <img src={this.previewImage!} alt='BBOX preview' className={cnBboxPreview('Image')} />}

        {this.shouldShowError && <BboxPreviewError />}

        <div ref={this.mapContainerRef} className={cnBboxPreview('MapContainer')} />
      </div>
    );
  }

  private get isLoading(): boolean {
    return this.loading && !this.previewFailed;
  }

  private get shouldShowImage(): boolean {
    return !!this.previewImage && !this.previewFailed && !this.loading;
  }

  private get shouldShowError(): boolean {
    return !this.loading && !this.previewFailed && !this.previewImage;
  }

  private getBbox(): Extent | undefined {
    const { bboxString } = this.props;

    if (!bboxString) {
      return undefined;
    }

    try {
      return JSON.parse(bboxString) as Extent;
    } catch {
      return undefined;
    }
  }

  @action.bound
  private async generatePreview() {
    const bbox = this.getBbox();
    if (!bbox) {
      return;
    }

    if (!this.mapContainerRef.current) {
      return;
    }

    try {
      this.loading = true;
      this.imageCaptured = false;
      this.previewImage = null;

      await getOlProjection();

      const projection = getProjection(defaultOlProjectionCode);
      if (!projection) {
        services.logger.error('BboxPreview: Проекция не найдена');
        runInAction(() => {
          this.previewFailed = true;
          this.loading = false;
        });

        return;
      }

      const view = new View({
        projection,
        center: [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2],
        minZoom: 3,
        maxZoom: 25
      });

      const osmSource = new OSM();
      const tileLayer = new TileLayer({
        source: osmSource
      });

      let failedTilesCount = 0;
      const maxFailedTiles = 1;
      let mapFailed = false;

      const handleTileLoadError = () => {
        failedTilesCount++;
        services.logger.warn(`BboxPreview: Ошибка загрузки тайла. Всего ошибок: ${failedTilesCount}`);
        if (failedTilesCount >= maxFailedTiles && !mapFailed) {
          mapFailed = true;
          services.logger.warn('BboxPreview: Карта недоступна, показываем сообщение об ошибке');
          runInAction(() => {
            this.previewFailed = true;
            this.loading = false;
          });
          this.cleanup();
        }
      };

      osmSource.on('tileloaderror', handleTileLoadError);

      const container = this.mapContainerRef.current;
      const map = new Map({
        target: container,
        view,
        layers: [tileLayer]
      });

      this.mapInstanceRef = map;

      setTimeout(() => {
        if (!map || !container) {
          runInAction(() => {
            this.previewFailed = true;
            this.loading = false;
          });

          return;
        }

        map.updateSize();
        view.fit(bbox, { padding: [10, 10, 10, 10] });

        const captureImage = async () => {
          if (this.imageCaptured || this.previewFailed || mapFailed) {
            return;
          }

          try {
            await new Promise<void>(resolve => {
              map.once('rendercomplete', () => {
                resolve();
              });
              map.render();
            });

            await waitForTilesLoad(map);

            await new Promise(resolve => setTimeout(resolve, 100));

            if (!this.imageCaptured && !this.previewFailed && !mapFailed) {
              this.captureMapImage(map);
            }
          } catch (error) {
            services.logger.error('BboxPreview: Ошибка при ожидании загрузки тайлов', error);
            if (!this.imageCaptured && !this.previewFailed && !mapFailed) {
              this.captureMapImage(map);
            }
          }
        };

        void captureImage();

        this.loadingTimeoutRef = window.setTimeout(() => {
          if (!this.imageCaptured && !mapFailed) {
            if (failedTilesCount >= maxFailedTiles) {
              mapFailed = true;
              runInAction(() => {
                this.previewFailed = true;
                this.loading = false;
              });
            } else {
              this.captureMapImage(map);
            }
          }
        }, 5000);
      }, 100);
    } catch (error) {
      services.logger.error('BboxPreview: Ошибка при генерации превью', error);
      runInAction(() => {
        this.previewFailed = true;
        this.loading = false;
      });
    }
  }

  @action.bound
  private captureMapImage(map: Map) {
    if (!map || this.imageCaptured || this.previewFailed) {
      if (!this.previewFailed) {
        this.loading = false;
      }

      return;
    }

    try {
      const targetWidth = 600;
      const targetHeight = 450;
      const containerSize = map.getSize();

      if (!containerSize) {
        this.loading = false;

        return;
      }

      const mapCanvas = document.createElement('canvas');
      mapCanvas.width = targetWidth;
      mapCanvas.height = targetHeight;

      const mapContext = mapCanvas.getContext('2d');
      if (!mapContext) {
        this.loading = false;

        return;
      }

      mapContext.fillStyle = '#ffffff';
      mapContext.fillRect(0, 0, targetWidth, targetHeight);

      const scaleX = targetWidth / containerSize[0];
      const scaleY = targetHeight / containerSize[1];

      const viewport = map.getViewport();
      const layerCanvases = viewport.querySelectorAll('.ol-layer canvas');

      let hasValidCanvas = false;

      layerCanvases.forEach((canvas: Element) => {
        if (!(canvas instanceof HTMLCanvasElement)) {
          return;
        }

        if (canvas.width > 0) {
          hasValidCanvas = true;
          const parent = canvas.parentElement;
          if (!parent) {
            return;
          }

          const opacity = parent.style.opacity;
          mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);

          const matrixTransform = /^matrix\(([^(]*)\)$/.exec(canvas.style.transform);
          if (matrixTransform) {
            const matrix = matrixTransform[1].split(',').map(Number);
            const scaledMatrix = [
              matrix[0] * scaleX,
              matrix[1] * scaleY,
              matrix[2] * scaleX,
              matrix[3] * scaleY,
              matrix[4] * scaleX,
              matrix[5] * scaleY
            ];
            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              scaledMatrix as unknown as [DOMMatrix2DInit]
            );
            mapContext.drawImage(canvas, 0, 0);
          }
        }
      });

      if (!hasValidCanvas) {
        runInAction(() => {
          this.previewFailed = true;
          this.loading = false;
        });
        this.imageCaptured = true;

        return;
      }

      CanvasRenderingContext2D.prototype.resetTransform.apply(mapContext);

      this.previewImage = mapCanvas.toDataURL('image/png', 1);
      this.imageCaptured = true;
    } catch (error) {
      services.logger.error('BboxPreview: Ошибка при захвате изображения', error);
      runInAction(() => {
        this.previewFailed = true;
        this.loading = false;
      });
    } finally {
      if (!this.previewFailed) {
        runInAction(() => {
          this.loading = false;
        });
      }
    }
  }

  @action.bound
  private cleanup() {
    if (this.mapInstanceRef) {
      this.mapInstanceRef.setTarget(undefined);
      this.mapInstanceRef = null;
    }

    if (this.loadingTimeoutRef !== null) {
      clearTimeout(this.loadingTimeoutRef);
      this.loadingTimeoutRef = null;
    }

    this.imageCaptured = false;
    this.previewImage = null;
    this.loading = false;
    this.previewFailed = false;
  }
}
