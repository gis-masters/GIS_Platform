import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import domToImage from 'dom-to-image';
import jsPDF from 'jspdf';
import moment from 'moment';
import { getPointResolution } from 'ol/proj';
import { saveAs } from 'file-saver';

import { printSettings } from '../../stores/PrintSettings.store';
import { mapService } from './map.service';
import { PrintDialogDate } from '../../components/PrintDialog/Date/PrintDialog-Date';
import { mapStore } from '../../stores/Map.store';

const BASE_SCALE_LINE_DPI = 150;

export const BORDER_WIDTH_MM = 0.4;

export enum ImageMime {
  PNG = 'image/png',
  JPG = 'image/jpeg'
}

export async function printMap(): Promise<void> {
  const { pageWidth, pageHeight, pageFormat, orientation, margin } = printSettings;

  const pdf = new jsPDF(orientation, undefined, pageFormat.id);

  pdf.addImage(
    await getMapImage(),
    'JPEG',
    margin.left,
    margin.top,
    pageWidth - margin.left - margin.right,
    pageHeight - margin.top - margin.bottom
  );
  pdf.save('map.pdf');
}

export async function exportMap(): Promise<void> {
  saveAs(await getMapImage({ hideScaleDigits: true }), 'map.jpg');
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
  const { resolution, withDesignations, translateX, translateY, mime, hideScaleDigits } = {
    resolution: printSettings.resolution,
    withDesignations: true,
    translateX: 0,
    translateY: 0,
    mime: ImageMime.JPG,
    ...options
  };

  printSettings.setPrintingStatus(true, resolution);

  const { map, view, scaleLine } = mapService;
  const { width, height, scale, windRose, date, border } = printSettings;

  const size = map.getSize();
  const viewResolution = view.getResolution();
  const scaleResolution = scale / 1000 / getPointResolution(view.getProjection(), resolution / 25.4, view.getCenter());

  // Set print size
  scaleLine.setDpi(resolution);
  map.setSize([width, height]);
  view.setResolution(scaleResolution);

  if (translateX || translateY) {
    view.centerOn(
      view.getCenter(),
      [width, height],
      [width / 2 + width * translateX, height / 2 + height * translateY]
    );
  }

  return new Promise<string>(resolve => {
    map.once('rendercomplete', async () => {
      const mapCanvas = document.createElement('canvas');
      mapCanvas.width = width;
      mapCanvas.height = height;
      const mapContext = mapCanvas.getContext('2d');
      mapContext.fillStyle = '#ffffff';
      mapContext.fillRect(0, 0, width, height);

      document.querySelectorAll('.ol-layer canvas').forEach((canvas: HTMLCanvasElement) => {
        if (canvas.width > 0) {
          const opacity = canvas.parentElement.style.opacity;
          mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);

          // Get the transform parameters from the style's transform matrix
          const matrix = /^matrix\(([^(]*)\)$/.exec(canvas.style.transform)[1].split(',').map(Number);

          // Apply the transform to the export map context
          CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
          mapContext.drawImage(canvas, 0, 0);
        }
      });

      const imagesPromises: Promise<void>[] = [];
      const designationsResize = resolution / BASE_SCALE_LINE_DPI;

      CanvasRenderingContext2D.prototype.resetTransform.apply(mapContext);

      await drawMeasurementsTooltips(mapContext);

      if (withDesignations) {
        imagesPromises.push(drawScaleLine(mapContext, designationsResize, hideScaleDigits));
      }

      if (withDesignations && windRose) {
        imagesPromises.push(drawWindRose(mapContext, designationsResize));
      }

      if (withDesignations && date) {
        imagesPromises.push(drawDate(mapContext, designationsResize));
      }

      await Promise.all(imagesPromises);

      if (withDesignations && border) {
        const lineWidth = Math.round((BORDER_WIDTH_MM * resolution) / 25.4);
        mapContext.lineWidth = lineWidth;
        mapContext.strokeStyle = 'f00000';
        mapContext.strokeRect(lineWidth / 2, lineWidth / 2, width - lineWidth, height - lineWidth);
      }

      resolve(mapCanvas.toDataURL(mime));

      // Reset original map size
      scaleLine.setDpi();
      map.setSize(size);
      view.setResolution(viewResolution);

      printSettings.setPrintingStatus(false);
    });
  });
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

export async function getDateImageSrc(resolution?: number): Promise<string> {
  moment.locale('ru');
  const el = document.createElement('div');
  document.body.append(el);
  const reactElement = createElement(PrintDialogDate, {
    forPrint: true,
    resolution: resolution || printSettings.resolution
  });
  render(reactElement, el);
  const src = await domToImage.toPng(el.childNodes[0]);
  unmountComponentAtNode(el);
  el.remove();

  return src;
}

async function drawMeasurementsTooltips(mapContext: CanvasRenderingContext2D): Promise<void> {
  for (const item of mapStore.measureItems) {
    const container = item.tooltipOverlay.getElement().parentElement;
    const translateFound = /(-?\d+(?:\.\d+)?)px, (-?\d+(?:\.\d+)?)px/.exec(container.style.transform);

    if (!translateFound) {
      return;
    }

    const [, translateX, translateY] = translateFound.map(Number);

    const src = await domToImage.toPng(item.tooltipRoot.childNodes[0]);

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
