import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { Map, View } from 'ol';
import ImageWrapper from 'ol/Image';
import ImageState from 'ol/ImageState';
import ImageTile from 'ol/ImageTile';
import TileLayer from 'ol/layer/Tile';
import TileArcGISRest from 'ol/source/TileArcGISRest';
import type UrlTile from 'ol/source/UrlTile';
import type { TileCoord } from 'ol/tilecoord';
import TileState from 'ol/TileState';

jest.mock('../../services', () => ({
  services: {
    logger: {
      warn: jest.fn(),
      error: jest.fn()
    }
  }
}));

jest.mock('../../../stores/Map.store', () => {
  let loadingCount = 0;

  return {
    mapStore: {
      enrollLoadingStart() {
        loadingCount += 1;
      },
      enrollLoadingFinish() {
        loadingCount -= 1;
      },
      get loading() {
        return Boolean(loadingCount);
      }
    }
  };
});

import { mapStore } from '../../../stores/Map.store';
import { services } from '../../services';
import { TILE_BLOB_URL_REVOKE_DELAY_MS } from '../map.util';
import {
  EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT,
  externalGisMapServerLoadFunction,
  isExternalTileWanted,
  resetExternalTileRetryQueue,
  setExternalTileRetryMapGetter
} from './external-tile-load';

const NSPD_URL = 'https://nspd.gov.ru/api/aeggis/v4/36048/wms?REQUEST=GetMap';
const EXTERNAL_URL = 'https://example.com/arcgis/rest/services/export?SIZE=256%2C256';
const BLOB_URL = 'blob:tile';
const FETCH_TIMEOUT_MS = 15_000;
const RETRY_BASE_DELAY_MS = 1000;
const MAX_RETRIES = 3;

const logger = {
  warn: jest.mocked(services.logger.warn),
  error: jest.mocked(services.logger.error)
};

function createAbortError(): Error {
  const error = new Error('The operation was aborted.');
  error.name = 'AbortError';

  return error;
}

type TileFetchResponse = {
  ok: boolean;
  status: number;
  blob(): Promise<Blob>;
};

function hangUntilAbort(_input: RequestInfo | URL, init?: RequestInit): Promise<TileFetchResponse> {
  return new Promise((_resolve, reject) => {
    const signal = init?.signal;
    if (!signal) {
      return;
    }

    if (signal.aborted) {
      reject(createAbortError());

      return;
    }

    signal.addEventListener('abort', () => {
      reject(createAbortError());
    });
  });
}

function unusedFetch(_input: RequestInfo | URL, _init?: RequestInit): Promise<TileFetchResponse> {
  return Promise.reject(new Error('fetch не настроен'));
}

function asFetch(impl: (input: RequestInfo | URL, init?: RequestInit) => Promise<TileFetchResponse>): typeof fetch {
  return impl as unknown as typeof fetch;
}

function asResponse(response: TileFetchResponse): Response {
  return response as unknown as Response;
}

function ensureProperty(target: object, key: string, value: unknown): boolean {
  const existed = key in target;
  if (!existed) {
    Object.defineProperty(target, key, {
      configurable: true,
      writable: true,
      value
    });
  }

  return existed;
}

function blobResponse(size: number, status = 200): TileFetchResponse {
  const body = size > 0 ? new Uint8Array(size) : new Uint8Array();
  const blob = new Blob([body]);

  return {
    ok: status >= 200 && status < 300,
    status,
    blob: () => Promise.resolve(blob)
  };
}

function httpResponse(status: number): TileFetchResponse {
  return {
    ok: status >= 200 && status < 300,
    status,
    blob: () => Promise.resolve(new Blob())
  };
}

function createTile(url: string, tileCoord: TileCoord = [0, 0, 0]): ImageTile {
  return new ImageTile(tileCoord, TileState.IDLE, url, null, (tile, src) => {
    void externalGisMapServerLoadFunction(tile, src);
  });
}

const mapsToDispose: Map[] = [];

function disposeMaps(): void {
  for (const map of mapsToDispose) {
    const target = map.getTargetElement();
    map.setTarget();
    target?.remove();
  }
  mapsToDispose.length = 0;
}

function ensureResizeObserver(): void {
  if (typeof globalThis.ResizeObserver === 'function') {
    return;
  }

  globalThis.ResizeObserver = class {
    observe(): void {
      return;
    }

    unobserve(): void {
      return;
    }

    disconnect(): void {
      return;
    }
  };
}

function createRetryMap(withExternalLayer = false, layerVisible = true): Map {
  ensureResizeObserver();
  const target = document.createElement('div');
  target.style.width = '256px';
  target.style.height = '256px';
  document.body.append(target);

  const map = new Map({
    target,
    view: new View({ center: [0, 0], zoom: 5 }),
    layers: withExternalLayer
      ? [
          new TileLayer({
            visible: layerVisible,
            source: new TileArcGISRest({
              url: EXTERNAL_URL,
              tileLoadFunction: externalGisMapServerLoadFunction
            })
          })
        ]
      : []
  });
  map.setSize([256, 256]);
  mapsToDispose.push(map);

  return map;
}

function externalSource(map: Map): UrlTile {
  const source = (map.getAllLayers()[0] as TileLayer<UrlTile>).getSource();
  if (!source) {
    throw new Error('ожидался UrlTile source');
  }

  return source;
}

function tileCoordInView(map: Map, inView: boolean, source = externalSource(map)): TileCoord {
  const view = map.getView();
  const size = map.getSize();
  if (!size) {
    throw new Error('у карты нет size');
  }

  const tileGrid = source.getTileGridForProjection(view.getProjection());
  const z = tileGrid.getZForResolution(view.getResolution() ?? tileGrid.getResolution(0));
  const range = tileGrid.getTileRangeForExtentAndZ(view.calculateExtent(size), z);

  if (inView) {
    return [z, range.minX, range.minY];
  }

  return [z, range.maxX + 20, range.maxY + 20];
}

function tileFromSource(map: Map, inView: boolean, source = externalSource(map)): ImageTile {
  const tileCoord = tileCoordInView(map, inView, source);
  const tile = source.getTile(tileCoord[0], tileCoord[1], tileCoord[2], 1, map.getView().getProjection());
  if (!(tile instanceof ImageTile)) {
    throw new TypeError('ожидался ImageTile');
  }

  return tile;
}

function createImageWrapper(): { wrapper: ImageWrapper; image: HTMLImageElement } {
  const image = new Image();
  const wrapper = new ImageWrapper([0, 0, 1, 1], 1, 1, ImageState.LOADING);
  wrapper.setImage(image);

  return { wrapper, image };
}

function htmlImage(image: ReturnType<ImageTile['getImage']>): HTMLImageElement {
  if (!(image instanceof HTMLImageElement)) {
    throw new TypeError('ожидался HTMLImageElement');
  }

  return image;
}

async function flushMicrotasks(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

async function settleLoads(fetchSpy: { mock: { calls: unknown[][] } }): Promise<void> {
  let previous = -1;
  for (let i = 0; i < 40; i++) {
    await flushMicrotasks();
    const current = fetchSpy.mock.calls.length;
    if (current === previous) {
      return;
    }

    previous = current;
  }
}

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') {
    return input;
  }

  if (input instanceof URL) {
    return input.href;
  }

  return input.url;
}

function fetchCountFor(fetchSpy: { mock: { calls: unknown[][] } }, url: string): number {
  return fetchSpy.mock.calls.filter(([input]) => requestUrl(input as RequestInfo | URL) === url).length;
}

function nspdUrl(index: number): string {
  return `${NSPD_URL}&i=${index}`;
}

function trackFetchConcurrency(): {
  impl(input: RequestInfo | URL, init?: RequestInit): Promise<TileFetchResponse>;
  maxConcurrent(): number;
  maxRetryConcurrent(): number;
} {
  let concurrent = 0;
  let maxConcurrent = 0;
  let retryConcurrent = 0;
  let maxRetryConcurrent = 0;
  const seen = new Set<string>();

  return {
    impl(input, init) {
      const url = requestUrl(input);
      const retry = seen.has(url);
      seen.add(url);
      concurrent += 1;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      if (retry) {
        retryConcurrent += 1;
        maxRetryConcurrent = Math.max(maxRetryConcurrent, retryConcurrent);
      }

      return hangUntilAbort(input, init).finally(() => {
        concurrent -= 1;
        if (retry) {
          retryConcurrent -= 1;
        }
      });
    },
    maxConcurrent() {
      return maxConcurrent;
    },
    maxRetryConcurrent() {
      return maxRetryConcurrent;
    }
  };
}

describe('externalGisMapServerLoadFunction retry', () => {
  let fetchSpy: jest.SpiedFunction<typeof fetch>;
  let createObjectURLSpy: jest.SpiedFunction<typeof URL.createObjectURL>;
  let revokeObjectURLSpy: jest.SpiedFunction<typeof URL.revokeObjectURL>;
  const installedStubs: Array<{ target: object; key: string }> = [];

  beforeEach(() => {
    resetExternalTileRetryQueue();
    jest.useFakeTimers();
    if (!ensureProperty(globalThis, 'fetch', asFetch(unusedFetch))) {
      installedStubs.push({ target: globalThis, key: 'fetch' });
    }
    if (!ensureProperty(URL, 'createObjectURL', () => BLOB_URL)) {
      installedStubs.push({ target: URL, key: 'createObjectURL' });
    }
    if (
      !ensureProperty(URL, 'revokeObjectURL', () => {
        return;
      })
    ) {
      installedStubs.push({ target: URL, key: 'revokeObjectURL' });
    }

    fetchSpy = jest.spyOn(globalThis, 'fetch').mockImplementation(asFetch(unusedFetch));
    createObjectURLSpy = jest.spyOn(URL, 'createObjectURL').mockReturnValue(BLOB_URL);
    revokeObjectURLSpy = jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {
      return;
    });
    logger.warn.mockReset();
    logger.error.mockReset();
  });

  afterEach(() => {
    resetExternalTileRetryQueue();
    disposeMaps();
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
    for (const { target, key } of installedStubs) {
      Reflect.deleteProperty(target, key);
    }
    installedStubs.length = 0;
  });

  test('тайл НСПД после таймаута уходит в ERROR и при успехе на retry рисуется blob', async () => {
    fetchSpy.mockImplementationOnce(asFetch(hangUntilAbort)).mockResolvedValueOnce(asResponse(blobResponse(8)));

    const tile = createTile(NSPD_URL);
    tile.load();
    await flushMicrotasks();

    expect(tile.getState()).toBe(TileState.LOADING);
    expect(mapStore.loading).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0][1]).toEqual(expect.objectContaining({ signal: expect.any(AbortSignal) }));

    await jest.advanceTimersByTimeAsync(FETCH_TIMEOUT_MS);

    expect(tile.getState()).toBe(TileState.ERROR);
    expect(mapStore.loading).toBe(false);
    expect(logger.warn).toHaveBeenCalledWith('Таймаут загрузки тайла НСПД', NSPD_URL);
    expect(logger.error).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(RETRY_BASE_DELAY_MS);
    await flushMicrotasks();

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(htmlImage(tile.getImage()).src).toContain(BLOB_URL);
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(TILE_BLOB_URL_REVOKE_DELAY_MS);

    expect(revokeObjectURLSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLSpy).toHaveBeenCalledWith(BLOB_URL);
  });

  test('тайл НСПД запрашивается не больше чем 1 исходный плюс 3 retry', async () => {
    fetchSpy.mockImplementation(asFetch(hangUntilAbort));

    const tile = createTile(NSPD_URL);
    tile.load();
    await flushMicrotasks();

    await jest.advanceTimersByTimeAsync(FETCH_TIMEOUT_MS);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(tile.getState()).toBe(TileState.ERROR);

    await jest.advanceTimersByTimeAsync(RETRY_BASE_DELAY_MS);
    await flushMicrotasks();
    expect(fetchSpy).toHaveBeenCalledTimes(2);

    await jest.advanceTimersByTimeAsync(FETCH_TIMEOUT_MS);
    await jest.advanceTimersByTimeAsync(2 * RETRY_BASE_DELAY_MS);
    await flushMicrotasks();
    expect(fetchSpy).toHaveBeenCalledTimes(3);

    await jest.advanceTimersByTimeAsync(FETCH_TIMEOUT_MS);
    await jest.advanceTimersByTimeAsync(3 * RETRY_BASE_DELAY_MS);
    await flushMicrotasks();
    expect(fetchSpy).toHaveBeenCalledTimes(1 + MAX_RETRIES);

    await jest.advanceTimersByTimeAsync(FETCH_TIMEOUT_MS);
    await jest.advanceTimersByTimeAsync(20_000);
    await flushMicrotasks();

    expect(fetchSpy).toHaveBeenCalledTimes(1 + MAX_RETRIES);
    expect(tile.getState()).toBe(TileState.ERROR);
  });

  test('не-НСПД Tile при 502 ретраится без AbortController и при успехе рисуется', async () => {
    const abortCtor = jest.spyOn(global, 'AbortController');
    fetchSpy.mockResolvedValueOnce(asResponse(httpResponse(502))).mockResolvedValueOnce(asResponse(blobResponse(8)));

    const tile = createTile(EXTERNAL_URL);
    tile.load();
    await flushMicrotasks();

    expect(abortCtor).not.toHaveBeenCalled();
    expect(fetchSpy.mock.calls[0][1]).toBeUndefined();
    expect(tile.getState()).toBe(TileState.ERROR);
    expect(logger.warn).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(RETRY_BASE_DELAY_MS);
    await flushMicrotasks();

    expect(abortCtor).not.toHaveBeenCalled();
    expect(fetchSpy.mock.calls[1][1]).toBeUndefined();
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(htmlImage(tile.getImage()).src).toContain(BLOB_URL);
    expect(revokeObjectURLSpy).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(TILE_BLOB_URL_REVOKE_DELAY_MS);

    expect(revokeObjectURLSpy).toHaveBeenCalledWith(BLOB_URL);
  });

  test('если к моменту таймера тайл уже не ERROR, fetch нет и попытка не сожжена', async () => {
    fetchSpy.mockResolvedValue(asResponse(httpResponse(502)));

    const tile = createTile(EXTERNAL_URL);
    tile.load();
    await flushMicrotasks();

    expect(tile.getState()).toBe(TileState.ERROR);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const loadSpy = jest.spyOn(tile, 'load');
    tile.setState(TileState.LOADED);

    await jest.advanceTimersByTimeAsync(RETRY_BASE_DELAY_MS);
    await flushMicrotasks();

    expect(loadSpy).not.toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    loadSpy.mockRestore();
    tile.setState(TileState.ERROR);
    tile.load();
    await flushMicrotasks();
    expect(fetchSpy).toHaveBeenCalledTimes(2);

    await jest.advanceTimersByTimeAsync(RETRY_BASE_DELAY_MS);
    await flushMicrotasks();
    expect(fetchSpy).toHaveBeenCalledTimes(3);

    await jest.advanceTimersByTimeAsync(2 * RETRY_BASE_DELAY_MS);
    await flushMicrotasks();
    expect(fetchSpy).toHaveBeenCalledTimes(4);

    await jest.advanceTimersByTimeAsync(3 * RETRY_BASE_DELAY_MS);
    await flushMicrotasks();
    expect(fetchSpy).toHaveBeenCalledTimes(2 + MAX_RETRIES);

    await jest.advanceTimersByTimeAsync(20_000);
    await flushMicrotasks();
    expect(fetchSpy).toHaveBeenCalledTimes(2 + MAX_RETRIES);
  });

  test('ImageWMS при 502 остаётся без tile.load retry', async () => {
    fetchSpy.mockResolvedValueOnce(asResponse(httpResponse(502)));

    const { wrapper, image } = createImageWrapper();
    await externalGisMapServerLoadFunction(wrapper, EXTERNAL_URL);
    await jest.advanceTimersByTimeAsync(20_000);
    await flushMicrotasks();

    expect(image.src).toBe('data:,');
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  test('пустой 200 оставляет Tile в ERROR без retry', async () => {
    fetchSpy.mockResolvedValueOnce(asResponse(blobResponse(0)));

    const tile = createTile(EXTERNAL_URL);
    tile.load();
    await flushMicrotasks();
    await jest.advanceTimersByTimeAsync(20_000);
    await flushMicrotasks();

    expect(tile.getState()).toBe(TileState.ERROR);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(logger.warn).not.toHaveBeenCalled();
    expect(createObjectURLSpy).not.toHaveBeenCalled();
    expect(revokeObjectURLSpy).not.toHaveBeenCalled();
  });

  test('404 оставляет Tile в ERROR без retry', async () => {
    fetchSpy.mockResolvedValueOnce(asResponse(httpResponse(404)));

    const tile = createTile(NSPD_URL);
    tile.load();
    await flushMicrotasks();
    await jest.advanceTimersByTimeAsync(20_000);
    await flushMicrotasks();

    expect(tile.getState()).toBe(TileState.ERROR);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(logger.warn).not.toHaveBeenCalled();
    expect(createObjectURLSpy).not.toHaveBeenCalled();
    expect(revokeObjectURLSpy).not.toHaveBeenCalled();
  });

  test('после таймаута пачки НСПД одновременно не больше 5 retry-fetch, остальные ждут слот', async () => {
    const tileCount = EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT + 4;
    const tracker = trackFetchConcurrency();
    fetchSpy.mockImplementation(asFetch(tracker.impl));

    Array.from({ length: tileCount }, (_, i) => createTile(nspdUrl(i))).forEach(tile => tile.load());
    await settleLoads(fetchSpy);

    expect(fetchSpy).toHaveBeenCalledTimes(tileCount);
    expect(tracker.maxRetryConcurrent()).toBe(0);

    await jest.advanceTimersByTimeAsync(FETCH_TIMEOUT_MS);
    await settleLoads(fetchSpy);

    await jest.advanceTimersByTimeAsync(RETRY_BASE_DELAY_MS);
    await settleLoads(fetchSpy);

    expect(tracker.maxRetryConcurrent()).toBeLessThanOrEqual(EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT);
    expect(fetchSpy).toHaveBeenCalledTimes(tileCount + EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT);

    await jest.advanceTimersByTimeAsync(FETCH_TIMEOUT_MS);
    await settleLoads(fetchSpy);

    expect(fetchSpy.mock.calls.length).toBeGreaterThan(tileCount + EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT);
    expect(tracker.maxRetryConcurrent()).toBeLessThanOrEqual(EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT);
  });

  test('пока идут retry, новые первые загрузки не ждут retry-очередь', async () => {
    const retryCount = EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT;
    const firstCount = 3;
    const tracker = trackFetchConcurrency();
    fetchSpy.mockImplementation(asFetch(tracker.impl));

    Array.from({ length: retryCount }, (_, i) => createTile(nspdUrl(i))).forEach(tile => tile.load());
    await settleLoads(fetchSpy);
    await jest.advanceTimersByTimeAsync(FETCH_TIMEOUT_MS);
    await settleLoads(fetchSpy);
    await jest.advanceTimersByTimeAsync(RETRY_BASE_DELAY_MS);
    await settleLoads(fetchSpy);

    expect(fetchSpy).toHaveBeenCalledTimes(retryCount * 2);
    expect(tracker.maxRetryConcurrent()).toBe(retryCount);

    Array.from({ length: firstCount }, (_, i) => createTile(nspdUrl(100 + i))).forEach(tile => tile.load());
    await settleLoads(fetchSpy);

    expect(fetchSpy).toHaveBeenCalledTimes(retryCount * 2 + firstCount);
    expect(tracker.maxRetryConcurrent()).toBeLessThanOrEqual(EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT);
    expect(tracker.maxConcurrent()).toBeGreaterThan(EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT);
  });

  test('лимит retry-очереди не увеличивает число попыток сверх 1 исходного плюс 3 retry', async () => {
    const tileCount = EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT + 4;
    const urls = Array.from({ length: tileCount }, (_, i) => nspdUrl(i));
    fetchSpy.mockImplementation(asFetch(hangUntilAbort));

    urls.map(url => createTile(url)).forEach(tile => tile.load());
    await settleLoads(fetchSpy);

    for (let i = 0; i < tileCount; i++) {
      await jest.advanceTimersByTimeAsync(FETCH_TIMEOUT_MS);
      await jest.advanceTimersByTimeAsync(3 * RETRY_BASE_DELAY_MS);
      await settleLoads(fetchSpy);
    }

    await jest.advanceTimersByTimeAsync(FETCH_TIMEOUT_MS);
    await jest.advanceTimersByTimeAsync(20_000);
    await settleLoads(fetchSpy);

    for (const url of urls) {
      expect(fetchCountFor(fetchSpy, url)).toBe(1 + MAX_RETRIES);
    }

    expect(fetchSpy).toHaveBeenCalledTimes(tileCount * (1 + MAX_RETRIES));
  });

  test('если к моменту слота retry тайл уже не ERROR, fetch нет и попытка не сожжена', async () => {
    const waitingUrl = nspdUrl(EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT);
    const tracker = trackFetchConcurrency();
    fetchSpy.mockImplementation(asFetch(tracker.impl));

    const tiles = Array.from({ length: EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT + 1 }, (_, i) => createTile(nspdUrl(i)));
    tiles.forEach(tile => tile.load());
    await settleLoads(fetchSpy);

    await jest.advanceTimersByTimeAsync(FETCH_TIMEOUT_MS);
    await settleLoads(fetchSpy);
    await jest.advanceTimersByTimeAsync(RETRY_BASE_DELAY_MS);
    await settleLoads(fetchSpy);

    expect(fetchSpy).toHaveBeenCalledTimes(EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT * 2 + 1);
    expect(fetchCountFor(fetchSpy, waitingUrl)).toBe(1);

    const waitingTile = tiles[EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT];
    const loadSpy = jest.spyOn(waitingTile, 'load');
    waitingTile.setState(TileState.LOADED);

    await jest.advanceTimersByTimeAsync(FETCH_TIMEOUT_MS);
    await settleLoads(fetchSpy);

    expect(loadSpy).not.toHaveBeenCalled();
    expect(fetchCountFor(fetchSpy, waitingUrl)).toBe(1);
    expect(tracker.maxRetryConcurrent()).toBeLessThanOrEqual(EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT);

    loadSpy.mockRestore();
    waitingTile.setState(TileState.ERROR);
    waitingTile.load();
    await settleLoads(fetchSpy);
    expect(fetchCountFor(fetchSpy, waitingUrl)).toBe(2);

    for (let i = 0; i < 8; i++) {
      await jest.advanceTimersByTimeAsync(FETCH_TIMEOUT_MS);
      await jest.advanceTimersByTimeAsync(3 * RETRY_BASE_DELAY_MS);
      await settleLoads(fetchSpy);
    }

    expect(fetchCountFor(fetchSpy, waitingUrl)).toBe(2 + MAX_RETRIES);
  });

  test('если к моменту таймера тайл уже не в кадре, fetch нет, попытка не сожжена, state IDLE', async () => {
    fetchSpy.mockResolvedValue(asResponse(httpResponse(502)));
    const map = createRetryMap();
    setExternalTileRetryMapGetter(() => map);

    const tile = createTile(EXTERNAL_URL);
    tile.load();
    await flushMicrotasks();

    expect(tile.getState()).toBe(TileState.ERROR);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const loadSpy = jest.spyOn(tile, 'load');
    await jest.advanceTimersByTimeAsync(RETRY_BASE_DELAY_MS);
    await flushMicrotasks();

    expect(loadSpy).not.toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(tile.getState()).toBe(TileState.IDLE);

    loadSpy.mockRestore();
    setExternalTileRetryMapGetter();
    tile.load();
    await flushMicrotasks();
    expect(fetchSpy).toHaveBeenCalledTimes(2);

    await jest.advanceTimersByTimeAsync(RETRY_BASE_DELAY_MS);
    await flushMicrotasks();
    expect(fetchSpy).toHaveBeenCalledTimes(3);

    await jest.advanceTimersByTimeAsync(2 * RETRY_BASE_DELAY_MS);
    await flushMicrotasks();
    expect(fetchSpy).toHaveBeenCalledTimes(4);

    await jest.advanceTimersByTimeAsync(3 * RETRY_BASE_DELAY_MS);
    await flushMicrotasks();
    expect(fetchSpy).toHaveBeenCalledTimes(2 + MAX_RETRIES);

    await jest.advanceTimersByTimeAsync(20_000);
    await flushMicrotasks();
    expect(fetchSpy).toHaveBeenCalledTimes(2 + MAX_RETRIES);
  });

  test('если к моменту слота retry тайл уже не в кадре, fetch нет, слот освобождается, попытка не сожжена', async () => {
    const waitingUrl = nspdUrl(EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT);
    const tracker = trackFetchConcurrency();
    fetchSpy.mockImplementation(asFetch(tracker.impl));

    const tiles = Array.from({ length: EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT + 1 }, (_, i) => createTile(nspdUrl(i)));
    tiles.forEach(tile => tile.load());
    await settleLoads(fetchSpy);

    await jest.advanceTimersByTimeAsync(FETCH_TIMEOUT_MS);
    await settleLoads(fetchSpy);
    await jest.advanceTimersByTimeAsync(RETRY_BASE_DELAY_MS);
    await settleLoads(fetchSpy);

    expect(fetchSpy).toHaveBeenCalledTimes(EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT * 2 + 1);
    expect(fetchCountFor(fetchSpy, waitingUrl)).toBe(1);

    const waitingTile = tiles[EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT];
    const loadSpy = jest.spyOn(waitingTile, 'load');
    const map = createRetryMap();
    setExternalTileRetryMapGetter(() => map);

    await jest.advanceTimersByTimeAsync(FETCH_TIMEOUT_MS);
    await settleLoads(fetchSpy);

    expect(loadSpy).not.toHaveBeenCalled();
    expect(waitingTile.getState()).toBe(TileState.IDLE);
    expect(fetchCountFor(fetchSpy, waitingUrl)).toBe(1);
    expect(tracker.maxRetryConcurrent()).toBeLessThanOrEqual(EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT);

    loadSpy.mockRestore();
    setExternalTileRetryMapGetter();
    waitingTile.load();
    await settleLoads(fetchSpy);
    expect(fetchCountFor(fetchSpy, waitingUrl)).toBe(2);

    for (let i = 0; i < 8; i++) {
      await jest.advanceTimersByTimeAsync(FETCH_TIMEOUT_MS);
      await jest.advanceTimersByTimeAsync(3 * RETRY_BASE_DELAY_MS);
      await settleLoads(fetchSpy);
    }

    expect(fetchCountFor(fetchSpy, waitingUrl)).toBe(2 + MAX_RETRIES);
  });

  test('getter без карты не ретраит ERROR-тайл, state IDLE, попытка не сожжена', async () => {
    fetchSpy.mockResolvedValue(asResponse(httpResponse(502)));

    const tile = createTile(EXTERNAL_URL);
    tile.load();
    await flushMicrotasks();

    expect(tile.getState()).toBe(TileState.ERROR);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const loadSpy = jest.spyOn(tile, 'load');
    setExternalTileRetryMapGetter((): Map | undefined => {
      return;
    });

    await jest.advanceTimersByTimeAsync(RETRY_BASE_DELAY_MS);
    await flushMicrotasks();

    expect(loadSpy).not.toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(tile.getState()).toBe(TileState.IDLE);

    loadSpy.mockRestore();
    setExternalTileRetryMapGetter();
    tile.load();
    await flushMicrotasks();
    expect(fetchSpy).toHaveBeenCalledTimes(2);

    await jest.advanceTimersByTimeAsync(RETRY_BASE_DELAY_MS);
    await flushMicrotasks();
    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });

  test('resetExternalTileRetryQueue снимает отложенный retry', async () => {
    fetchSpy.mockResolvedValue(asResponse(httpResponse(502)));

    const tile = createTile(EXTERNAL_URL);
    tile.load();
    await flushMicrotasks();
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const loadSpy = jest.spyOn(tile, 'load');
    resetExternalTileRetryQueue();

    await jest.advanceTimersByTimeAsync(20_000);
    await flushMicrotasks();

    expect(loadSpy).not.toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  test('resetExternalTileRetryQueue резолвит waiters без лишнего fetch', async () => {
    const tracker = trackFetchConcurrency();
    fetchSpy.mockImplementation(asFetch(tracker.impl));

    const tiles = Array.from({ length: EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT + 1 }, (_, i) => createTile(nspdUrl(i)));
    tiles.forEach(tile => tile.load());
    await settleLoads(fetchSpy);

    await jest.advanceTimersByTimeAsync(FETCH_TIMEOUT_MS);
    await settleLoads(fetchSpy);
    await jest.advanceTimersByTimeAsync(RETRY_BASE_DELAY_MS);
    await settleLoads(fetchSpy);

    expect(fetchSpy).toHaveBeenCalledTimes(EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT * 2 + 1);

    const waitingTile = tiles[EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT];
    const loadSpy = jest.spyOn(waitingTile, 'load');
    resetExternalTileRetryQueue();
    await flushMicrotasks();

    expect(loadSpy).not.toHaveBeenCalled();
    expect(fetchCountFor(fetchSpy, nspdUrl(EXTERNAL_TILE_MAX_RETRY_IN_FLIGHT))).toBe(1);
  });

  test('isExternalTileWanted: in-range true, далеко false, скрытый слой false, без getter true, getter без карты false', () => {
    const tile = createTile(EXTERNAL_URL);

    expect(isExternalTileWanted(tile)).toBe(true);

    setExternalTileRetryMapGetter((): Map | undefined => {
      return;
    });
    expect(isExternalTileWanted(tile)).toBe(false);

    const map = createRetryMap(true);
    setExternalTileRetryMapGetter(() => map);

    expect(isExternalTileWanted(tileFromSource(map, true))).toBe(true);
    expect(isExternalTileWanted(tileFromSource(map, false))).toBe(false);
    expect(isExternalTileWanted(createTile(EXTERNAL_URL, tileCoordInView(map, true)))).toBe(false);

    const hiddenMap = createRetryMap(true, false);
    setExternalTileRetryMapGetter(() => hiddenMap);

    expect(isExternalTileWanted(tileFromSource(hiddenMap, true))).toBe(false);
  });

  test('isExternalTileWanted: тайл скрытого слоя не нужен, даже если видимый слой покрывает те же координаты', () => {
    ensureResizeObserver();
    const target = document.createElement('div');
    target.style.width = '256px';
    target.style.height = '256px';
    document.body.append(target);

    const hiddenSource = new TileArcGISRest({
      url: `${EXTERNAL_URL}&hidden=1`,
      tileLoadFunction: externalGisMapServerLoadFunction
    });
    const visibleSource = new TileArcGISRest({
      url: `${EXTERNAL_URL}&visible=1`,
      tileLoadFunction: externalGisMapServerLoadFunction
    });
    const map = new Map({
      target,
      view: new View({ center: [0, 0], zoom: 5 }),
      layers: [
        new TileLayer({ visible: false, source: hiddenSource }),
        new TileLayer({ visible: true, source: visibleSource })
      ]
    });
    map.setSize([256, 256]);
    mapsToDispose.push(map);
    setExternalTileRetryMapGetter(() => map);

    expect(isExternalTileWanted(tileFromSource(map, true, hiddenSource))).toBe(false);
    expect(isExternalTileWanted(tileFromSource(map, true, visibleSource))).toBe(true);
  });
});
