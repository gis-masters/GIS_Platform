import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import type { Coordinate } from 'ol/coordinate';
import ImageTile from 'ol/ImageTile';
import TileLayer from 'ol/layer/Tile';
import Map, { type FrameState } from 'ol/Map';
import type TileSource from 'ol/source/Tile';
import TileArcGISRest from 'ol/source/TileArcGISRest';
import XYZ from 'ol/source/XYZ';
import type Tile from 'ol/Tile';
import TileState from 'ol/TileState';
import { getUid } from 'ol/util';
import View from 'ol/View';

import { MapWithBasemapPriority } from './MapWithBasemapPriority';

const BASEMAP_PRIORITY_OFFSET = 1_000_000_000;
const TILE_CENTER: Coordinate = [0, 0];
const TILE_RESOLUTION = 1000;

type MapFrameStateAccess = {
  frameState_: Pick<FrameState, 'wantedTiles' | 'viewState'> | FrameState | null;
};

const mapsToDispose: MapWithBasemapPriority[] = [];

function noopTileLoad(): void {
  return;
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

function disposeMaps(): void {
  for (const map of mapsToDispose) {
    const target = map.getTargetElement();
    map.setTarget();
    target?.remove();
  }
  mapsToDispose.length = 0;
}

function createBasemapSource(url = 'https://example.com/basemap/{z}/{x}/{y}.png'): XYZ {
  return new XYZ({
    url,
    tileLoadFunction: noopTileLoad
  });
}

function createOverlaySource(): TileArcGISRest {
  return new TileArcGISRest({
    url: 'https://example.com/arcgis/rest/services/export',
    tileLoadFunction: noopTileLoad
  });
}

function stubTile(src: string): ImageTile {
  return new ImageTile([0, 0, 0], TileState.IDLE, src, null, noopTileLoad);
}

function asFrameStateAccess(map: MapWithBasemapPriority): MapFrameStateAccess {
  return map as unknown as MapFrameStateAccess;
}

function clearFrameState(map: MapWithBasemapPriority): void {
  asFrameStateAccess(map).frameState_ = null;
}

function ensureFrameState(map: MapWithBasemapPriority): NonNullable<MapFrameStateAccess['frameState_']> {
  const access = asFrameStateAccess(map);
  if (!access.frameState_) {
    access.frameState_ = {
      wantedTiles: {},
      viewState: map.getView().getState()
    };
  }

  return access.frameState_;
}

function markWanted(map: MapWithBasemapPriority, source: TileSource, tile: Tile): void {
  const frameState = ensureFrameState(map);
  const sourceKey = getUid(source);
  if (!frameState.wantedTiles[sourceKey]) {
    frameState.wantedTiles[sourceKey] = {};
  }
  frameState.wantedTiles[sourceKey][tile.getKey()] = true;
}

function superPriority(map: MapWithBasemapPriority, tile: Tile, tileSourceKey: string): number {
  return Map.prototype.getTilePriority.call(map, tile, tileSourceKey, TILE_CENTER, TILE_RESOLUTION);
}

function createMap(
  basemapSource?: TileSource,
  overlaySource?: TileSource
): {
  map: MapWithBasemapPriority;
  basemapLayer: TileLayer<TileSource>;
} {
  ensureResizeObserver();
  const target = document.createElement('div');
  target.style.width = '256px';
  target.style.height = '256px';
  document.body.append(target);

  const basemapLayer = new TileLayer({ source: basemapSource });
  const layers: Array<TileLayer<TileSource>> = [basemapLayer];
  if (overlaySource) {
    layers.push(new TileLayer({ source: overlaySource }));
  }

  const map = new MapWithBasemapPriority(
    {
      target,
      view: new View({ center: [0, 0], zoom: 5 }),
      layers
    },
    basemapLayer
  );
  map.setSize([256, 256]);
  mapsToDispose.push(map);

  return { map, basemapLayer };
}

describe('MapWithBasemapPriority', () => {
  beforeEach(() => {
    ensureResizeObserver();
  });

  afterEach(() => {
    disposeMaps();
  });

  test('тайл текущего source подложки получает приоритет строго меньше, чем тайл TileArcGISRest', () => {
    const basemapSource = createBasemapSource();
    const overlaySource = createOverlaySource();
    const { map } = createMap(basemapSource, overlaySource);
    const basemapTile = stubTile('basemap');
    const overlayTile = stubTile('overlay');
    markWanted(map, basemapSource, basemapTile);
    markWanted(map, overlaySource, overlayTile);

    const basemapPriority = map.getTilePriority(basemapTile, getUid(basemapSource), TILE_CENTER, TILE_RESOLUTION);
    const overlayPriority = map.getTilePriority(overlayTile, getUid(overlaySource), TILE_CENTER, TILE_RESOLUTION);

    expect(basemapPriority).toBeLessThan(overlayPriority);
    expect(overlayPriority - basemapPriority).toBe(BASEMAP_PRIORITY_OFFSET);
  });

  test('DROP не ломается: без frameState или если тайл не wanted, для source подложки результат Infinity', () => {
    const basemapSource = createBasemapSource();
    const { map } = createMap(basemapSource);
    const basemapTile = stubTile('basemap');
    const sourceKey = getUid(basemapSource);

    clearFrameState(map);
    const withoutFrameState = map.getTilePriority(basemapTile, sourceKey, TILE_CENTER, TILE_RESOLUTION);

    expect(withoutFrameState).toBe(Infinity);
    expect(Number.isFinite(withoutFrameState)).toBe(false);

    ensureFrameState(map);
    const notWanted = map.getTilePriority(basemapTile, sourceKey, TILE_CENTER, TILE_RESOLUTION);

    expect(notWanted).toBe(Infinity);
    expect(Number.isFinite(notWanted)).toBe(false);
  });

  test('после basemapLayer.setSource буст у нового uid, у старого буста нет', () => {
    const oldSource = createBasemapSource('https://example.com/old/{z}/{x}/{y}.png');
    const newSource = createBasemapSource('https://example.com/new/{z}/{x}/{y}.png');
    const { map, basemapLayer } = createMap(oldSource);
    const oldTile = stubTile('old');
    const newTile = stubTile('new');
    markWanted(map, oldSource, oldTile);
    markWanted(map, newSource, newTile);

    expect(map.getTilePriority(oldTile, getUid(oldSource), TILE_CENTER, TILE_RESOLUTION)).toBe(
      superPriority(map, oldTile, getUid(oldSource)) - BASEMAP_PRIORITY_OFFSET
    );
    expect(map.getTilePriority(newTile, getUid(newSource), TILE_CENTER, TILE_RESOLUTION)).toBe(
      superPriority(map, newTile, getUid(newSource))
    );

    basemapLayer.setSource(newSource);

    expect(map.getTilePriority(oldTile, getUid(oldSource), TILE_CENTER, TILE_RESOLUTION)).toBe(
      superPriority(map, oldTile, getUid(oldSource))
    );
    expect(map.getTilePriority(newTile, getUid(newSource), TILE_CENTER, TILE_RESOLUTION)).toBe(
      superPriority(map, newTile, getUid(newSource)) - BASEMAP_PRIORITY_OFFSET
    );
  });

  test('нет source у basemapLayer: getTilePriority как у super, без вычитания и без падения', () => {
    const overlaySource = createOverlaySource();
    const { map } = createMap(undefined, overlaySource);
    const overlayTile = stubTile('overlay');
    markWanted(map, overlaySource, overlayTile);
    const overlayKey = getUid(overlaySource);

    expect(map.getTilePriority(overlayTile, overlayKey, TILE_CENTER, TILE_RESOLUTION)).toBe(
      superPriority(map, overlayTile, overlayKey)
    );
    expect(() => map.getTilePriority(overlayTile, overlayKey, TILE_CENTER, TILE_RESOLUTION)).not.toThrow();
  });

  test('не-подложка с тем же tileCenter и tileResolution не получает сдвиг', () => {
    const basemapSource = createBasemapSource();
    const overlaySource = createOverlaySource();
    const { map } = createMap(basemapSource, overlaySource);
    const overlayTile = stubTile('overlay');
    markWanted(map, overlaySource, overlayTile);
    const overlayKey = getUid(overlaySource);

    const overlayPriority = map.getTilePriority(overlayTile, overlayKey, TILE_CENTER, TILE_RESOLUTION);

    expect(overlayPriority).toBe(superPriority(map, overlayTile, overlayKey));
    expect(overlayPriority).not.toBe(superPriority(map, overlayTile, overlayKey) - BASEMAP_PRIORITY_OFFSET);
  });
});
