import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import domToImage from 'dom-to-image';
import { Map } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { getPointResolution } from 'ol/proj';
import TileSource from 'ol/source/Tile';

import { Legend } from '../../components/Legend/Legend';
import { PrintMapDialogDate } from '../../components/PrintMapDialog/Date/PrintMapDialog-Date';
import { currentProject } from '../../stores/CurrentProject.store';
import { mapMeasureStore } from '../../stores/MapMeasure.store';
import { printSettings } from '../../stores/PrintSettings.store';
import { StyleRuleExtended } from '../geoserver/styles/styles.models';
import { filterLegendForCurrentMapView, getLayerStyleRules } from '../geoserver/styles/styles.service';
import { CrgLayerType, CrgVectorLayer } from '../gis/layers/layers.models';
import { saveAsBlob } from '../util/FileSaver';
import { notFalsyFilter } from '../util/NotFalsyFilter';
import { sleep } from '../util/sleep';
import { mapService } from './map.service';

const BASE_SCALE_LINE_DPI = 150;

export const BORDER_WIDTH_MM = 0.4;

export enum ImageMime {
  PNG = 'image/png',
  JPG = 'image/jpeg'
}

//  Функция печати карты в PDF
export async function printMap(directly: boolean): Promise<Blob> {
  const { pageWidth, pageHeight, pageFormat, orientation, margin } = printSettings;

  const { default: jsPDF } = await import('jspdf');

  // Создание нового PDF документа
  const pdf = new jsPDF(orientation, undefined, pageFormat.id);

  // Добавление изображения карты в PDF
  pdf.addImage(
    await getMapImage(),
    'JPEG',
    margin.left,
    margin.top,
    pageWidth - margin.left - margin.right,
    pageHeight - margin.top - margin.bottom
  );

  if (directly) {
    pdf.save('map.pdf');
  }

  return pdf.output('blob');
}

// Функция экспорта карты как изображения
export async function exportMap(directly = false): Promise<string> {
  // Получение изображения карты без цифр масштаба
  const mapImage = await getMapImage({ hideScaleDigits: true });

  if (directly) {
    saveAsBlob('map.jpg', mapImage);
  }

  return mapImage;
}

// Подготовка карты для копирования в буфер обмена
export async function prepareMapCopying(): Promise<HTMLDivElement> {
  const img = document.createElement('img');
  const div = document.createElement('div');
  img.src = await getMapImage({ hideScaleDigits: true });
  div.append(img);
  document.body.append(div);

  return new Promise<HTMLDivElement>(resolve => {
    img.addEventListener('load', () => {
      resolve(div);
    });
  });
}

interface MapImageOptions {
  resolution?: number;
  withDesignations?: boolean;
  translateX?: number;
  translateY?: number;
  mime?: ImageMime;
  hideScaleDigits?: boolean;
}

function waitForTilesLoad(map: Map): Promise<void> {
  return new Promise(resolve => {
    const layers = map.getLayers().getArray();
    let pendingTiles = 0;
    let resolved = false;

    const checkResolution = () => {
      if (pendingTiles === 0 && !resolved) {
        resolved = true;
        resolve();
      }
    };

    layers.forEach(layer => {
      const tileLayer = layer as unknown as TileLayer<TileSource>;

      if ('getSource' in tileLayer) {
        const source = tileLayer.getSource();

        if (source && 'on' in source) {
          source.on('tileloadstart', () => {
            pendingTiles++;
          });

          source.on('tileloadend', () => {
            pendingTiles--;
            checkResolution();
          });

          source.on('tileloaderror', () => {
            pendingTiles--;
            checkResolution();
          });
        }
      }
    });

    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    }, 1000); // 1 секунда ощущается при выборе куска для печати, но позволяет подгружать все ответы
  });
}

// Генерация изображения карты
export async function getMapImage(options: MapImageOptions = {}): Promise<string> {
  // Установка значений по умолчанию
  const {
    resolution,
    withDesignations,
    translateX,
    translateY,
    mime,
    hideScaleDigits = false
  } = {
    resolution: printSettings.resolution,
    withDesignations: true,
    translateX: 0,
    translateY: 0,
    mime: ImageMime.JPG,
    ...options
  };

  // Установка статуса печати
  printSettings.setPrintingStatus(true, resolution);

  const { map, view, scaleLine } = mapService;
  const { width, height, legend, showSystemLayers } = printSettings;

  // Проверка инициализации карты
  if (!map || !view || !scaleLine) {
    throw new Error('Карта не инициализирована');
  }

  const size = map.getSize();
  const viewResolution = view.getResolution();

  if (!showSystemLayers.draft) {
    mapService.hideSystemLayer('draft');
  }

  if (!showSystemLayers.measure) {
    mapService.hideSystemLayer('measure');
  }

  // Установка размера для печати
  setPrintSize(resolution, translateX, translateY);

  return new Promise<string>((resolve, reject) => {
    try {
      // Ожидание завершения рендеринга карты
      map.once('rendercomplete', async () => {
        try {
          await waitForTilesLoad(map);

          if (legend.auto) {
            await autoFilterLegend();
          }

          // Создание canvas для финального изображения
          const mapCanvas = document.createElement('canvas');
          mapCanvas.width = width;
          mapCanvas.height = height;

          const mapContext = mapCanvas.getContext('2d');
          if (!mapContext) {
            throw new Error('Canvas context is not initialized');
          }
          mapContext.fillStyle = '#ffffff';
          mapContext.fillRect(0, 0, width, height);

          // Рендер всех слоев карты на canvas
          document.querySelectorAll('.ol-layer canvas').forEach((canvas: Element) => {
            if (!(canvas instanceof HTMLCanvasElement)) {
              return;
            }

            if (canvas.width > 0) {
              const parent = canvas.parentElement;
              if (!parent) {
                return;
              }
              const opacity = parent.style.opacity;
              mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);

              const matrixTransform = /^matrix\(([^(]*)\)$/.exec(canvas.style.transform);
              if (matrixTransform) {
                const matrix = matrixTransform[1].split(',').map(Number);
                CanvasRenderingContext2D.prototype.setTransform.apply(
                  mapContext,
                  matrix as unknown as [DOMMatrix2DInit]
                );
                mapContext.drawImage(canvas, 0, 0);
              }
            }
          });

          // Коэффициент масштабирования для обозначений
          const designationsResize = resolution / BASE_SCALE_LINE_DPI;
          CanvasRenderingContext2D.prototype.resetTransform.apply(mapContext);

          // Отрисовка инструментов измерений
          if (showSystemLayers.measure) {
            await drawMeasurementsTooltips(mapContext);
          }

          // Отрисовка всех обозначений (масштаб, роза ветров и т.д.)
          if (withDesignations) {
            await drawDesignations(mapContext, resolution, designationsResize, hideScaleDigits);
          }

          const result = mapCanvas.toDataURL(mime);

          // Восстановление оригинальных настроек карты
          mapService.showSystemLayer('draft');
          mapService.showSystemLayer('measure');

          scaleLine.setDpi();
          map.setSize(size);
          view.setResolution(viewResolution);

          printSettings.setPrintingStatus(false);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      //  Запуск перерисовки
      map.render();
    } catch (error) {
      reject(error);
    }
  });
}

async function drawDesignations(
  mapContext: CanvasRenderingContext2D,
  resolution: number,
  designationsResize: number,
  hideScaleDigits: boolean
): Promise<void> {
  const { windRose, width, height, date, legend, border } = printSettings;
  const imagesPromises: Promise<void>[] = [];

  imagesPromises.push(drawScaleLine(mapContext, designationsResize, hideScaleDigits));

  if (windRose) {
    imagesPromises.push(drawWindRose(mapContext, designationsResize));
  }

  if (date) {
    imagesPromises.push(drawDate(mapContext, designationsResize));
  }

  if (legend.enabled && legend.items?.length) {
    imagesPromises.push(drawLegend(mapContext));
  }

  // ждем завершения ВСЕХ промисов
  await Promise.all(imagesPromises);

  if (border) {
    const lineWidth = Math.round((BORDER_WIDTH_MM * resolution) / 25.4);
    mapContext.lineWidth = lineWidth;
    mapContext.strokeStyle = '#f00000';
    mapContext.strokeRect(lineWidth / 2, lineWidth / 2, width - lineWidth, height - lineWidth);
  }
}

async function drawScaleLine(
  mapContext: CanvasRenderingContext2D,
  designationsResize: number,
  hideScaleDigits: boolean
): Promise<void> {
  const { height } = printSettings;

  return new Promise((resolve, reject) => {
    const scaleLineImg = new Image();
    scaleLineImg.addEventListener('load', () => {
      try {
        const offsetTop = hideScaleDigits ? 16 * designationsResize : 0;
        mapContext.drawImage(
          scaleLineImg,
          0,
          offsetTop,
          400 * designationsResize,
          50 * designationsResize,
          19 * designationsResize,
          height - 68 * designationsResize + offsetTop,
          400 * designationsResize,
          50 * designationsResize
        );
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    // таймаут для загрузки изображения
    setTimeout(() => {
      if (!scaleLineImg.complete) {
        reject(new Error('Scale line image loading timeout'));
      }
    }, 5000);

    scaleLineImg.src = getScaleLineImageSrc();
  });
}

export function getScaleLineImageSrc(resolution?: number): string {
  return `/assets/images/scale${printSettings.scale}x${resolution || printSettings.resolution}.png`;
}

async function drawWindRose(mapContext: CanvasRenderingContext2D, designationsResize: number): Promise<void> {
  const { rotation } = printSettings;

  return new Promise(resolve => {
    const roseImg = new Image();
    roseImg.src = getWindRoseImageSrc();
    roseImg.addEventListener('load', () => {
      const size = 150 * designationsResize;
      const roseCanvas = document.createElement('canvas');
      roseCanvas.width = size;
      roseCanvas.height = size;
      const roseContext = roseCanvas.getContext('2d');
      if (!roseContext) {
        throw new Error('Canvas context is not initialized');
      }
      roseContext.save();
      roseContext.translate(size / 2, size / 2);
      roseContext.rotate(rotation);
      roseContext.translate(-size / 2, -size / 2);
      roseContext.drawImage(roseImg, 0, 0, size, size, 0, 0, size, size);
      roseContext.restore();

      mapContext.drawImage(roseCanvas, 0, 0, size, size, 15 * designationsResize, 15 * designationsResize, size, size);

      resolve();
    });
  });
}

export function getWindRoseImageSrc(resolution?: number): string {
  return `/assets/images/rose${resolution || printSettings.resolution}.png`;
}

async function drawDate(mapContext: CanvasRenderingContext2D, designationsResize: number): Promise<void> {
  const { width, height } = printSettings;
  const dateImgSrc = await getDateImageSrc();

  return new Promise(resolve => {
    const dateImg = new Image();
    dateImg.src = dateImgSrc;
    dateImg.addEventListener('load', () => {
      mapContext.drawImage(
        dateImg,
        0,
        0,
        dateImg.width,
        dateImg.height,
        width / 2 - dateImg.width / 2,
        height - (dateImg.height + 15 * designationsResize),
        dateImg.width,
        dateImg.height
      );

      resolve();
    });
  });
}

async function getDateImageSrc(resolution?: number): Promise<string> {
  const el = document.createElement('div');
  document.body.append(el);
  const root = createRoot(el);
  const reactElement = createElement(PrintMapDialogDate, {
    forPrint: true,
    resolution: resolution || printSettings.resolution
  });
  root.render(reactElement);
  await sleep(200); // рендеринг react-компонента в dom-ноду
  const src = await domToImage.toPng(el.childNodes[0]);
  root.unmount();
  el.remove();

  return src;
}

async function drawMeasurementsTooltips(mapContext: CanvasRenderingContext2D): Promise<void> {
  for (const item of mapMeasureStore.measureItems) {
    const container = item.tooltipOverlay.getElement()?.parentElement;
    if (!container) {
      continue;
    }
    const translateFound = /(-?\d+(?:\.\d+)?)px, (-?\d+(?:\.\d+)?)px/.exec(container.style.transform);

    if (!translateFound) {
      return;
    }

    const [, translateX, translateY] = translateFound.map(Number);

    const src = await domToImage.toPng(item.tooltipNode.childNodes[0]);

    await new Promise<void>(resolve => {
      const img = new Image();
      img.src = src;
      img.addEventListener('load', () => {
        mapContext.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          translateX - img.width / 2,
          translateY - img.height + 6,
          img.width,
          img.height
        );
        resolve();
      });
    });
  }
}

async function drawLegend(mapContext: CanvasRenderingContext2D): Promise<void> {
  const { width, height } = printSettings;
  const legendImgSrc = await getLegendImageSrc();

  return new Promise(resolve => {
    const legendImg = new Image();
    legendImg.src = legendImgSrc;
    legendImg.addEventListener('load', () => {
      mapContext.drawImage(
        legendImg,
        0,
        0,
        legendImg.width,
        legendImg.height,
        width - legendImg.width,
        height - legendImg.height,
        legendImg.width,
        legendImg.height
      );

      resolve();
    });
  });
}

async function getLegendImageSrc(resolution?: number): Promise<string> {
  const el = document.createElement('div');
  document.body.append(el);
  const root = createRoot(el);
  const reactElement = createElement(Legend, {
    rules: printSettings.legend.items,
    forPrint: true,
    resolution: resolution || printSettings.resolution,
    resize: printSettings.legendSize * 1.3,
    cleanDuplicates: true
  });
  root.render(reactElement);
  //других способов дождаться кончания render не нашлось
  await sleep(200);
  const src = await domToImage.toPng(el.childNodes[0]);
  root.unmount();
  el.remove();

  return src;
}

let lastFilteredLegendRequestId: symbol;

async function autoFilterLegend() {
  const filteredLegendRequestId = Symbol();
  lastFilteredLegendRequestId = filteredLegendRequestId;

  try {
    const filteredLegendResponse = await filterLegendForCurrentMapView(printSettings.layers);

    // если за время обращения к api случился следующий запрос
    if (lastFilteredLegendRequestId !== filteredLegendRequestId) {
      return;
    }
    printSettings.setLegendItems(
      filteredLegendResponse
        .flatMap(({ dataset, identifier, rules: rulesNames }) =>
          rulesNames.map(ruleName => {
            const layer = printSettings.layers.find(
              l => l.type === CrgLayerType.VECTOR && l.tableName === identifier && l.dataset === dataset
            );

            if (!layer) {
              return;
            }

            return printSettings.allLegend.find(
              legendRule => legendRule.layerId === layer.id && legendRule.name === ruleName
            );
          })
        )
        .filter(notFalsyFilter)
    );
  } catch {
    printSettings.setLegendItems(printSettings.allLegend);
  }
}

function setPrintSize(resolution: number, translateX: number, translateY: number) {
  const { map, view, scaleLine } = mapService;
  const { width, height, scale } = printSettings;

  if (!map || !view || !scaleLine) {
    throw new Error('Map is not initialized');
  }

  const center = view.getCenter();

  if (!center) {
    throw new Error('Map center is not initialized');
  }

  const scaleResolution = scale / 1000 / getPointResolution(view.getProjection(), resolution / 25.4, center);

  scaleLine.setDpi(resolution);
  map.setSize([width, height]);
  view.setResolution(scaleResolution);

  if (translateX || translateY) {
    view.centerOn(center, [width, height], [width / 2 + width * translateX, height / 2 + height * translateY]);
  }
}

export async function loadAllLayersStyles(): Promise<void> {
  const extendedRules = await Promise.all(
    currentProject.visibleVectorLayers.map(async ({ payload }): Promise<StyleRuleExtended[]> => {
      const rules = await getLayerStyleRules(payload as CrgVectorLayer);

      return rules.map((rule): StyleRuleExtended => ({ ...rule, layerId: payload.id, layerTitle: payload.title }));
    })
  );

  printSettings.setAllLegend(extendedRules.flat());
}
