import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import domToImage from 'dom-to-image';
import jsPDF from 'jspdf';
import moment from 'moment';
import { getPointResolution } from 'ol/proj';

import { printSettings } from '../../stores/PrintSettings.store';
import { mapService } from './map.service';
import { PrintDialogDate } from '../../components/PrintDialog/Date/PrintDialog-Date';

const BASE_SCALE_LINE_DPI = 150;
export const BORDER_WIDTH_MM = 0.4;

export async function printMap() {
  const { pageWidth, pageHeight, pageFormat, margin } = printSettings;

  const pdf = new jsPDF(printSettings.orientation, undefined, pageFormat.id);

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

export async function exportMap() {
  saveAs(await getMapImage(), 'map.jpg');
}

export async function getMapImage(
  imageResolution?: number,
  withDesignations: boolean = true,
  translateX: number = 0,
  translateY: number = 0
): Promise<string> {
  const { map, view, scaleLine } = mapService;
  const size = map.getSize();
  const viewResolution = view.getResolution();
  let { pageWidth, pageHeight, resolution, margin, scale } = printSettings;
  if (imageResolution) {
    resolution = imageResolution;
  }
  const width = Math.round(((pageWidth - margin.left - margin.right) * resolution) / 25.4);
  const height = Math.round(((pageHeight - margin.top - margin.bottom) * resolution) / 25.4);
  const scaleResolution = scale / 1000 / getPointResolution(view.getProjection(), resolution / 25.4, view.getCenter());

  printSettings.setPrintingStatus(true);

  const imagePromise = new Promise<string>(totalResolve => {
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
          const matrix = canvas.style.transform
            .match(/^matrix\(([^(]*)\)$/)[1]
            .split(',')
            .map(Number);

          // Apply the transform to the export map context
          CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
          mapContext.drawImage(canvas, 0, 0);
        }
      });

      const imagesPromises: Promise<void>[] = [];
      const designationsResize = resolution / BASE_SCALE_LINE_DPI;

      CanvasRenderingContext2D.prototype.resetTransform.apply(mapContext);

      if (withDesignations) {
        imagesPromises.push(
          new Promise(resolve => {
            const scaleLineImg = new Image();
            scaleLineImg.src = getScaleLineImageSrc();
            scaleLineImg.onload = () => {
              mapContext.drawImage(
                scaleLineImg,
                0,
                0,
                400 * designationsResize,
                50 * designationsResize,
                19 * designationsResize,
                height - 68 * designationsResize,
                400 * designationsResize,
                50 * designationsResize
              );

              resolve();
            };
          })
        );
      }

      if (withDesignations && printSettings.windRose) {
        imagesPromises.push(
          new Promise(resolve => {
            const roseImg = new Image();
            roseImg.src = getWindRoseImageSrc();
            roseImg.onload = () => {
              const size = 150 * designationsResize;
              const roseCanvas = document.createElement('canvas');
              roseCanvas.width = size;
              roseCanvas.height = size;
              const roseContext = roseCanvas.getContext('2d');
              roseContext.save();
              roseContext.translate(size / 2, size / 2);
              roseContext.rotate(printSettings.rotation);
              roseContext.translate(-size / 2, -size / 2);
              roseContext.drawImage(roseImg, 0, 0, size, size, 0, 0, size, size);
              roseContext.restore();

              mapContext.drawImage(
                roseCanvas,
                0,
                0,
                size,
                size,
                15 * designationsResize,
                15 * designationsResize,
                size,
                size
              );

              resolve();
            };
          })
        );
      }

      if (withDesignations && printSettings.date) {
        imagesPromises.push(
          new Promise(async resolve => {
            const dateImg = new Image();
            dateImg.src = await getDateImageSrc();
            dateImg.onload = () => {
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
            };
          })
        );
      }

      await Promise.all(imagesPromises);

      if (withDesignations && printSettings.border) {
        const lineWidth = Math.round((BORDER_WIDTH_MM * resolution) / 25.4);
        mapContext.lineWidth = lineWidth;
        mapContext.strokeStyle = 'f00000';
        mapContext.strokeRect(lineWidth / 2, lineWidth / 2, width - lineWidth, height - lineWidth);
      }

      totalResolve(mapCanvas.toDataURL('image/jpeg'));

      // Reset original map size
      scaleLine.setDpi(undefined);
      map.setSize(size);
      view.setResolution(viewResolution);

      printSettings.setPrintingStatus(false);
    });
  });

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

  return await imagePromise;
}

export function getScaleLineImageSrc(resolution?: number): string {
  return `/assets/images/scale${printSettings.scale}x${resolution || printSettings.resolution}.png`;
}

export function getWindRoseImageSrc(resolution?: number): string {
  return `/assets/images/rose${resolution || printSettings.resolution}.png`;
}

export async function getDateImageSrc(resolution?: number): Promise<string> {
  moment.locale('ru');
  const el = document.createElement('div');
  document.body.appendChild(el);
  const reactElement = createElement(PrintDialogDate, {
    forPrint: true,
    resolution: resolution || printSettings.resolution
  });
  render(reactElement, el);
  const src = await domToImage.toPng(el.childNodes[0]);
  unmountComponentAtNode(el);
  document.body.removeChild(el);

  return src;
}
