import type { Map } from 'ol';
import type ImageWrapper from 'ol/Image';
import TileLayer from 'ol/layer/Tile';
import UrlTile from 'ol/source/UrlTile';
import Tile from 'ol/Tile';
import { getKey } from 'ol/tilecoord';
import TileState from 'ol/TileState';

import { mapStore } from '../../../stores/Map.store';
import { services } from '../../services';
import { Mime } from '../../util/Mime';
import { assignTileBlobUrl } from '../map.util';

/** Как у GetFeatureInfo НСПД. Только для nspd.gov.ru: обрывает бесконечный pending, чтобы слот TileQueue не залипал. */
const EXTERNAL_TILE_FETCH_TIMEOUT_MS = 15_000;
/** Как в доке OL ImageTile: после ошибки ещё до 3 вызовов tile.load(). Для всех Tile этого loader, не только НСПД. */
const EXTERNAL_TILE_MAX_RETRIES = 3;
/** Retry в обход TileQueue. First load этим лимитом не ограничен. */
export const EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT = 5;
const EXTERNAL_TILE_RETRY_BASE_DELAY_MS = 1000;
const EXTERNAL_TILE_RETRY_HTTP_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

type TileCachePeek = {
  containsKey(key: string): boolean;
  peek(key: string): Tile | undefined;
};

let externalTileRetryAttempts = new WeakMap<Tile, number>();
let pendingRetryTiles = new WeakSet<Tile>();
let externalTileRetryInFlight = 0;
let externalTileRetryEpoch = 0;
const externalTileRetrySlotWaiters: Array<() => void> = [];
const externalTileRetryTimeoutIds = new Set<number>();
let getExternalTileRetryMap: (() => Map | undefined) | undefined;

/** Карта для проверки, что ERROR-тайл ещё в кадре. Нет getter - retry как раньше (fail-open). */
export function setExternalTileRetryMapGetter(getMap?: () => Map | undefined): void {
  getExternalTileRetryMap = getMap;
}

function sourceOwnsTile(source: UrlTile, tile: Tile): boolean {
  const cache = (source as unknown as { tileCache?: TileCachePeek }).tileCache;
  if (!cache) {
    return false;
  }

  const key = getKey(tile.tileCoord);

  return cache.containsKey(key) && cache.peek(key) === tile;
}

/** ERROR-тайл принадлежит видимому слою с этим loader и ещё в кадре. Getter без карты - не ретраим. */
export function isExternalTileWanted(tile: Tile): boolean {
  if (!getExternalTileRetryMap) {
    return true;
  }

  const map = getExternalTileRetryMap();
  if (!map) {
    return false;
  }

  const size = map.getSize();
  if (!size) {
    return true;
  }

  const view = map.getView();
  const extent = view.calculateExtent(size);
  const projection = view.getProjection();
  const tileCoord = tile.tileCoord;

  for (const layer of map.getAllLayers()) {
    if (!(layer instanceof TileLayer) || !layer.getVisible()) {
      continue;
    }

    const source: unknown = layer.getSource();
    if (!(source instanceof UrlTile) || source.getTileLoadFunction() !== externalGisMapServerLoadFunction) {
      continue;
    }

    if (!sourceOwnsTile(source, tile)) {
      continue;
    }

    const tileGrid = source.getTileGrid() ?? source.getTileGridForProjection(projection);
    const z = tileCoord[0];
    if (z < tileGrid.getMinZoom() || z > tileGrid.getMaxZoom()) {
      return false;
    }

    return tileGrid.getTileRangeForExtentAndZ(extent, z).contains(tileCoord);
  }

  return false;
}

function acquireExternalTileRetrySlot(): Promise<void> {
  if (externalTileRetryInFlight < EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT) {
    externalTileRetryInFlight += 1;

    return Promise.resolve();
  }

  return new Promise(resolve => {
    externalTileRetrySlotWaiters.push(resolve);
  });
}

function releaseExternalTileRetrySlot(): void {
  const next = externalTileRetrySlotWaiters.shift();
  if (next) {
    next();

    return;
  }

  externalTileRetryInFlight -= 1;
}

function clearExternalTileRetryTimeouts(): void {
  for (const timeoutId of externalTileRetryTimeoutIds) {
    window.clearTimeout(timeoutId);
  }
  externalTileRetryTimeoutIds.clear();
}

function isExternalTileRetryMapGone(): boolean {
  return Boolean(getExternalTileRetryMap) && !getExternalTileRetryMap?.();
}

/** Сброс очереди retry: резолвит waiters и снимает таймеры, чтобы слоты не протекали. */
export function resetExternalTileRetryQueue(): void {
  externalTileRetryEpoch += 1;
  clearExternalTileRetryTimeouts();
  const waiters = externalTileRetrySlotWaiters.splice(0);
  externalTileRetryInFlight = 0;
  pendingRetryTiles = new WeakSet();
  externalTileRetryAttempts = new WeakMap();
  getExternalTileRetryMap = undefined;
  waiters.forEach(resolve => {
    resolve();
  });
}

function markExternalTileLoadFailed(tile: Tile | ImageWrapper): void {
  if (tile instanceof Tile) {
    tile.setState(TileState.ERROR);

    return;
  }

  const image = tile.getImage();
  if (image instanceof HTMLImageElement) {
    image.src = 'data:,';
  }
}

function shouldSkipExternalTileRetry(tile: Tile): boolean {
  if (tile.getState() !== TileState.ERROR) {
    return true;
  }

  if (isExternalTileWanted(tile)) {
    return false;
  }

  tile.setState(TileState.IDLE);

  return true;
}

async function startExternalTileRetry(tile: Tile, nextAttempt: number): Promise<void> {
  if (shouldSkipExternalTileRetry(tile)) {
    return;
  }

  const epoch = externalTileRetryEpoch;
  await acquireExternalTileRetrySlot();

  if (epoch !== externalTileRetryEpoch) {
    return;
  }

  if (shouldSkipExternalTileRetry(tile)) {
    releaseExternalTileRetrySlot();

    return;
  }

  externalTileRetryAttempts.set(tile, nextAttempt);
  pendingRetryTiles.add(tile);

  try {
    tile.load();
  } catch (error) {
    pendingRetryTiles.delete(tile);
    releaseExternalTileRetrySlot();
    throw error;
  }
}

function scheduleExternalTileRetry(tile: Tile): void {
  if (isExternalTileRetryMapGone()) {
    return;
  }

  const nextAttempt = (externalTileRetryAttempts.get(tile) ?? 0) + 1;
  if (nextAttempt > EXTERNAL_TILE_MAX_RETRIES) {
    return;
  }

  const timeoutId = window.setTimeout(() => {
    externalTileRetryTimeoutIds.delete(timeoutId);
    void startExternalTileRetry(tile, nextAttempt);
  }, nextAttempt * EXTERNAL_TILE_RETRY_BASE_DELAY_MS);
  externalTileRetryTimeoutIds.add(timeoutId);
}

async function fetchExternalTileBlob(url: string): Promise<{ data?: Blob; retryableFailure: boolean }> {
  mapStore.enrollLoadingStart();
  const nspd = url.includes('nspd.gov.ru');
  let replacedUrl = url
    .replace('256%2C256', '1024%2C1024')
    .replace('DPI=90', 'DPI=360')
    .replace('BBOXSR=3857', 'bboxSR=102100')
    .replace('IMAGESR=3857', 'imageSR=102100');

  if (nspd) {
    replacedUrl = url;
  }

  const controller = nspd ? new AbortController() : undefined;
  const timeoutId = controller
    ? window.setTimeout(() => controller.abort(), EXTERNAL_TILE_FETCH_TIMEOUT_MS)
    : undefined;

  let data: Blob | undefined;
  let retryableFailure = false;

  try {
    const response = await fetch(replacedUrl, controller ? { signal: controller.signal } : undefined);
    if (response.ok) {
      data = await response.blob();
    } else if (EXTERNAL_TILE_RETRY_HTTP_STATUSES.has(response.status)) {
      retryableFailure = true;
    }
  } catch (error) {
    retryableFailure = true;
    if (controller?.signal.aborted) {
      services.logger.warn('Таймаут загрузки тайла НСПД', replacedUrl);
    } else {
      services.logger.error(error);
    }
  } finally {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }
    mapStore.enrollLoadingFinish();
  }

  return { data, retryableFailure };
}

export async function externalGisMapServerLoadFunction(tile: Tile | ImageWrapper, url: string): Promise<void> {
  const retry = tile instanceof Tile && pendingRetryTiles.delete(tile);
  const epoch = externalTileRetryEpoch;

  try {
    const { data, retryableFailure } = await fetchExternalTileBlob(url);

    if (!data?.size) {
      markExternalTileLoadFailed(tile);
      if (retryableFailure && tile instanceof Tile) {
        scheduleExternalTileRetry(tile);
      }

      return;
    }

    if (tile instanceof Tile) {
      externalTileRetryAttempts.delete(tile);
    }
    assignTileBlobUrl(tile, new Blob([data], { type: Mime.VND_JPEG_PNG8 }));
  } finally {
    if (retry && epoch === externalTileRetryEpoch) {
      releaseExternalTileRetrySlot();
    }
  }
}
