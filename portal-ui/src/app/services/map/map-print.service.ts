import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import domToImage from 'dom-to-image';
import { getPointResolution } from 'ol/proj';

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

export async function printMap(directly: boolean): Promise<Blob> {
  const { pageWidth, pageHeight, pageFormat, orientation, margin } = printSettings;

  const { default: jsPDF } = await import('jspdf');

  const pdf = new jsPDF(orientation, undefined, pageFormat.id);

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

export async function exportMap(directly = false): Promise<string> {
  const mapImage = await getMapImage({ hideScaleDigits: true });

  if (directly) {
    saveAsBlob('map.jpg', mapImage);
  }

  return mapImage;
}

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

export async function getMapImage(options: MapImageOptions = {}): Promise<string> {
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

  printSettings.setPrintingStatus(true, resolution);

  const { map, view, scaleLine } = mapService;
  const { width, height, legend, showSystemLayers } = printSettings;

  if (!map || !view || !scaleLine) {
    throw new Error('Map is not initialized');
  }

  const size = map.getSize();
  const viewResolution = view.getResolution();

  if (!showSystemLayers.draft) {
    mapService.hideSystemLayer('draft');
  }

  if (!showSystemLayers.measure) {
    mapService.hideSystemLayer('measure');
  }

  setPrintSize(resolution, translateX, translateY);

  return new Promise<string>(resolve => {
    map.once('rendercomplete', async () => {
      if (legend.auto) {
        await autoFilterLegend();
      }

      const mapCanvas = document.createElement('canvas');
      mapCanvas.width = width;
      mapCanvas.height = height;

      const mapContext = mapCanvas.getContext('2d');
      if (!mapContext) {
        throw new Error('Canvas context is not initialized');
      }
      mapContext.fillStyle = '#ffffff';
      mapContext.fillRect(0, 0, width, height);

      document.querySelectorAll('.ol-layer canvas').forEach((canvas: Element) => {
        if (!(canvas instanceof HTMLCanvasElement)) {
          throw new TypeError('Canvas is not canvas');
        }

        if (canvas.width > 0) {
          const parent = canvas.parentElement;
          if (!parent) {
            throw new Error('Impossible, but parent is not found');
          }
          const opacity = canvas.parentElement.style.opacity;
          mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);

          // Get the transform parameters from the style's transform matrix
          const matrixTransform = /^matrix\(([^(]*)\)$/.exec(canvas.style.transform);
          if (!matrixTransform) {
            throw new Error('Matrix transform is not found');
          }
          const matrix = matrixTransform[1].split(',').map(Number);

          // Apply the transform to the export map context
          CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix as unknown as [DOMMatrix2DInit]);
          mapContext.drawImage(canvas, 0, 0);
        }
      });

      const designationsResize = resolution / BASE_SCALE_LINE_DPI;

      CanvasRenderingContext2D.prototype.resetTransform.apply(mapContext);

      if (showSystemLayers.measure) {
        await drawMeasurementsTooltips(mapContext);
      }

      if (withDesignations) {
        await drawDesignations(mapContext, resolution, designationsResize, hideScaleDigits);
      }

      resolve(mapCanvas.toDataURL(mime));

      // Reset original map size
      mapService.showSystemLayer('draft');
      mapService.showSystemLayer('measure');
      scaleLine.setDpi();
      map.setSize(size);
      view.setResolution(viewResolution);

      printSettings.setPrintingStatus(false);
    });
  });
}

async function drawDesignations(
  mapContext: CanvasRenderingContext2D,
  resolution: number,
  designationsResize: number,
  hideScaleDigits: boolean
): Promise<void> {
  const { width, height, windRose, date, legend, border } = printSettings;
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

  await Promise.all(imagesPromises);

  if (border) {
    const lineWidth = Math.round((BORDER_WIDTH_MM * resolution) / 25.4);
    mapContext.lineWidth = lineWidth;
    mapContext.strokeStyle = 'f00000';
    mapContext.strokeRect(lineWidth / 2, lineWidth / 2, width - lineWidth, height - lineWidth);
  }
}

async function drawScaleLine(
  mapContext: CanvasRenderingContext2D,
  designationsResize: number,
  hideScaleDigits: boolean
): Promise<void> {
  const { height } = printSettings;

  return new Promise(resolve => {
    const scaleLineImg = new Image();
    scaleLineImg.src = getScaleLineImageSrc();
    scaleLineImg.addEventListener('load', () => {
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
    });
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
