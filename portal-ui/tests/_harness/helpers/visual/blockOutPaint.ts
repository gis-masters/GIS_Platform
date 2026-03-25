/**
 * Сразу после сохранения эталона подкрашиваем зоны blockOut —
 * пиксели в этих прямоугольниках в diff не участвуют, сравнение не ломается.
 * Если эталон уже существовал — ничего не рисуем.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { PNG } from 'pngjs';

import { isArray } from '../../../../src/app/services/util/typeGuards/isArray';

export type VisualBlockOutRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ParsedVisualServiceOptions = {
  baselineFolder: string;
  savePerInstance: boolean;
  instanceName: string;
};

function isVisualServiceEntry(entry: unknown): entry is ['visual', Record<string, unknown>] {
  return isArray(entry) && entry[0] === 'visual' && typeof entry[1] === 'object' && entry[1] !== null;
}

function isOptionsWithServices(value: unknown): value is { services: unknown } {
  return typeof value === 'object' && value !== null && 'services' in value;
}

function readServicesArray(browser: WebdriverIO.Browser): unknown[] {
  const merged: unknown = browser.options;
  if (!isOptionsWithServices(merged)) {
    throw new Error('В browser.options нет поля services');
  }
  const { services } = merged;
  if (!isArray(services)) {
    throw new TypeError('browser.options.services не массив');
  }

  return services;
}

/** Читает опции сервиса `visual` из смерженного wdio-конфига (как в wdio.base.conf). */
export function parseVisualServiceUserOptions(browser: WebdriverIO.Browser): ParsedVisualServiceOptions {
  const services = readServicesArray(browser);

  for (const entry of services) {
    if (isVisualServiceEntry(entry)) {
      const o = entry[1];

      return {
        baselineFolder: typeof o.baselineFolder === 'string' ? o.baselineFolder : './tests/_screens/',
        savePerInstance: Boolean(o.savePerInstance),
        instanceName: typeof o.instanceName === 'string' ? o.instanceName : 'default'
      };
    }
  }

  throw new Error('В конфиге WDIO не найден сервис visual (массив ["visual", { ... }])');
}

/**
 * Путь к эталонному PNG так же, как у visual-service при formatImageName "{tag}" и savePerInstance.
 */
export function resolveVisualBaselinePngPath(
  projectRoot: string,
  opts: ParsedVisualServiceOptions,
  snapshotTag: string
): string {
  const base = path.resolve(projectRoot, opts.baselineFolder);
  const file = `${snapshotTag}.png`;

  if (opts.savePerInstance) {
    return path.join(base, opts.instanceName, file);
  }

  return path.join(base, file);
}

export function visualBaselinePngExists(baselinePngPath: string): boolean {
  return fs.existsSync(baselinePngPath);
}

function blendChannel(base: number, overlay: number, alpha: number): number {
  return Math.round(base * (1 - alpha) + overlay * alpha);
}

function drawRectRgba(png: PNG, rect: VisualBlockOutRect, alpha: number): void {
  const x0 = Math.max(0, Math.floor(rect.x));
  const y0 = Math.max(0, Math.floor(rect.y));
  const x1 = Math.min(png.width, Math.ceil(rect.x + rect.width));
  const y1 = Math.min(png.height, Math.ceil(rect.y + rect.height));

  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const i = (png.width * y + x) << 2;
      png.data[i] = blendChannel(png.data[i], 255, alpha);
      png.data[i + 1] = blendChannel(png.data[i + 1], 0, alpha);
      png.data[i + 2] = blendChannel(png.data[i + 2], 0, alpha);
      png.data[i + 3] = 255;
    }
  }
}

function encodePng(png: PNG): Uint8Array {
  return new Uint8Array(PNG.sync.write(png));
}

/**
 * Только что созданный эталон: подкрасить зоны blockOut на месте.
 * Если эталон уже был до ассерта — выход без записи.
 */
export function paintBlockOutOnBaselineIfJustCreated(
  baselinePngPath: string,
  rects: VisualBlockOutRect[],
  options: { baselineExistedBeforeAssert: boolean },
  drawOptions?: { alpha?: number }
): void {
  if (options.baselineExistedBeforeAssert || rects.length === 0 || !fs.existsSync(baselinePngPath)) {
    return;
  }

  const alpha = drawOptions?.alpha ?? 0.35;
  const input = fs.readFileSync(baselinePngPath);
  const png = PNG.sync.read(input);

  for (const r of rects) {
    drawRectRgba(png, r, alpha);
  }

  fs.writeFileSync(baselinePngPath, encodePng(png));
}
