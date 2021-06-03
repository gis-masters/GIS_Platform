import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { getPointResolution } from 'ol/proj';

import { printSettings } from '../../stores/PrintSettings.store';
import { mapService } from './map.service';

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
  pdf.addImage(await getScaleImage(), 'PNG', 5 + margin.left, pageHeight - 13 - margin.bottom, 80, 10);
  pdf.save('map.pdf');
}

export async function getMapImage(
  imageResolution?: number,
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

  const imagePromise = new Promise<string>(async (resolve, reject) => {
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

      resolve(mapCanvas.toDataURL('image/jpeg'));

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

export async function getScaleImage(): Promise<string> {
  return await domtoimage.toPng(document.querySelector('.ol-scale-bar-inner'), {
    width: 400,
    height: 50,
    style: { transform: 'translate(10px,20px)' }
  });
}
