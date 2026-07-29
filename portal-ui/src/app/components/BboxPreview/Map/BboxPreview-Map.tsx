import React, { useCallback, useEffect, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
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
import { waitForTilesLoad } from '../BboxPreview.util';
import { BboxPreviewError } from '../Error/BboxPreview-Error';
import { BboxPreviewImage } from '../Image/BboxPreview-Image';
import { BboxPreviewLoading } from '../Loading/BboxPreview-Loading';
import { BboxPreviewMapContainer } from '../MapContainer/BboxPreview-MapContainer';

import './BboxPreview-Map.scss';

const cnBboxPreview = cn('BboxPreview');

export interface BboxPreviewMapProps {
  bboxString: string;
}

type BboxPreviewMapState = {
  previewImage: string | null;
  loading: boolean;
  previewFailed: boolean;
  reset(): void;
  startGeneration(): void;
  setLoading(loading: boolean): void;
  failPreview(): void;
  completeCapture(image: string): void;
};

export const BboxPreviewMap = observer(function BboxPreviewMap({ bboxString }: BboxPreviewMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const loadingTimeoutRef = useRef<number | null>(null);
  const imageCapturedRef = useRef(false);

  const state = useLocalObservable<BboxPreviewMapState>(() => ({
    previewImage: null,
    loading: false,
    previewFailed: false,

    reset() {
      this.previewImage = null;
      this.loading = false;
      this.previewFailed = false;
    },

    startGeneration() {
      this.loading = true;
      this.previewImage = null;
    },

    setLoading(loading) {
      this.loading = loading;
    },

    failPreview() {
      this.previewFailed = true;
      this.loading = false;
    },

    completeCapture(image) {
      this.previewImage = image;
      this.loading = false;
    }
  }));

  const getBbox = useCallback((): Extent | undefined => {
    if (!bboxString) {
      return undefined;
    }

    try {
      return JSON.parse(bboxString) as Extent;
    } catch {
      return undefined;
    }
  }, [bboxString]);

  const cleanup = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setTarget();
      mapInstanceRef.current = null;
    }

    if (loadingTimeoutRef.current !== null) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    imageCapturedRef.current = false;
    state.reset();
  }, [state]);

  const captureMapImage = useCallback(
    (map: Map) => {
      if (!map || imageCapturedRef.current || state.previewFailed) {
        if (!state.previewFailed) {
          state.setLoading(false);
        }

        return;
      }

      try {
        const targetWidth = 600;
        const targetHeight = 450;
        const containerSize = map.getSize();

        if (!containerSize) {
          state.setLoading(false);

          return;
        }

        const mapCanvas = document.createElement('canvas');
        mapCanvas.width = targetWidth;
        mapCanvas.height = targetHeight;

        const mapContext = mapCanvas.getContext('2d');
        if (!mapContext) {
          state.setLoading(false);

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
          state.failPreview();
          imageCapturedRef.current = true;

          return;
        }

        CanvasRenderingContext2D.prototype.resetTransform.apply(mapContext);

        state.completeCapture(mapCanvas.toDataURL('image/png', 1));
        imageCapturedRef.current = true;
      } catch (error) {
        services.logger.error('BboxPreview: Ошибка при захвате изображения', error);
        state.failPreview();
      }
    },
    [state]
  );

  const runBboxPreviewCapturePipeline = useCallback(
    async (map: Map, isMapFailed: () => boolean): Promise<void> => {
      if (imageCapturedRef.current || state.previewFailed || isMapFailed()) {
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

        await new Promise<void>(resolve => setTimeout(resolve, 100));

        if (!imageCapturedRef.current && !state.previewFailed && !isMapFailed()) {
          captureMapImage(map);
        }
      } catch (error) {
        services.logger.error('BboxPreview: Ошибка при ожидании загрузки тайлов', error);
        if (!imageCapturedRef.current && !state.previewFailed && !isMapFailed()) {
          captureMapImage(map);
        }
      }
    },
    [captureMapImage, state]
  );

  const generatePreview = useCallback(async () => {
    const bbox = getBbox();
    if (!bbox) {
      return;
    }

    if (!mapContainerRef.current) {
      return;
    }

    try {
      state.startGeneration();
      imageCapturedRef.current = false;

      await getOlProjection();

      const projection = getProjection(defaultOlProjectionCode);
      if (!projection) {
        services.logger.error('BboxPreview: Проекция не найдена');
        state.failPreview();

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
          state.failPreview();
          cleanup();
        }
      };

      osmSource.on('tileloaderror', handleTileLoadError);

      const container = mapContainerRef.current;
      const map = new Map({
        target: container,
        view,
        layers: [tileLayer]
      });

      mapInstanceRef.current = map;

      const handleLoadingTimeout = () => {
        if (!imageCapturedRef.current && !mapFailed) {
          if (failedTilesCount >= maxFailedTiles) {
            mapFailed = true;
            state.failPreview();
          } else {
            captureMapImage(map);
          }
        }
      };

      const initializeMap = () => {
        if (!map || !container) {
          state.failPreview();

          return;
        }

        map.updateSize();
        view.fit(bbox, { padding: [10, 10, 10, 10] });

        void runBboxPreviewCapturePipeline(map, () => mapFailed);

        loadingTimeoutRef.current = window.setTimeout(handleLoadingTimeout, 5000);
      };

      setTimeout(initializeMap, 100);
    } catch (error) {
      services.logger.error('BboxPreview: Ошибка при генерации превью', error);
      state.failPreview();
    }
  }, [captureMapImage, cleanup, getBbox, runBboxPreviewCapturePipeline, state]);

  useEffect(() => {
    void generatePreview();

    return () => {
      cleanup();
    };
  }, [cleanup, generatePreview]);

  const bbox = getBbox();
  if (!bbox) {
    return null;
  }

  const isLoading = state.loading && !state.previewFailed;
  const shouldShowError = !state.loading && !state.previewFailed && !state.previewImage;

  return (
    <div className={cnBboxPreview('Map')}>
      {isLoading && <BboxPreviewLoading />}
      {state.previewFailed && <BboxPreviewError />}
      {!!state.previewImage && !state.previewFailed && !state.loading && <BboxPreviewImage src={state.previewImage} />}
      {shouldShowError && <BboxPreviewError />}
      <BboxPreviewMapContainer ref={mapContainerRef} />
    </div>
  );
});
